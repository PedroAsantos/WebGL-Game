
    var gl;
    function initGL(canvas) {
        try {
            gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.enable(gl.DEPTH_TEST);
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
    var shaderProgram;
    function initShaders() {
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
       shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
       shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
       shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
       shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
    }
     var mvMatrix = mat4.create();
     var mvMatrixStack = [];
     var pMatrix = mat4.create();
     function mvPushMatrix() {
         var copy = mat4.create();
         mat4.set(mvMatrix, copy);
         mvMatrixStack.push(copy);
     }
     function mvPopMatrix() {
         if (mvMatrixStack.length == 0) {
             throw "Invalid popMatrix!";
         }
         mvMatrix = mvMatrixStack.pop();
     }

    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
        var normalMatrix = mat3.create();
         mat4.toInverseMat3(mvMatrix, normalMatrix);
         mat3.transpose(normalMatrix);
         gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
    }

    var cubeVertexPositionBuffer;
    var cubeVertexTextureCoordBuffer;
    var cubeVertexIndexBuffer;
    var cubeVertexNormalBuffer;

    var weaponVertexTextureCoordBuffer;
    var weaponVertexPositionBuffer;
    var weaponVertexIndexBuffer;
    var weaponVertexNormalBuffer;
  //  var cubeVertexColorBuffer;
    function initBuffers() {
  /*    pyramidVertexPositionBuffer = gl.createBuffer();
       gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexPositionBuffer);
       var vertices = [
           // Front face
            0.0,  1.0,  0.0,
           -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
           // Right face
            0.0,  1.0,  0.0,
            1.0, -1.0,  1.0,
            1.0, -1.0, -1.0,
           // Back face
            0.0,  1.0,  0.0,
            1.0, -1.0, -1.0,
           -1.0, -1.0, -1.0,
           // Left face
            0.0,  1.0,  0.0,
           -1.0, -1.0, -1.0,
           -1.0, -1.0,  1.0
       ];
       gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
       pyramidVertexPositionBuffer.itemSize = 3;
       pyramidVertexPositionBuffer.numItems = 12;

        pyramidVertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexColorBuffer);
        var colors = [
            // Front face
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            // Right face
            1.0, 0.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            // Back face
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            // Left face
            1.0, 0.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 1.0
        ];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        pyramidVertexColorBuffer.itemSize = 4;
        pyramidVertexColorBuffer.numItems = 12;
*/   weaponVertexPositionBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, weaponVertexPositionBuffer);
     var verticesWeapon = [
         // Front face
         -0.15, -0.15,  0.15,
          0.15, -0.15,  0.15,
          0.15,  0.15,  0.15,
         -0.15,  0.15,  0.15,
         // Back face
         -0.15, -0.15, -0.15,
         -0.15,  0.15, -0.15,
          0.15,  0.15, -0.15,
          0.15, -0.15, -0.15,
         // Top face
         -0.15,  0.15, -0.15,
         -0.15,  0.15,  0.15,
          0.15,  0.15,  0.15,
          0.15,  0.15, -0.15,
         // Bottom face
         -0.15, -0.15, -0.15,
          0.15, -0.15, -0.15,
          0.15, -0.15,  0.15,
         -0.15, -0.15,  0.15,
         // Right face
          0.15, -0.15, -0.15,
          0.15,  0.15, -0.15,
          0.15,  0.15,  0.15,
          0.15, -0.15,  0.15,
         // Left face
         -0.15, -0.15, -0.15,
         -0.15, -0.15,  0.15,
         -0.15,  0.15,  0.15,
         -0.15,  0.15, -0.15,
     ];
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesWeapon), gl.STATIC_DRAW);
     weaponVertexPositionBuffer.itemSize = 3;
     weaponVertexPositionBuffer.numItems = 24;

     weaponVertexTextureCoordBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, weaponVertexTextureCoordBuffer);
     var textureCoordsWeapon = [
       // Front face
       0.0, 0.0,
       0.15, 0.0,
       0.15, 0.15,
       0.0, 0.15,
       // Back face
       0.15, 0.0,
       0.15, 0.15,
       0.0, 0.15,
       0.0, 0.0,
       // Top face
       0.0, 0.15,
       0.0, 0.0,
       0.15, 0.0,
       0.15, 0.15,
       // Bottom face
       0.15, 0.15,
       0.0, 0.15,
       0.0, 0.0,
       0.15, 0.0,
       // Right face
       0.15, 0.0,
       0.15, 0.15,
       0.0, 0.15,
       0.0, 0.0,
       // Left face
       0.0, 0.0,
       0.15, 0.0,
       0.15, 0.15,
       0.0, 0.15,
     ];
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordsWeapon), gl.STATIC_DRAW);
     weaponVertexTextureCoordBuffer.itemSize = 2;
     weaponVertexTextureCoordBuffer.numItems = 24;

     weaponVertexNormalBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, weaponVertexNormalBuffer);
     var vertexNormals = [
     // Front face
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

     // Back face
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,

     // Top face
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

     // Bottom face
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

     // Right face
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

     // Left face
     -1.0,  0.0,  0.0,
     -1.0,  0.0,  0.0,
     -1.0,  0.0,  0.0,
     -1.0,  0.0,  0.0,
     ];
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
     weaponVertexNormalBuffer.itemSize = 3;
     weaponVertexNormalBuffer.numItems = 24;

     weaponVertexIndexBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, weaponVertexIndexBuffer);
     var weaponVertexIndices = [
            0, 1, 2,      0, 2, 3,    // Front face
             4, 5, 6,      4, 6, 7,    // Back face
             8, 9, 10,     8, 10, 11,  // Top face
             12, 13, 14,   12, 14, 15, // Bottom face
             16, 17, 18,   16, 18, 19, // Right face
             20, 21, 22,   20, 22, 23  // Left face
     ];
     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(weaponVertexIndices), gl.STATIC_DRAW);
     weaponVertexIndexBuffer.itemSize = 1;
     weaponVertexIndexBuffer.numItems = 36;


     cubeVertexPositionBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
      var vertices = [
           // Front face
        /*   -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            1.0,  1.0,  1.0,
           -1.0,  1.0,  1.0,
      */     // Back face
           -1.0, -1.0, -1.0,
           -1.0,  1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0, -1.0, -1.0,
           // Top face
    /*       -1.0,  1.0, -1.0,
           -1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0, -1.0,
    */       // Bottom face
           -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0,  1.0,
           -1.0, -1.0,  1.0,
           // Right face
            1.0, -1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0,  1.0,  1.0,
            1.0, -1.0,  1.0,
           // Left face
           -1.0, -1.0, -1.0,
           -1.0, -1.0,  1.0,
           -1.0,  1.0,  1.0,
           -1.0,  1.0, -1.0,
       ];
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
     cubeVertexPositionBuffer.itemSize = 3;
     cubeVertexPositionBuffer.numItems = 16;

     cubeVertexTextureCoordBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
     var textureCoords = [
       // Front face
  /*     0.0, 0.0,
       1.0, 0.0,
       1.0, 1.0,
       0.0, 1.0,
  */     // Back face
       1.0, 0.0,
       1.0, 1.0,
       0.0, 1.0,
       0.0, 0.0,
/*       // Top face
       0.0, 1.0,
       0.0, 0.0,
       1.0, 0.0,
       1.0, 1.0,
*/       // Bottom face
       1.0, 1.0,
       0.0, 1.0,
       0.0, 0.0,
       1.0, 0.0,
       // Right face
       1.0, 0.0,
       1.0, 1.0,
       0.0, 1.0,
       0.0, 0.0,
       // Left face
       0.0, 0.0,
       1.0, 0.0,
       1.0, 1.0,
       0.0, 1.0,
     ];
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
     cubeVertexTextureCoordBuffer.itemSize = 2;
     cubeVertexTextureCoordBuffer.numItems = 16;
     cubeVertexIndexBuffer = gl.createBuffer();
     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
     var cubeVertexIndices = [
         0, 1, 2,      0, 2, 3,    // Front face
         4, 5, 6,      4, 6, 7,    // Back face
         8, 9, 10,     8, 10, 11,  // Top face
         12, 13, 14,   12, 14, 15, // Bottom face
    //     16, 17, 18,   16, 18, 19, // Right face
    //     20, 21, 22,   20, 22, 23  // Left face
     ];
     gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
     cubeVertexIndexBuffer.itemSize = 1;
     cubeVertexIndexBuffer.numItems = 24;
     cubeVertexNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
  var vertexNormals = [
    // Front face
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,
     0.0,  0.0,  1.0,

    // Back face
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,
     0.0,  0.0, -1.0,

    // Top face
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,
     0.0,  1.0,  0.0,

    // Bottom face
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,
     0.0, -1.0,  0.0,

    // Right face
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,
     1.0,  0.0,  0.0,

    // Left face
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
    -1.0,  0.0,  0.0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
  cubeVertexNormalBuffer.itemSize = 3;
  cubeVertexNormalBuffer.numItems = 24;
/*
    cubeVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexColorBuffer);
    colors = [
      [1.0, 0.0, 0.0, 1.0],     // Front face
      [1.0, 1.0, 0.0, 1.0],     // Back face
      [0.0, 1.0, 0.0, 1.0],     // Top face
      [1.0, 0.5, 0.5, 1.0],     // Bottom face
      [1.0, 0.0, 1.0, 1.0],     // Right face
      [0.0, 0.0, 1.0, 1.0],     // Left face
    ];
    var unpackedColors = [];
    for (var i in colors) {
      var color = colors[i];
      for (var j=0; j < 4; j++) {
        unpackedColors = unpackedColors.concat(color);
      }
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(unpackedColors), gl.STATIC_DRAW);
    cubeVertexColorBuffer.itemSize = 4;
    cubeVertexColorBuffer.numItems = 24;
*/

    }
    var xRot = 30;
    var yRot = 10;
    var zRot = 0;
    function drawScene() {
          gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
          mat4.identity(mvMatrix);
          mat4.translate(mvMatrix, [0.0, 0.0, -4.3]);

         mat4.rotate(mvMatrix, degToRad(xRot), [1, 0, 0]);
         mat4.rotate(mvMatrix, degToRad(yRot), [0, 1, 0]);
         mat4.rotate(mvMatrix, degToRad(zRot), [0, 0, 1]);


  /*        mvPushMatrix();

          mat4.rotate(mvMatrix, degToRad(rPyramid), [0, 1, 0]);
          gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexPositionBuffer);
          gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, pyramidVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
          gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexColorBuffer);
          gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, pyramidVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
          setMatrixUniforms();
          gl.drawArrays(gl.TRIANGLES, 0, pyramidVertexPositionBuffer.numItems);
          mvPopMatrix();

    */

          mvPushMatrix();
          gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexPositionBuffer);
          gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

          gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexNormalBuffer);
          gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

          gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexTextureCoordBuffer);
          gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, neheTexture);
          gl.uniform1i(shaderProgram.samplerUniform, 0);
          var lighting = true;
          gl.uniform1i(shaderProgram.useLightingUniform, lighting);
          if (lighting) {
              gl.uniform3f(
                  shaderProgram.ambientColorUniform,
                  0.2,
                  0.2,
                  0.2
              );
              var lightingDirection = [
                  -8.0,
                  5,
                  0.5
              ];
              var adjustedLD = vec3.create();
              vec3.normalize(lightingDirection, adjustedLD);
              vec3.scale(adjustedLD, -1);
              gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
              gl.uniform3f(
                  shaderProgram.directionalColorUniform,
                0.8,
                0.8,
                0.8
              );
              }

              gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndexBuffer);
              setMatrixUniforms();
              gl.drawElements(gl.TRIANGLES, cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
             mvPopMatrix();

             mvPushMatrix();
             mat4.rotate(mvMatrix, degToRad(rCube), [0, 0, 1]);
             gl.bindBuffer(gl.ARRAY_BUFFER, weaponVertexPositionBuffer);
             gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, weaponVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

             gl.bindBuffer(gl.ARRAY_BUFFER, weaponVertexNormalBuffer);
             gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, weaponVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

             gl.bindBuffer(gl.ARRAY_BUFFER, weaponVertexTextureCoordBuffer);
             gl.vertexAttribPointer(shaderProgram.weaponVertexTextureCoordBuffer, weaponVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
             gl.activeTexture(gl.TEXTURE0);
             gl.bindTexture(gl.TEXTURE_2D, weaponTexture);
             gl.uniform1i(shaderProgram.samplerUniform, 0);
             var lighting = true;
             gl.uniform1i(shaderProgram.useLightingUniform, lighting);
             if (lighting) {
                 gl.uniform3f(
                     shaderProgram.ambientColorUniform,
                     0.2,
                     0.2,
                     0.2
                 );
                 var lightingDirection = [
                     -8.0,
                     5,
                     0.5
                 ];
                 var adjustedLD = vec3.create();
                 vec3.normalize(lightingDirection, adjustedLD);
                 vec3.scale(adjustedLD, -1);
                 gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
                 gl.uniform3f(
                     shaderProgram.directionalColorUniform,
                   0.8,
                   0.8,
                   0.8
                 );
                 }

                 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, weaponVertexIndexBuffer);
                 setMatrixUniforms();
                 gl.drawElements(gl.TRIANGLES, weaponVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
                mvPopMatrix();


      }
    function webGLStart() {
        var canvas = document.getElementById("lesson01-canvas");
        initGL(canvas);
        initShaders();
        initBuffers();
        initTexture();
        tick();

    }
    var neheTexture;
    var weaponTexture;
    function initTexture() {
      neheTexture = gl.createTexture();
      neheTexture.image = new Image();
      neheTexture.image.onload = function() {
        handleLoadedTexture(neheTexture)
      }

      neheTexture.image.src = "blue.jpg";

      weaponTexture = gl.createTexture();
      weaponTexture.image = new Image();
      weaponTexture.image.onload = function() {
        handleLoadedTexture(weaponTexture)
      }

      weaponTexture.image.src = "grey.jpg";
    }
    function handleLoadedTexture(texture) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
    function tick() {
      requestAnimFrame(tick);
      drawScene();
      animate();

    }
    var rPyramid = 0;
    var rCube = 0;

    var lastTime = 0;

    function animate() {
       var timeNow = new Date().getTime();
       if (lastTime != 0) {
         var elapsed = timeNow - lastTime;

         rPyramid += (90 * elapsed) / 1000.0;
         rCube += (75 * elapsed) / 1000.0;
       }
       lastTime = timeNow;
    }
    function degToRad(degrees) {
           return degrees * Math.PI / 180;
    }
