var x = 100,y = 100;
var frame;

var bitmaps = [ 'train', 'speed1', 'speed2', 'speed3', 'horse', 'horsehappy', 'ground1', 'ground2', 'ground3', 'cloud1', 'cloud2', 'cloud3', 'sky' ];
var sprites = {};

var horsepos = 5;

var counter = 0;

var skypos = -256-282;

var bump = 0;

var playing = false;

var played = false;

var speed = 0.8;

var lost = false;

var out = true;

var score = 0;

function draw() {
        frame = 0;
        clear_to_color(canvas,makecol(255,255,255));
            
                            if (!check()) {
                    clear_to_color(canvas,makecol(0,0,0));
                                          textout_centre(canvas,font,"Klik tu!",512/2,512/2+32,64,makecol(255,255,255));                

                        return;
                    } 

        
        if (!started) {
            if (playing) {
                canvas.canvas.getContext('2d').drawImage(document.getElementById('video'), 0, 0, 512, 512);
            } else {
    textout(canvas,font,"Loading...",20, 50,24,makecol(0,0,0));                
            }
        } else {
            
            
                    clear_to_color(canvas,makecol(255,255,255));
            draw_sprite(canvas, sprites.sky, skypos, 91); // min 256+282 max -256-282+512
            draw_sprite(canvas, sprites.sky, skypos+1076, 91); // min 256+282 max -256-282+512

            draw_sprite(canvas, sprites['ground'+(~~(counter/20)%3+1)], 256, 343);
            draw_sprite(canvas, sprites['cloud'+(~~(counter/16)%3+1)], 178, 81);
            draw_sprite(canvas, sprites.train, 256, 256 - bump);
            draw_sprite(canvas, sprites['speed'+(~~(counter/20)%3+1)], 256, 256 - bump);
            
            
            draw_sprite(canvas, horsepos > 290 ? sprites.horsehappy : sprites.horse, 512+170 - horsepos, 220);


            if (lost) {
                
                rectfill(canvas, 0,0,512,512, makecol(0,0,0,192));
                textout_centre(canvas,font,"Koniec!",512/2,512/2-160,32,makecol(255,255,255));                
                textout_centre(canvas,font,"Wynik:",512/2,512/2-50,32,makecol(255,255,255));                

                textout_centre(canvas,font,~~score,512/2,512/2+50,64,makecol(255,255,255));                

                
                if (counter % 60 < 50) {
                    textout_centre(canvas,font,"Klik!",512/2,512/2+160,32,makecol(255,255,255));                
                } 
                
            } else {
            
                textout(canvas,font,~~score,20+1,490+1,32,makecol(0,0,0));                
                textout(canvas,font,~~score,20-1,490-1,32,makecol(0,0,0));                
                textout(canvas,font,~~score,20-1,490+1,32,makecol(0,0,0));                
                textout(canvas,font,~~score,20+1,490-1,32,makecol(0,0,0));                
                textout(canvas,font,~~score,20,490,32, makecol(255,255,horsepos > 290 ? 128 : 255));                

            }
        }
}

function check() {
 if(document.pointerLockElement !== canvas.canvas &&
  document.mozPointerLockElement !== canvas.canvas) {
    return false;
}

 if(document.fullscreenElement !== canvas.canvas &&
  document.mozFullScreenElement !== canvas.canvas &&
  document.webkitFullscreenElement !== canvas.canvas) {
    return false;
}

return true;
}

function update() {
	if (!frame) frame = requestAnimationFrame(draw);
        
                              if (!check()) {
                                  return;
                              }
  
        
        if (!played) {
                        var vid = document.getElementById('video');
                        
                        vid.addEventListener('playing', function() {
                            playing = true;
                                console.log('playing');
                        });
                        
                        if (vid.readyState == vid.HAVE_ENOUGH_DATA) {
                                if (!started) vid.play();
                                console.log('enough');
                        } else {
                                console.log('notenough', vid.readyState);
                                vid.addEventListener('canplaythrough', function() {
                                    if (!started) vid.play();
                                console.log('canplay');
                                });
                        }
                        
                        vid.addEventListener('ended', function() {
                            started = true;
                        });
played = true;            
        }
        
        if (!started) return;

        counter++;
        if (bump>=0) bump-=0.2;
        
        skypos+=0.5;
        if (skypos > 256+282) {
            skypos = -256-282;
        }

        if (horsepos < 0) {
            lost = true;
        }
        
        if (out) {
            horsepos += 10;
            if (horsepos >= 280) {
                out = false;
            }
        }
        
        if (lost) return;
        
        horsepos -= speed;
        score += 0.1;
        if (horsepos > 290) {
            score += 0.1;
        }
        speed += 0.0015;
        
}

var started = false;

function main()
{
	//enable_debug('debug');
	allegro_init_all("game_canvas", 512, 512);
        
        bitmaps.forEach(function(name) {
            sprites[name] = load_bmp(name+'.png');
        });
        
	ready(function(){
            
            setInterval(function() {
                bump = 2.5;
            }, 666);
            
                        canvas.canvas.addEventListener('mousemove', function(ev) {
                            if (lost) return;
                                horsepos -= ev.movementX / 3;
                                
                                if (horsepos > 300) horsepos = 300;
                                                       if (horsepos < 0) horsepos = 0;
                        });
            
            canvas.canvas.addEventListener('click', function() {
                
                if (lost) {
                    lost = false;
                    score = 0;
                    speed = 0.8;
                    out = true;
                    horsepos = 5;
                }
                
                if (played && !started) {
                                                var vid = document.getElementById('video');
                vid.currentTime = 60;
                }
                
                canvas.canvas.requestFullscreen = canvas.canvas.requestFullscreen ||
                            canvas.canvas.webkitRequestFullscreen || canvas.canvas.msRequestFullscreen || canvas.canvas.mozRequestFullScreen;
                canvas.canvas.requestFullscreen();

                canvas.canvas.requestPointerLock = canvas.canvas.requestPointerLock ||
                            canvas.canvas.mozRequestPointerLock;

                canvas.canvas.requestPointerLock();  
});

            
            loop(function(){
			clear_to_color(canvas,makecol(255,255,255));
			update();
		},BPS_TO_TIMER(60));
	});
	return 0;
}
END_OF_MAIN();
