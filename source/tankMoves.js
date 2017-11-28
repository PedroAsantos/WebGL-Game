
function moveTank(){

  // strafing left
  if( app.keys.pressed[ app.keys.LL ] ){
      if(app.tank.position[0]>-18.69){
        app.tank.position[0] +=-app.tank.velocity;
      }
  }
  if( app.keys.pressed[ app.keys.RR ] ){
    if(app.tank.position[0]<22.9){
          app.tank.position[0] += app.tank.velocity;
    }
  }

}
