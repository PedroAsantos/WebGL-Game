function moveBubbles(){
   detectCollisionBubbles();
  for (var bubbletemp in app.bubbles) {
        app.bubbles[bubbletemp].position[1]+=getBubbley(app.totaltime % 0.1,  app.bubbles[bubbletemp]);
        app.bubbles[bubbletemp].position[0]+=getBubblex(app.totaltime % 0.01,  app.bubbles[bubbletemp]);
  }


}

function getBubbley(t,bubble){
      if(bubble.position[1]> 3.9){
          bubble.up=false;
      }
      if(bubble.position[1]<-5.3){
          bubble.up=true;
      }

    if(bubble.up){
        return bubble.velocityUp*t+(bubble.accelarationUp*t*t)/2;
    }else{
        return bubble.velocityDown*t+(bubble.accelarationDown*t*t)/2;
    }

}
function getBubblex(t,bubble){
  if(bubble.position[0]> 25){
    bubble.forward=false;
  }
  if(bubble.position[0]<-23.4){
      bubble.forward=true;
  }

  if( bubble.forward){
      return 13.5*t
  }else{
      return -13.5*t
  }
  return 0;
}
function detectCollisionBomb(){
  for (var c=0;c<app.bombs.length;c++) {
      for (var bubble=0;bubble < app.bubbles.length;bubble++) {
        if (app.bombs[c].visible && app.bubbles[bubble].visible) {

            if(app.bombs[c].position[0] + app.bombs[c].radius + app.bubbles[bubble].radius >
            app.bubbles[bubble].position[0] && app.bombs[c].position[0] < app.bubbles[bubble].position[0] +
             app.bubbles[bubble].radius && app.bombs[c].position[1] + app.bombs[c].radius + app.bubbles[bubble].radius >
             app.bubbles[bubble].position[1] && app.bombs[c].position[1] < app.bubbles[bubble].position[1] +
              app.bubbles[bubble].radius){

                var deltaXSquared = app.bubbles[bubble].position[0]-app.bombs[c].position[0];
                var deltaYSquared = app.bubbles[bubble].position[1]-app.bombs[c].position[1];

                var sumRadiiSquared = app.bubbles[bubble].radius+app.bombs[c].radius;
                if(deltaXSquared*deltaXSquared + deltaYSquared*deltaYSquared <= sumRadiiSquared*sumRadiiSquared){
                  //bomb-bullet collision sound
                  var audio = new Audio('../sounds/collision.wav')
                  audio.play();
                  app.score+=1;
                  app.bombs[c].visible = false;
                  app.bubbles[bubble].visible=false;
                }

          }
        }

      }
  }
}
function detectCollisionBubbles(){
  for (var bubble1=0;bubble1 < app.bubbles.length;bubble1++) {
        for (var bubble2=bubble1+1;bubble2< app.bubbles.length;bubble2++) {
                if (app.bubbles[bubble1].visible && app.bubbles[bubble2].visible) {
                  if(app.bubbles[bubble1].position[0] + app.bubbles[bubble1].radius + app.bubbles[bubble2].radius >
                  app.bubbles[bubble2].position[0] && app.bubbles[bubble1].position[0] < app.bubbles[bubble2].position[0] +
                   app.bubbles[bubble2].radius && app.bubbles[bubble1].position[1] + app.bubbles[bubble1].radius + app.bubbles[bubble2].radius >
                   app.bubbles[bubble2].position[1] && app.bubbles[bubble1].position[1] < app.bubbles[bubble2].position[1] +
                    app.bubbles[bubble2].radius){

                      var deltaXSquared = app.bubbles[bubble1].position[0]-app.bubbles[bubble2].position[0];
                      var deltaYSquared = app.bubbles[bubble1].position[1]-app.bubbles[bubble2].position[1];

                      var sumRadiiSquared = app.bubbles[bubble1].radius+app.bubbles[bubble2].radius;
                      if(deltaXSquared*deltaXSquared + deltaYSquared*deltaYSquared <= sumRadiiSquared*sumRadiiSquared){

                        app.bubbles[bubble2].forward= !app.bubbles[bubble2].forward;
                        app.bubbles[bubble1].forward= !app.bubbles[bubble1].forward;
                      }
                  //      var collisionPointX = ((app.bubbles[bubble1.toString()].position[0] * app.bubbles[bubble2.toString()].radius) + (app.bubbles[bubble2.toString()].position[0] * app.bubbles[bubble1.toString()].radius)) / (app.bubbles[bubble1.toString()].radius + app.bubbles[bubble2.toString()].radius);
                  //      var collisionPointY = ((app.bubbles[bubble1.toString()].position[1] * app.bubbles[bubble2.toString()].radius) + (app.bubbles[bubble2.toString()].position[1] * app.bubbles[bubble1.toString()].radius)) / (app.bubbles[bubble1.toString()].radius + app.bubbles[bubble2.toString()].radius);

                    }

                    }
        }
    }
}

