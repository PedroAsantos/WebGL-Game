function moveBubble(){
  app.bubble.position[1]+=getBubbley(app.totaltime % 0.1);
//  console.log(app.bubble.position[0]);
  app.bubble.position[0]+=getBubblex(app.totaltime % 0.01);

}
function getBubbley(t){
      if(app.bubble.position[1]> 3.9){
          app.bubble.up=false;
      }
      if(app.bubble.position[1]<-5.3){
          app.bubble.up=true;
      }

    if(app.bubble.up){
        return 3.9*t+(app.bubble.accelaration*t*t)/2;
    }else{
        return -5*t+(-app.bubble.accelaration*t*t)/2;
    }

}
function getBubblex(t){
  if(app.bubble.position[0]> 25){
      app.bubble.forward=false;
  }
  if(app.bubble.position[0]<-23.8){
      app.bubble.forward=true;
  }

  if(app.bubble.forward){
      return 13.5*t
  }else{
      return -16.5*t
  }
  return 0;
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
        console.log(app.bombs[key]);
        console.log("buble");
        var dif = getBombY(app.totaltime % 0.1,app.bombs[key]);
        app.bombs[key].position[1] +=dif;
      }
  }

}
