function moveBubble(){
  app.bubble.position[1]+=gety(app.totaltime % 0.1);
  console.log(app.bubble.position[0]);
  app.bubble.position[0]+=getx(app.totaltime % 0.01);

}
function gety(t){
      if(app.bubble.position[1]> 3.9){
          app.bubble.up=false;
      }
      if(app.bubble.position[1]<-5){
          app.bubble.up=true;
      }

    if(app.bubble.up){
        return 3.9*t+(app.bubble.accelaration*t*t)/2
    }else{
        return -5*t+(-app.bubble.accelaration*t*t)/2
    }

}
function getx(t){
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