function collisionBubbleTank(){
  for (var bubble=0;bubble <app.bubbles.length;bubble++) {
    if (app.bubbles[bubble].visible) {
        var tank= {
          x: app.tank.position[0],
          y: app.tank.position[1],
          w:6,
          h:5,
            };
        tank.x-=4.5;
        tank.y-=5;
        var bubbletemp={
          x: app.bubbles[bubble].position[0],
          y: app.bubbles[bubble].position[1],
          r: app.bubbles[bubble].radius
        }

        if(tankCollingwithBubble(bubbletemp,tank)){
          //game over sound
          var audio = new Audio('../sounds/gameover.mp3')
          audio.play();
          app.lifes-=1;

          if(app.lifes==0){

            app.audio.main.pause();
            var audio = new Audio('../sounds/nooooooooohhhhh.wav')
            audio.play();
            document.getElementById("reloadTime").innerHTML = "";
          }
          app.bubbles[bubble].visible=false;
        }
    }
  }
}
function tankCollingwithBubble(bubble, tank) {
    var distX = Math.abs(bubble.x - tank.x - tank.w / 2);
    var distY = Math.abs(bubble.y - tank.y - tank.h / 2);

    if (distX > (tank.w / 2 + bubble.r)) {
        return false;
    }
    if (distY > (tank.h / 2 + bubble.r)) {
        return false;
    }

    if (distX <= (tank.w / 2)) {
        return true;
    }
    if (distY <= (tank.h / 2)) {
        return true;
    }

    var dx = distX - tank.w / 2;
    var dy = distY - tank.h / 2;
    return (dx * dx + dy * dy <= (bubble.r * bubble.r));
}

function getBombY(t,bomb){
      if(bomb.position[1]> 3.9){
          bomb.visible=false;
      }


    return 3.9*t+(bomb.accelaration*t*t)/2;

}

function moveBombs(){
  for (var c=0;c<app.bombs.length;c++) {
      if (app.bombs[c].visible) {
        var dif = getBombY(app.totaltime % 0.1,app.bombs[c]);
        app.bombs[c].position[1] +=dif;
      }
  }

}
function deleteBombs(){
  for (var c=0;c<app.bombs.length;c++) {
      if (app.bombs[c].visible==false) {
         app.bombs.splice(c,1);
      }
  }
}
function deleteBubbles(){
  for (var c=0;c<app.bubbles.length;c++) {
      if (app.bubbles[c].visible==false) {
         app.bubbles.splice(c,1);
      }
  }
}
function levelUp(){
    var audio = new Audio('../sounds/levelup.mp3')
    if(app.score > 40){
        app.level=5;
      if(app.bubbles.length<4){
        // level up sound
        audio.play();
        for(var c = 0;c<6;c++){
          var bubbletemp = generateBubble();
          app.bubbleColor.r=100.0;
          app.bubbleColor.g=0.0;
        }
      }
    }else if(app.score >20){
        app.level=4;
      if(app.bubbles.length<2){
        // level up sound
        audio.play();
        for(var c = 0;c<6;c++){
          var bubbletemp = generateBubble();
          app.bubbleColor.b=30.9;
        }
      }
    }else if(app.score >10){
        app.level=3;
      if(app.bubbles.length<4){
        // level up sound
        audio.play();
        for(var c = 0;c<3;c++){
          var bubbletemp = generateBubble();
          app.tank.speedShot = 0.2;
          app.bubbleColor.r=10.0;
          document.getElementById("reloadTime").innerHTML = "New Fire Rate Time!";
        }
      }
    }else if(app.score >5){
      app.level=2;
      if(app.bubbles.length<3){
         // level up sound
        audio.play();
        for(var c = 0;c<2;c++){
          var bubbletemp = generateBubble();
          app.bubbleColor.g=10.0;
        }
      }
    }else if(app.score >2){
      if(app.bubbles.length<2){
        // level up sound
        audio.play();
        for(var c = 0;c<2;c++){
          var bubbletemp = generateBubble();
        }
      }
    }else if(app.score >= 0){
        if(app.bubbles.length<2){
          for(var c = 0;c<2;c++){
            var bubbletemp = generateBubble();
          }
        }
    }
}
function generateBubble(){
    var bubbletemp = new Object();
    //verificar se a posição é longe de qq bola. :)
    bubbletemp.position = [getBubbleRandomXPosition(), 2.9, -45.3];
    bubbletemp.accelarationUp = -35.0905;
    bubbletemp.accelarationDown =  9.8905;
    bubbletemp.up = true;
    bubbletemp.forward = true;
    bubbletemp.radius = 1.1;
    bubbletemp.speedx = 3.9;
    bubbletemp.speedy= 3.9;
    bubbletemp.mass = 3.9;
    bubbletemp.velocityUp = 3.5;
    bubbletemp.velocityDown = -4;
    bubbletemp.particleTimeX=0;
    bubbletemp.particleTimeY=0;
    bubbletemp.visible=true;
    app.bubbles.push(bubbletemp);
    return bubbletemp;
}
function getBubbleRandomXPosition(){
  var getnewX=false;
  var newX=(Math.random() * (23 - (-18)) ) + (-18);
  while(!getnewX){
    newX=(Math.random() * (23 - (-18)) ) + (-18);
    if(distanceCheckBetweenNewBubble(newX)){
      getnewX=true;
    }
  }
  return newX;
}
function distanceCheckBetweenNewBubble(newX){
  var check=true;
  for(var c=0;c<app.bubbles.length;c++){
    if(Math.abs(newX-app.bubbles[c].position[0])<3){
      check=false;
      break;
    }
  }
  return check;
}
