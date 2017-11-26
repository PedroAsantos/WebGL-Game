// globals

// Enums
var X = 0, Y = 1, Z = 2, H = 3, P = 4;
// gl context
var gl;
// the canvas we're working with
var canvas;
// application var holder
var app = {};
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
  app.keys = {  LL: 37, RR: 39 };
  app.keys.pressed = {};
  for( key in app.keys ){
    app.keys.pressed[ app.keys[ key ] ] = false;
  }
  // tank
  app.tank = {};
  app.tank.position = [0.0, -6.0, -45.3];
  app.tank.velocity;
  app.tank.inicialVelocity=0.1;
  //bubble
  app.bubbles = {};
  app.bubbles["0"] = new Object();
  app.bubbles["0"].position = [-20.5, 2.9, -45.3];
  app.bubbles["0"].accelarationUp = -35.0905;
  app.bubbles["0"].accelarationDown =  9.8905;
  app.bubbles["0"].up = true
  app.bubbles["0"].forward = true;
  app.bubbles["0"].radius = 1.1;
  app.bubbles["0"].speedx = 3.9;
  app.bubbles["0"].speedy= 3.9;
  app.bubbles["0"].mass = 3.9;
  app.bubbles["0"].velocityUp = 3.5;
  app.bubbles["0"].velocityDown = -4;
  app.bubbles["0"].particleTimeX=0;
  app.bubbles["0"].particleTimeY=0;
  app.bubbles["1"] = new Object();
  app.bubbles["1"].position = [-10.5, 2.9, -45.3];
  app.bubbles["1"].accelarationUp = -35.0905;
  app.bubbles["1"].accelarationDown = 9.8905;
  app.bubbles["1"].up = true;
  app.bubbles["1"].forward = false;
  app.bubbles["1"].radius = 1.1;
  app.bubbles["1"].speedx = 3.9;
  app.bubbles["1"].speedy= 3.9;
  app.bubbles["1"].mass = 3.9;
  app.bubbles["1"].velocityUp = 3.5;
  app.bubbles["1"].velocityDown = -4;
  app.bubbles["1"].particleTimeX=0;
  app.bubbles["1"].particleTimeY=0;

  app.bubbles["2"] = new Object();
  app.bubbles["2"].position = [5, 2.9, -45.3];
  app.bubbles["2"].accelarationUp = -35.0905;
  app.bubbles["2"].accelarationDown = 9.8905;
  app.bubbles["2"].up = true;
  app.bubbles["2"].forward = false;
  app.bubbles["2"].radius = 1.1;
  app.bubbles["2"].speedx = 3.9;
  app.bubbles["2"].speedy= 3.9;
  app.bubbles["2"].mass = 3.9;
  app.bubbles["2"].velocityUp = 3.5;
  app.bubbles["2"].velocityDown = -4;
  app.bubbles["2"].particleTimeX=0;
  app.bubbles["2"].particleTimeY=0;

  app.bubbles["3"] = new Object();
  app.bubbles["3"].position = [15, 2.9, -45.3];
  app.bubbles["3"].accelarationUp = -35.0905;
  app.bubbles["3"].accelarationDown = 9.8905;
  app.bubbles["3"].up = true;
  app.bubbles["3"].forward = true;
  app.bubbles["3"].radius = 1.1;
  app.bubbles["3"].speedx = 3.9;
  app.bubbles["3"].speedy= 3.9;
  app.bubbles["3"].mass = 3.9;
  app.bubbles["3"].velocityUp = 3.5;
  app.bubbles["3"].velocityDown = -4;
  app.bubbles["3"].particleTimeX=0;
  app.bubbles["3"].particleTimeY=0;
/*  app.bubble = {};
  app.bubble.position= [1.5, 3.9, -45.3];
  app.bubble.accelaration = -60.0905;
  app.bubble.up = true;
  app.bubble.forward = true;
*/  app.bombs = {};

  // camera
  app.camera = {};
  app.camera.position = [0,0.3,3.7];
  app.camera.inversePosition = vec3.create();
  app.camera.heading = 0;
  app.camera.pitch = 0;
  app.camera.walkSpeed = 0.001;
  app.camera.runSpeed = 0.002;
  app.camera.speed = app.camera.walkSpeed;
  app.camera.sensitivity = 10;
  app.camera.disable = false;
  app.camera.shake = false;
  app.camera.shakeTimer = 0;
  app.camera.shakeFrequency = 100;
  app.camera.shakeAmplitude = 0.01;
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
  app.scenechange = false;
  // particles
  app.particles = {};
  app.particles.min = [-0.5,0.3,-0.1];
  app.particles.max = [0.5,0.7,0.1];
  app.particles.maxVector = 1;
  app.particles.TTL = 1;
  app.particles.rate = 1000; // current time rate ( real time vs slow mo )
  // monkey
  app.monkey = {};
  app.monkey.position = [0,0,0]
  // boulder
  app.boulder = {};
  app.boulder.position = [0,0.245,-2.21];
  app.boulder.rotation = 0;
  // animations
  app.animate = false;
  app.animations = {};
  app.animations.currentAnimation = 0;
    // move to the monkey
    app.animations.moveToMonkeyTime = 2; // framelength in seconds
    app.animations.moveToMonkeyStartTime = 0;
    app.animations.moveToMonkeyStartPosition = [];
    app.animations.moveToMonkeyStartHeadingPitch = [];
    app.animations.moveToMonkeyEndPosition = [0,0.3,0.3];
    // take the monkey
    app.animations.takeMonkeyTime = 1; // framelength in seconds
    app.animations.takeMonkeyStartTime = 0;
    app.animations.takeMonkeyStartPosition = [];
    app.animations.takeMonkeyEndPosition = [0,0,-0.2];
    // walls
    app.breakWalls = false;
    app.wallScale = 1;
    app.animations.boulderCrashStartTime = 0;
    // turn around
    app.animations.turnAroundTime = 1; // framelength in seconds
    app.animations.turnAroundStartTime = 0;

var shaderProgram;
var particleShaderProgram;
var light = 0;
var angle = 0;
