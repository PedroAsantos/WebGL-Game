function keyDownHandler( e ){
  app.keys.pressed[ e.which ] = true;

  if(e.which == app.keys.LL || e.which == app.keys.RR ){
    if(app.tank.velocity<0.2){
      app.tank.velocity*=1.05;
    }
  }
  if(e.which == app.keys.PD){
    console.log("PD - before: " + app.zoom);
    app.zoom *= 1.15;
    console.log("PD - after: " + app.zoom);
  }
  if(e.which == app.keys.PU){
    console.log("PU - before: " + app.zoom);
    app.zoom *= 0.85;
    console.log("PU - after: " + app.zoom);

  }


}


function keyUpHandler( e ){
  app.keys.pressed[ e.which ] = false;
  if (e.which == 32 || e.which == 38) {

      var difTime = (app.timeNow-app.tank.lastBombTime)/1000;
      if(difTime>app.tank.speedShot || difTime==app.timeNow/1000){

        //shooting sound
        var audio = new Audio('../sounds/shoot.wav')
        audio.play();

         var bomb  = {};


         bomb.position = vec3.add(Object.values(app.tank.position),[-1,1,0]);
         bomb.up = true;
         bomb.accelaration = -10.0905;
         bomb.radius=0.75;
         bomb.visible = true;
         app.bombs.push(bomb);

         app.tank.lastBombTime = app.timeNow;
      }

  }


  if(e.which == "67"){
      app.selectedCamera = (app.selectedCamera + 1)%4;
      switch(app.selectedCamera){
        case 0:
          app.zoom = -1;
          break;
        case 1:
          app.zoom = -20;
          break;
        case 2:
          app.zoom = -10;
          break;
        case 3:
          app.zoom = -20;
          break;
        default:
          app.zoom = -1;
          break;
      }
    }else{
      app.tank.velocity=app.tank.inicialVelocity;
    }
}
