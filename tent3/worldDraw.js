function drawWorld(){
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.01, 1000.0, app.pMatrix);

  //vec3.negate( app.camera.position, app.camera.inversePosition )

  mat4.identity(app.mvMatrix);
/*
  // camera position and rotations
  mat4.rotate( app.mvMatrix, degToRad( app.camera.pitch ), [1,0,0] );
  // account for pitch rotation and light down vector
  mat4.rotate( app.mvMatrix, degToRad( app.camera.heading ), [0,1,0] );
  mat4.translate( app.mvMatrix, app.camera.inversePosition );
*/
  //  mat4.rotate(app.mvMatrix, degToRad(app.angle), [1, 0, 0]);
  gl.useProgram( shaderProgram );

/*  var normalMatrix = mat3.create();
  mat4.toInverseMat3(app.mvMatrix, normalMatrix);
  mat3.transpose(normalMatrix);
  mat3.multiplyVec3( normalMatrix, app.lightVectorStatic, app.lightVector )
  mat4.multiplyVec3( app.mvMatrix, app.lightLocationStatic, app.lightLocation )
  gl.uniform3fv( shaderProgram.lightLocation, app.lightLocation );
  gl.uniform3fv( shaderProgram.lightVector, app.lightVector );
  */
  setUniforms();

  vec3.multiply( app.kAmbi, app.ambient_Illumination,app.ambientProduct);

  switch(app.selectedCamera){
    case 0:
      mat4.translate(app.mvMatrix, [8, 0, app.zoom]);
      mat4.rotate(app.mvMatrix, degToRad(10), [0, 1, 0]);
      break;
    case 1:
      mat4.translate(app.mvMatrix, [15, 0, app.zoom]);
      mat4.rotate(app.mvMatrix, degToRad(20), [0, 1, 0]);
      break;
    case 2:
      mat4.translate(app.mvMatrix, [5, -10, app.zoom]);
      mat4.rotate(app.mvMatrix, degToRad(5), [0, 1, 0]);
      mat4.rotate(app.mvMatrix, degToRad(20), [1, 0, 0]);
      break;
    case 3:
      if (app.zoom > -10)
        app.zoom = -10;
      mat4.translate(app.mvMatrix, [-15, -10, app.zoom]);
      mat4.rotate(app.mvMatrix, degToRad(-16), [0, 1, 0]);
      break;
    default:
      mat4.translate(app.mvMatrix, [0, 0, app.zoom]);
      mat4.rotate(app.mvMatrix, degToRad(0), [0, 1, 0]);
      break;
  }



  gl.uniform3fv( shaderProgram.ambientProduct, mat4.flatten(app.ambientProduct));
  mvPushMatrix();

    mat4.translate(app.mvMatrix, [1.5, 0.0, -45.3]);
    mat4.rotate(app.mvMatrix, degToRad(270), [0, 1, 0]);
  //  mat4.rotate(app.mvMatrix, degToRad(app.angle), [1, 1, 0]);
    gl.uniform3fv( shaderProgram.lightSpecularColor, lightIntesity(0.05, 0.0, 5.0, 5.0 ) );
    drawObject( app.models.world, 1.0, [255.0,255.0,255.0,3.0]);
  mvPopMatrix();

    gl.uniform3fv( shaderProgram.ambientProduct, mat4.flatten(app.ambientProduct));
    mvPushMatrix();

      mat4.translate(app.mvMatrix, app.tank.position);
    //  mat4.rotate(app.mvMatrix, degToRad(10), [0, 1, 0]);
    //  mat4.rotate(app.mvMatrix, degToRad(app.angle), [1, 1, 0]);
      gl.uniform3fv( shaderProgram.lightSpecularColor, lightIntesity( 0.01, 4.0, 1.0, 0.1 ) );
      drawObject( app.models.tank, 100, [255.0,255.0,255.0,3.0]);
    mvPopMatrix();
/*
    mvPushMatrix();
      mat4.translate(app.mvMatrix, app.bubble.position);
      mat4.rotate(app.mvMatrix, degToRad(10), [0, 1, 0]);
      gl.uniform3fv( shaderProgram.lightSpecularColor, lightIntesity( 0.5, 1.0, 1.0, 0.1 ) );
      drawObject( app.models.bubble, 1.0, [255.0,255.0,255.0,3.0]);
    mvPopMatrix();
*/
    for (var c=0;c<app.bubbles.length;c++) {
        if (app.bubbles[c].visible) {
          mvPushMatrix();
            mat4.translate(app.mvMatrix, app.bubbles[c].position);
            mat4.rotate(app.mvMatrix, degToRad(10), [0, 1, 0]);
            gl.uniform3fv( shaderProgram.lightSpecularColor, lightIntesity( app.bubbleColor.i, app.bubbleColor.r, app.bubbleColor.g, app.bubbleColor.b ) );
          //gl.uniform3fv( shaderProgram.lightSpecularColor, lightIntesity( 0.05, 100.0 , 0.0,30.9 ));
            drawObject( app.models.bubble, 1.0, [255.0,255.0,255.0,3.0]);
          mvPopMatrix();
        }
    }

    for (var c=0;c<app.bombs.length;c++) {
      //  console.log(key);
        if (app.bombs[c].visible) {
          mvPushMatrix();
            mat4.translate(app.mvMatrix, app.bombs[c].position);
            mat4.rotate(app.mvMatrix, degToRad(10), [0, 1, 0]);
            gl.uniform3fv( shaderProgram.lightSpecularColor, lightIntesity( 0.01, 255.0, 255.0,255.0 ) );
            drawObject( app.models.bubbleBomb, 0.1, [255.0,255.0,255.0,3.0]);
          mvPopMatrix();
        }
    }
/*    for (var key in app.bombs) {
        if (app.bombs.hasOwnProperty(key) && app.bombs[key].visible) {
          mvPushMatrix();
            mat4.translate(app.mvMatrix, app.bombs[key].position);
            mat4.rotate(app.mvMatrix, degToRad(10), [0, 1, 0]);
            gl.uniform3fv( shaderProgram.lightSpecularColor, lightIntesity( 0.01, 255.0, 255.0,255.0 ) );
            drawObject( app.models.bubbleBomb, 0.1, [255.0,255.0,255.0,3.0]);
          mvPopMatrix();
        }
    }*/
}


//app.drawScene = drawMonkeyRoom1;
app.drawScene = drawWorld;
