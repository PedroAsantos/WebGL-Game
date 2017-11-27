
function keyDownHandler( e ){
  app.keys.pressed[ e.which ] = true;
/*  if( e.which === 16 ){
    app.camera.speed = app.camera.runSpeed;
  }
  // f
  if( e.which === 70 ){
    app.hasFlashlight = !app.hasFlashlight;
  }
  // e
  if( e.which === 69  && !app.animate && vec3.length( app.camera.position ) < 1 ){
    startAnimations();
  }
*/

  if(e.which == app.keys.LL || e.which == app.keys.RR ){
    if(app.tank.velocity<0.2){
      app.tank.velocity*=1.05;
    }
  }


}

function keyUpHandler( e ){
  app.keys.pressed[ e.which ] = false;
  if (e.which == 32 || e.which == 38) {
  //    var cont=0;
      var difTime = (app.timeNow-app.tank.lastBombTime)/1000;
      if(difTime>1 || difTime==app.timeNow/1000){

        //shooting sound 
        var audio = new Audio('../sounds/shoot.wav')
        audio.play();

        /*  for (var key in app.bubbles) {
            if (app.bubbles.hasOwnProperty(key)) {
                if(key!=cont.toString()){
                  dictpos = cont.toString();
                  break;
                }
                cont+=1;
              }
          }
          if (typeof dictpos == 'undefined'){
             dictpos = Object.keys(app.bombs).length.toString();
          }*/
        var dictpos = Object.keys(app.bombs).length.toString();

         app.bombs[dictpos]=new Object();
         app.bombs[dictpos].position = vec3.add(Object.values(app.tank.position),[-1,1,0]);
         app.bombs[dictpos].up = true;
         app.bombs[dictpos].accelaration = -10.0905;
         app.bombs[dictpos].radius=0.75;
         app.bombs[dictpos].visible = true;

         app.tank.lastBombTime = app.timeNow;
      }

  }
  if(e.which == "67"){
    app.selectedCamera = (app.selectedCamera + 1)%4;
  }


/*  if( e.which == 16 ){
    app.camera.speed = app.camera.walkSpeed;
  }
*/
/*  if(e.which == app.keys.LL || e.which == app.keys.RR ){
    app.tank.velocity=app.tank.inicialVelocity;
  console.log("asd");
}*/

  app.tank.velocity=app.tank.inicialVelocity;
}