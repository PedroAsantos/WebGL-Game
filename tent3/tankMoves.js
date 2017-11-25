
function cameraKeyDownHandler( e ){
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
}

function cameraKeyUpHandler( e ){
  app.keys.pressed[ e.which ] = false;
/*  if( e.which == 16 ){
    app.camera.speed = app.camera.walkSpeed;
  }
*/

}

function moveTank(){
  var distance = app.elapsed * app.camera.speed;
//  var camX = 0, camZ = 0;
  var difx=0.2;
//  var pitchFactor = 1;//Math.cos( degToRad( app.camera.pitch ) );
  // strafing left
  if( app.keys.pressed[ app.keys.LL ] ){
      if(app.tank.position[0]>-18.69){
        app.tank.position[0] +=-difx;
      }
  }
  if( app.keys.pressed[ app.keys.RR ] ){
    if(app.tank.position[0]<23.3){
          app.tank.position[0] += difx;
    }
  }


}
