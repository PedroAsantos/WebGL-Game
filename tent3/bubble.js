function moveBubbles(){
  detectCollision();

  for (var key in app.bubbles) {
      if (app.bubbles.hasOwnProperty(key)) {
        app.bubbles[key].position[1]+=getBubbley(app.totaltime % 0.1,  app.bubbles[key]);
  //      console.log(key,  app.bubbles[key].position[1],app.totaltime);
        app.bubbles[key].position[0]+=getBubblex(app.totaltime % 0.01,  app.bubbles[key]);
      }
  }
//    detectCollision();

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
  if(bubble.position[0]<-23.8){
      bubble.forward=true;
  }

  if( bubble.forward){
      return 13.5*t
  }else{
      return -13.5*t
  }
  return 0;
}

function detectCollision(){
  for (var bubble1=0;bubble1 < Object.keys(app.bubbles).length;bubble1++) {
        for (var bubble2=bubble1+1;bubble2<Object.keys(app.bubbles).length;bubble2++) {
                if(app.bubbles[bubble1.toString()].position[0] + app.bubbles[bubble1.toString()].radius + app.bubbles[bubble2.toString()].radius >
                app.bubbles[bubble2.toString()].position[0] && app.bubbles[bubble1.toString()].position[0] < app.bubbles[bubble2.toString()].position[0] +
                 app.bubbles[bubble2.toString()].radius && app.bubbles[bubble1.toString()].position[1] + app.bubbles[bubble1.toString()].radius + app.bubbles[bubble2.toString()].radius >
                 app.bubbles[bubble2.toString()].position[1] && app.bubbles[bubble1.toString()].position[1] < app.bubbles[bubble2.toString()].position[1] +
                  app.bubbles[bubble2.toString()].radius){
                      /* Since multiplications are less computationally expensive than square roots, you should speed up this code
                       by not performing the square root when calculating the distance, and instead square the sum of the radii.
                       The code below shows a sample implementation using this shortcut.
                      */
                      var deltaXSquared = app.bubbles[bubble1.toString()].position[0]-app.bubbles[bubble2.toString()].position[0];
                      var deltaYSquared = app.bubbles[bubble1.toString()].position[1]-app.bubbles[bubble2.toString()].position[1];

                      var sumRadiiSquared = app.bubbles[bubble1.toString()].radius+app.bubbles[bubble2.toString()].radius;
                      if(deltaXSquared*deltaXSquared + deltaYSquared*deltaYSquared <= sumRadiiSquared*sumRadiiSquared){
                        console.log("collision");
                        app.bubbles[bubble2.toString()].forward= !app.bubbles[bubble2.toString()].forward;
                        app.bubbles[bubble1.toString()].forward= !app.bubbles[bubble1.toString()].forward;
                  //      var collisionPointX = ((app.bubbles[bubble1.toString()].position[0] * app.bubbles[bubble2.toString()].radius) + (app.bubbles[bubble2.toString()].position[0] * app.bubbles[bubble1.toString()].radius)) / (app.bubbles[bubble1.toString()].radius + app.bubbles[bubble2.toString()].radius);
                  //      var collisionPointY = ((app.bubbles[bubble1.toString()].position[1] * app.bubbles[bubble2.toString()].radius) + (app.bubbles[bubble2.toString()].position[1] * app.bubbles[bubble1.toString()].radius)) / (app.bubbles[bubble1.toString()].radius + app.bubbles[bubble2.toString()].radius);
                    /*    if(app.bubbles[bubble1.toString()].position[1] > collisionPointY){
                            app.bubbles[bubble1.toString()].up= !app.bubbles[bubble1.toString()].up;
                        }
                        if(app.bubbles[bubble2.toString()].position[1] > collisionPointY){
                            app.bubbles[bubble2.toString()].up= !app.bubbles[bubble1.toString()].up;
                        }
                        if(app.bubbles[bubble1.toString()].position[0] < collisionPointX){
                            app.bubbles[bubble1.toString()].forward= !app.bubbles[bubble1.toString()].forward;
                        }
                        if(app.bubbles[bubble2.toString()].position[0] < collisionPointX){
                            app.bubbles[bubble2.toString()].forward= !app.bubbles[bubble1.toString()].forward;
                        }
                      */  // bubbleA and bubbleB are touching
                  /*     var newVelXBubble1 = (app.bubbles[bubble1.toString()].speedx * (app.bubbles[bubble1.toString()].mass - app.bubbles[bubble2.toString()].mass) +
                        (2 * app.bubbles[bubble2.toString()].mass * app.bubbles[bubble2.toString()].speedx)) / (app.bubbles[bubble1.toString()].mass + app.bubbles[bubble2.toString()].mass);
                        var newVelYBubble1 = (app.bubbles[bubble1.toString()].speedy * (app.bubbles[bubble1.toString()].mass - app.bubbles[bubble2.toString()].mass) +
                        (2 * app.bubbles[bubble2.toString()].mass * app.bubbles[bubble2.toString()].speedy))/ (app.bubbles[bubble1.toString()].mass + app.bubbles[bubble2.toString()].mass);

                        var newVelXBubbl2 = (app.bubbles[bubble2.toString()].speedx * (app.bubbles[bubble2.toString()].mass - app.bubbles[bubble1.toString()].mass) +
                        (2 * app.bubbles[bubble1.toString()].mass * app.bubbles[bubble1.toString()].speedx))/ (app.bubbles[bubble1.toString()].mass + app.bubbles[bubble2.toString()].mass);
                        var newVelYBubble2 = (app.bubbles[bubble2.toString()].speedy * (app.bubbles[bubble2.toString()].mass - app.bubbles[bubble1.toString()].mass) +
                        (2 * app.bubbles[bubble1.toString()].mass * app.bubbles[bubble1.toString()].speedy))/ (app.bubbles[bubble1.toString()].mass + app.bubbles[bubble2.toString()].mass);
*/

                      /*
                      double deltaXSquared = A.x - B.x; // calc. delta X
                      deltaXSquared *= deltaXSquared; // square delta X
                      double deltaYSquared = A.y - B.y; // calc. delta Y
                      deltaYSquared *= deltaYSquared; // square delta Y

                      // Calculate the sum of the radii, then square it
                      double sumRadiiSquared = A.radius + B.radius;
                      sumRadiiSquared *= sumRadiiSquared;

                      if(deltaXSquared + deltaYSquared <= sumRadiiSquared){
                      // A and B are touching
                      }
                      */
                }
              }
        }
    }
}

function getBombY(t,bomb){
      if(bomb.position[1]> 3.9){
          bomb.up=false;
      }
      if(bomb.position[1]<-6.3){
          bomb.up=true;
      }

    if(bomb.up){
        return 3.9*t+(bomb.accelaration*t*t)/2;
    }else{
        return -5*t+(-bomb.accelaration*t*t)/2;
    }
}

function moveBombs(){
  for (var key in app.bombs) {
      if (app.bombs.hasOwnProperty(key)) {
        var dif = getBombY(app.totaltime % 0.1,app.bombs[key]);
        app.bombs[key].position[1] +=dif;
      }
  }

}
