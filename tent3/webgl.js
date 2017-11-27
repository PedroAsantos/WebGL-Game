function animate() {
  app.timeNow = new Date().getTime();
  app.elapsed = app.timeNow - app.lastTime;
  if (app.lastTime != 0) {
    // animate stuff
    app.angle += (90 * app.elapsed) / 1000.0;
    moveTank();
    moveBubbles();
    moveBombs();
    detectCollisionBomb();
    deleteBombs();
    deleteBubbles();
    collisionBubbleTank();
    levelUp();
  /*  if( !app.camera.disable ){
      cameraMove();
    }
    if( app.camera.shake ){
      cameraShake();
    }*/
  }

  app.lastTime = app.timeNow;
  if(app.elapsed/1000 < 100000){
    app.totaltime +=app.elapsed/1000;
  }
}

function tick() {
  requestAnimFrame(tick);
  app.drawScene();
  animate();
  updateHtml();
}

function updateHtml(){

  document.getElementById("score").innerHTML = "Score:"+ app.score;
  document.getElementById("level").innerHTML = "Level:" + app.level;
  var heartLifes="";
  for(var c=0;c<app.lifes;c++){
    heartLifes+=" <3"
  }
  console.log(heartLifes);
  document.getElementById("lifes").innerHTML = "Lifes:" + heartLifes;

}
function webGLStart( meshes ) {
  app.meshes = meshes;
  canvas = document.getElementById("mycanvas");
  initGL(canvas);
  initShaders();
  initBuffers();
//  initTunnel();
//  initPointerLock();
  initTextures();

  document.onkeydown = keyDownHandler;
  document.onkeyup = keyUpHandler;

  //main sound
    //var audio = new Audio('../sounds/main.wav')
    //audio.loop = true;
    //audio.play();


  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  tick();
}

window.onload = function(){
  OBJ.downloadMeshes({
      'world':'models/worldBig.obj',
      //'tank':'downModels/source/Tank.obj',
      'tank':'/downModels/karchast-pbt-1b-1964-1967/source/PBT-1b.obj',
      'bubble':'models/bubble.obj',
      'bubbleBomb':'models/bubbleBomb.obj',
      'tunnel_ceiling':'models/tunnel_ceiling.obj',
      'tunnel_walls':'models/tunnel_walls.obj',
      'room_walls': 'models/room_walls.obj',
      'room_ceiling': 'models/room_ceiling.obj',
      'room_floor': 'models/room_floor.obj',
      'room_tunnel_ceiling': 'models/room_tunnel_ceiling.obj',
      'room_tunnel_walls': 'models/room_tunnel_walls.obj',
      'room_wall_broken': 'models/room_wall_broken.obj',
      'room_wall_unbroken': 'models/room_wall_unbroken.obj',
      'suzanne': 'models/suzanne.obj',
      'pedestal': 'models/pedestal.obj',
      'boulder': 'models/boulder.obj',
    },
    webGLStart
  );
};
