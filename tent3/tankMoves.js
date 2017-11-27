
function moveTank(){
  var distance = app.elapsed * app.camera.speed;
//  var camX = 0, camZ = 0;
//  var pitchFactor = 1;//Math.cos( degToRad( app.camera.pitch ) );
  // strafing left
  if( app.keys.pressed[ app.keys.LL ] ){
      if(app.tank.position[0]>-18.69){
        app.tank.position[0] +=-app.tank.velocity;
      }
  }
  if( app.keys.pressed[ app.keys.RR ] ){
    if(app.tank.position[0]<23.3){
          app.tank.position[0] += app.tank.velocity;
    }
  }
  console.log(app.tank.position);
/*  if( app.keys.pressed[ app.keys.UU ] || app.keys.pressed[ app.keys.SPACE ] ){
      console.log("sad");
  }*/
}
