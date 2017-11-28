// globals

// Enums
var X = 0, Y = 1, Z = 2, H = 3, P = 4;
// gl context
var gl;
// the canvas we're working with
var canvas;
// application var holder
var app = {};
  //function tick is on?
  app.tick = false;
  app.angle = 0;
  // mesh holder
  app.meshes = {};
  // model holder
  app.models = {};
  // this model has a single texture image,
  // so there is no need to have more than one
  // texture holder
  app.textures = {};
  // keyboard key ids
  app.keys = {  LL: 37, RR: 39, PD: 34, PU: 33 };
  app.keys.pressed = {};
  for( key in app.keys ){
    app.keys.pressed[ app.keys[ key ] ] = false;
  }
  //sound
  app.audio={};
  app.audio.epic=new Audio('https://pedroasantos.github.io/sounds/epic.wav');
  app.audio.main=new Audio('../sounds/main.wav');
  //score
  app.score = 0;
  app.level = 1;
  app.lifes=3;
  // tank
  app.tank = {};
  app.tank.lastBombTime= 0;
  app.tank.position = [0.0, -6.0, -45.3];
  app.tank.velocity=0.1;
  app.tank.inicialVelocity=0.1;
  app.tank.speedShot = 1;
  //bubble
  app.bubbleColor = {}
  app.bubbleColor.i=0.1;
  app.bubbleColor.r=1.0;
  app.bubbleColor.g=1.0;
  app.bubbleColor.b=3.1;
  app.bubbles = [];
  app.bubbles[0] = new Object();
  app.bubbles[0].position = [-20.5, 2.9, -45.3];
  app.bubbles[0].accelarationUp = -35.0905;
  app.bubbles[0].accelarationDown =  9.8905;
  app.bubbles[0].up = true
  app.bubbles[0].forward = true;
  app.bubbles[0].radius = 1.1;
  app.bubbles[0].speedx = 3.9;
  app.bubbles[0].speedy= 3.9;
  app.bubbles[0].mass = 3.9;
  app.bubbles[0].velocityUp = 3.5;
  app.bubbles[0].velocityDown = -4;
  app.bubbles[0].particleTimeX=0;
  app.bubbles[0].particleTimeY=0;
  app.bubbles[0].visible=true;

  app.bubbles[1] = new Object();
  app.bubbles[1].position = [-10.5, 2.9, -45.3];
  app.bubbles[1].accelarationUp = -35.0905;
  app.bubbles[1].accelarationDown = 9.8905;
  app.bubbles[1].up = true;
  app.bubbles[1].forward = false;
  app.bubbles[1].radius = 1.1;
  app.bubbles[1].speedx = 3.9;
  app.bubbles[1].speedy= 3.9;
  app.bubbles[1].mass = 3.9;
  app.bubbles[1].velocityUp = 3.5;
  app.bubbles[1].velocityDown = -4;
  app.bubbles[1].particleTimeX=0;
  app.bubbles[1].particleTimeY=0;
  app.bubbles[1].visible=true;

  app.bubbles[2] = new Object();
  app.bubbles[2].position = [5, 2.9, -45.3];
  app.bubbles[2].accelarationUp = -35.0905;
  app.bubbles[2].accelarationDown = 9.8905;
  app.bubbles[2].up = true;
  app.bubbles[2].forward = false;
  app.bubbles[2].radius = 1.1;
  app.bubbles[2].speedx = 3.9;
  app.bubbles[2].speedy= 3.9;
  app.bubbles[2].mass = 3.9;
  app.bubbles[2].velocityUp = 3.5;
  app.bubbles[2].velocityDown = -4;
  app.bubbles[2].particleTimeX=0;
  app.bubbles[2].particleTimeY=0;
  app.bubbles[2].visible=true;

  app.bubbles[3] = new Object();
  app.bubbles[3].position = [15, 2.9, -45.3];
  app.bubbles[3].accelarationUp = -35.0905;
  app.bubbles[3].accelarationDown = 9.8905;
  app.bubbles[3].up = true;
  app.bubbles[3].forward = true;
  app.bubbles[3].radius = 1.1;
  app.bubbles[3].speedx = 3.9;
  app.bubbles[3].speedy= 3.9;
  app.bubbles[3].mass = 3.9;
  app.bubbles[3].velocityUp = 3.5;
  app.bubbles[3].velocityDown = -4;
  app.bubbles[3].particleTimeX=0;
  app.bubbles[3].particleTimeY=0;
  app.bubbles[3].visible=true;

/*  app.bubble = {};
  app.bubble.position= [1.5, 3.9, -45.3];
  app.bubble.accelaration = -60.0905;
  app.bubble.up = true;
  app.bubble.forward = true;
*/  app.bombs = [];

  // camera



  app.selectedCamera = 0;
  app.zoom = -1;
  // matrices
  app.elapsed = 0;
  app.totaltime = 0;
  // which function to use to draw
  app.drawScene;
  app.scenechange = false;
  // room light

  app.ambient_Illumination = [ 0.2,0.2, 0.2 ];
  app.kAmbi = [ 0.3, 0.3, 0.3 ];
  app.ambientProduct= vec3.create();

  app.lightLocationStatic = [0,2,1.5];
  app.lightVectorStatic = [0,-1,0];
  app.lightLocation = vec3.create();
  app.lightVector = vec3.create();
  app.ambientIntensity = 0.5;
  app.diffuseIntensity = 2.0;
  app.hasFlashlight = false;
  app.mvMatrix = mat4.create();
  app.mvMatrixStack = [];
  app.pMatrix = mat4.create();
  // animation references
  app.lastTime = 0;
  app.elapsed = 0;
  // which function to use to draw
  app.drawScene;

var shaderProgram;
var particleShaderProgram;
var light = 0;
var angle = 0;
