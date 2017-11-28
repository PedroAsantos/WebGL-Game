function initGL(canvas) {
  try {
    gl = canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
  } catch (e) {
  }
  if (!gl) {
    alert("Could not initialise WebGL, sorry :-(");
  }
}

function getShader(gl, id) {
  var shaderScript = document.getElementById(id);
  if (!shaderScript) {
    return null;
  }

  var str = "";
  var k = shaderScript.firstChild;
  while (k) {
    if (k.nodeType == 3) {
      str += k.textContent;
    }
    k = k.nextSibling;
  }

  var shader;
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function initShaders() {
  initParticleShaders();

  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }

  gl.useProgram(shaderProgram);

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

  shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
  shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");
  shaderProgram.modelColor = gl.getUniformLocation(shaderProgram, "uColor");
  shaderProgram.materialShininessUniform = gl.getUniformLocation(shaderProgram, "uMaterialShininess");
  shaderProgram.useTexturesUniform = gl.getUniformLocation(shaderProgram, "uUseTextures");
  shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");

  shaderProgram.ambientProduct = gl.getUniformLocation(shaderProgram, "ambientProduct");

  shaderProgram.hasTexure = gl.getUniformLocation(shaderProgram, "uHasTexure");
  shaderProgram.hasFlashlight = gl.getUniformLocation(shaderProgram, "uHasFlashlight");
  shaderProgram.lightLocation = gl.getUniformLocation(shaderProgram, "uLightLocation");
  shaderProgram.lightVector = gl.getUniformLocation(shaderProgram, "uSpotDirection");
  shaderProgram.lightSpecularColor = gl.getUniformLocation(shaderProgram, "uLightSpecularColor");
  shaderProgram.lightDiffuseColor = gl.getUniformLocation(shaderProgram, "uLightDiffuseColor");
}

function initParticleShaders() {
  var fragmentShader = getShader(gl, "particle-shader-fs");
  var vertexShader = getShader(gl, "particle-shader-vs");

  particleShaderProgram = gl.createProgram();
  gl.attachShader(particleShaderProgram, vertexShader);
  gl.attachShader(particleShaderProgram, fragmentShader);
  gl.linkProgram(particleShaderProgram);

  if (!gl.getProgramParameter(particleShaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }

  particleShaderProgram.particlePosition = gl.getAttribLocation(particleShaderProgram, "aParticlePosition");
  gl.enableVertexAttribArray(particleShaderProgram.particlePosition);

  particleShaderProgram.particleVector = gl.getAttribLocation(particleShaderProgram, "aParticleVector");
  gl.enableVertexAttribArray(particleShaderProgram.particleVector);

  particleShaderProgram.particleTTL = gl.getAttribLocation(particleShaderProgram, "aParticleTTL");
  gl.enableVertexAttribArray(particleShaderProgram.particleTTL);

  particleShaderProgram.time = gl.getUniformLocation(particleShaderProgram, "time");
  particleShaderProgram.samplerUniform = gl.getUniformLocation(particleShaderProgram, "uSampler");
  particleShaderProgram.pMatrixUniform = gl.getUniformLocation(particleShaderProgram, "uPMatrix");
  particleShaderProgram.mvMatrixUniform = gl.getUniformLocation(particleShaderProgram, "uMVMatrix");
}

function handleLoadedTexture(texture) {
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image );
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
  gl.generateMipmap(gl.TEXTURE_2D);

  gl.bindTexture(gl.TEXTURE_2D, null);
}

function initTexture( object, url) {
  object.texture = gl.createTexture();
  object.texture.image = new Image();
  object.texture.image.crossOrigin = "anonymous";
  object.texture.image.onload = function () {
    handleLoadedTexture( object.texture );
  }
  object.texture.image.src = url;
}

function initTextures(){
//  initTexture( app.models.tank,  "/source/Tank_dif.jpg");

}

function initBuffers() {
  // initialize the mesh's buffers
  for( mesh in app.meshes ){
    OBJ.initMeshBuffers( gl, app.meshes[ mesh ] );
    // this loops through the mesh names and creates new
    // model objects and setting their mesh to the current mesh
    app.models[ mesh ] = {};
    app.models[ mesh ].mesh = app.meshes[ mesh ];
  }
}

function restartGlobalVar(){

  var X = 0, Y = 1, Z = 2, H = 3, P = 4;
  // gl context
  var gl;
  // the canvas we're working with
  var canvas;


  app.angle = 0;
  // mesh holder

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
  //socre
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


  app.bombs = [];
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
  shaderProgram;
  particleShaderProgram;
  light = 0;
}
