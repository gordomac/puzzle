"use strict";

var canvas;
var gl;
var won = 1;
var NumVertices  = 36*27;

var points = [];
var colors = [];
var axis = 0;
var direction2 = [-1,-1,1,-1,1,1,-1,1,1];
var centerFaces = [
	[-0.5,0,0],
	[0.5,0,0],
	[0, -0.5,0],
	[0, 0.5, 0],
	[0,0,-0.5],
	[0,0,0.5]
	];
var lastOrientation =[5,3];
var globTheta = mult(mat4(), rotate(0,[0,1,0]));
var globAngles = [0,0,0];
var lastMiddles = [1,1,1];
var thetaLoc;
var cubes;
var objAxis=[
	[1,0,0],
	[0,1,0],
	[0,0,1]
];

var program;
var vBuffer;
var vPosition;
var inter;
var switchDirection = 1;
var rotCounter = 0;
var speed = 15;
var dontRotate = 0;
2, 11, 20,5,14,23,8,17,26
var faceMatrix = resetFceMatrix();

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    cubes = colorCubes();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1, 0.9, 0.8, 1.0 );

    gl.enable(gl.DEPTH_TEST);
	
    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

	
    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
	
	
    //thetaLoc = gl.getUniformLocation(program, "theta");

    //event listeners for buttons
	
	document.getElementById( "direction" ).onclick = function () {
		//direction = 0;
		switchDirection = switchDirection * -1;
		for(var count = 0; count < 9; count++){
			direction2[count] = direction2[count]*-1;
		}
    };
	document.addEventListener("keydown", function(event) {
		var x = event.keyCode;
		var cenFacesCoord = [];
		if(rotCounter ==0 && dontRotate ==0){
			if (x == 87) {
				globTheta = mult(globTheta, rotate(15,[1,0,0]));
				/*
				globAngles[0] = globAngles[0] + 15;
				if(globAngles[0] > 45){
					globAngles[0] = globAngles[0]-90;
					var tempAngle = globAngles[1];
					globAngles[1] = globAngles[1]-globAngles[2];
					globAngles[2] = tempAngle+globAngles[2];
					switchFaces(0,-1);
					console.log("w");
					console.log(globTheta);
				}*/
				
				console.log(globTheta);
				render();
				requestAnimFrame(render);
			}
			if (x == 83) {
				globTheta = mult(globTheta, rotate(-15,[1,0,0]));
				globAngles[0] = globAngles[0] - 15;
				if(globAngles[0]  < -45){
					globAngles[0] = globAngles[0]+90;
					var tempAngle = globAngles[1];
					globAngles[1] = globAngles[1]+globAngles[2];
					globAngles[2] = -tempAngle+globAngles[2];
					//switchFaces(0,1);
					console.log("s");
				}
				render();
				requestAnimFrame(render);
			}
			if (x == 81) {
				globTheta = mult(globTheta, rotate(15,[0,0,1]));
				globAngles[2] = globAngles[2] + 15;
				if(globAngles[2] > 45){
					globAngles[2] = globAngles[2]-90;
					var tempAngle = globAngles[1];
					globAngles[1] = globAngles[1]-globAngles[0];
					globAngles[0] = tempAngle+globAngles[0];
					//switchFaces(2,-1);
					console.log("q");
				}
				render();
				requestAnimFrame(render);
			}
			if (x == 69) {
				globTheta = mult(globTheta, rotate(-15,[0,0,1]));
				globAngles[2] = globAngles[2] - 15;
				if(globAngles[2]  < -45){
					globAngles[2] = globAngles[2]+90;
					var tempAngle = globAngles[1];
					globAngles[1] = globAngles[1]+globAngles[0];
					globAngles[0] = -tempAngle+globAngles[0];
					//switchFaces(2,1);
					console.log("e");
				}
				render();
				requestAnimFrame(render);
			}
			if (x == 65) {
				globTheta = mult(globTheta, rotate(15,[0,1,0]));
				globAngles[1] = globAngles[1] + 15;
				if(globAngles[1] > 45){
					globAngles[1] = globAngles[1]-90;
					var tempAngle = globAngles[2];
					globAngles[2] = globAngles[2]+globAngles[0];
					globAngles[0] = -tempAngle+globAngles[0];
					//switchFaces(1,-1);
					console.log("a");
				}
				render();
				requestAnimFrame(render);
			}
			if (x == 68) {
				globTheta = mult(globTheta, rotate(-15,[0,1,0]));
				globAngles[1] = globAngles[1] - 15;
				if(globAngles[1]  < -45){
					globAngles[1] = globAngles[1]+90;
					var tempAngle = globAngles[2];
					globAngles[2] = globAngles[2]-globAngles[0];
					globAngles[0] = globAngles[0]+tempAngle;
					//switchFaces(1,1);
					console.log("d");
				}
				render();
				requestAnimFrame(render);
			}
			
			for(var count = 0; count <6; count++){
				var tempCoord =[0,0,0];
					for(var i = 0; i < 3; i++){
						for (var j =0; j<3; j++){
							tempCoord[i] = tempCoord[i] + globTheta[j][i]*centerFaces[count][j];
						}
					}
					cenFacesCoord.push(tempCoord);
			}
			var topFace = 0;
			var topFaceCoord = 0;
			var frontFace = 0;
			var frontFaceCoord =0;
			for(var count2 =0; count2<6; count2++ ){
				if(cenFacesCoord[count2][1] > topFaceCoord){
					topFaceCoord = cenFacesCoord[count2][1];
					topFace = count2;
				}
				if(cenFacesCoord[count2][2] < frontFaceCoord){
					frontFaceCoord = cenFacesCoord[count2][2];
					//console.log(frontFaceCoord);
					frontFace = count2;
				}
			}
			console.log(cenFacesCoord);
			console.log("FRONT"+frontFace + " :   " + topFace);
			//changeOrientation(frontFace,topFace);
			render();
			requestAnimFrame(render);
			
			if(x==84){
				rotateSide(0);
			}
			else if(x==89){
				rotateSide(1);
			}
			else if(x==85){
				rotateSide(2);
			}
			else if(x==71){
				rotateSide(3);
			}
			else if(x==72){
				rotateSide(4);
			}
			else if(x==74){
				rotateSide(5);
			}
			else if(x==66){
				rotateSide(6);
			}
			else if(x==78){
				rotateSide(7);
			}
			else if(x==77){
				rotateSide(8);
			}
		}
	});
	document.getElementById( "randomize" ).onchange = function (event) {
		speed = 1;
		var steps = parseInt(event.target.value);
        if(rotCounter == 0 && dontRotate == 0){
			dontRotate = 1;
			randomize(steps);
		}
    };
    document.getElementById( "save" ).onclick = function () {
	    	if(won == 0){
			document.getElementById("link").removeAttribute("hidden"); 
			console.log("WE DID IT");
		}
		else{
			console.log("NVM");
		}
		var saveString1 = "";
		var saveString2 = "";
        for(var count = 0; count < 27; count++){
			saveString1 = saveString1 + "" + cubes[2*count+1] + "?";	
		}
		for(var count2 = 0; count2 < 9; count2++){
			saveString2 = saveString2 + "" + faceMatrix[count2] + "?";	
		}
		console.log(saveString1 + saveString2);
		
    };
	document.getElementById("loadString").onkeydown = function(event){
		var string = event.target.value;
		var key = event.keyCode;
		var partsOfStr = string.split('?');
		if(key == 13){
			for(var count = 0; count < 27; count++){
				var eachVal = partsOfStr[count].split(',');
				for(var count2 = 0; count2 < 4; count2++){
					var temp = count2 * 4;
					var hold = [temp, temp+1,temp+2,temp+3];
					cubes[2*count+1][count2] = [parseFloat(eachVal[hold[0]]),parseFloat(eachVal[hold[1]]),parseFloat(eachVal[hold[2]]),parseFloat(eachVal[hold[3]])];
				}
			}
			for(var count2 = 27; count2< 36; count2++){
				var eachVal = partsOfStr[count2].split(',');
				for(var count3 = 0; count3<9; count3++){
					faceMatrix[count2-27][count3] = parseInt(eachVal[count3]);
				}
			}
			render();
			requestAnimFrame(render);
		}
	}
	document.getElementById( "front" ).onclick = function () {
		if(rotCounter == 0 && dontRotate == 0){
			rotateSide(0);
		}
	}
	document.getElementById( "sideMiddle" ).onclick = function () {
		if(rotCounter == 0 && dontRotate == 0){
			rotateSide(1);
		}
	}
	document.getElementById( "back" ).onclick = function () {
		if(rotCounter == 0 && dontRotate == 0){
			rotateSide(2);
		}
	}
	document.getElementById( "left" ).onclick = function () {
		if(rotCounter == 0 && dontRotate == 0){
			rotateSide(3);
		}
	}
	document.getElementById( "middle" ).onclick = function () {
		if(rotCounter == 0 && dontRotate == 0){
			rotateSide(4);
		}
	}
	document.getElementById( "right" ).onclick = function () {
		if(rotCounter == 0 && dontRotate == 0){
			rotateSide(5);
		}
	}
	document.getElementById( "bottom" ).onclick = function () {
		if(rotCounter == 0 && dontRotate == 0){
			rotateSide(6);
		}
	}
	document.getElementById( "frontMiddle" ).onclick = function () {
		if(rotCounter == 0 && dontRotate == 0){
			rotateSide(7);
		}
	}
	document.getElementById( "top" ).onclick = function () {
		if(rotCounter == 0 && dontRotate == 0){
			rotateSide(8);
		}
	}

    render();
}
function changeOrientation(fFace, tFace){
	//faceMatrix = resetFceMatrix();
	if(fFace != lastOrientation[0] || tFace != lastOrientation[1]){
		faceMatrix = resetFceMatrix();
		if(fFace == 0){
			switchFaces(1,-1);
			if(tFace == 2){
				switchFaces(2,1);
				switchFaces(2,1);
			}
			else if(tFace == 5){
				switchFaces(2,-1);
			}
			else if(tFace == 4){
				console.log("HELLO");
				switchFaces(2,-1);
			}
		}
		else if(fFace == 1){
			switchFaces(1,1);
		}
		else if(fFace == 3){
			switchFaces(0,-1);
		}
		else if(fFace == 2){
			switchFaces(0,1);
		}
		else if(fFace == 5){
			switchFaces(1,1);
			switchFaces(1,1);
		}
		else if(fFace ==4){
			if(tFace==1){
				switchFaces(2,1);
			}
		}
		
	}
	lastOrientation = [fFace, tFace];
}
//front
 //side middle
 //back
 //left
 //middle
 //right
 //bottom
 //front middle
//top
function switchFaces(axs,dir){
	
	if(axs == 0){
		var tempArr = [];
		var reorderArr;
		if(dir == 1){
			reorderArr = [6,7,8,3,4,5,2,1,0];
		}
		else{
			reorderArr = [8,7,6,3,4,5,0,1,2];
		}
		for(var faceCount = 0; faceCount<9; faceCount++){
			tempArr.push(faceMatrix[faceCount]);
		}
		for(var count = 0; count<9; count++){
			faceMatrix[count] = tempArr[reorderArr[count]];
		}
		if(dir == 1){
			if(lastMiddles[0]==lastMiddles[2]){
				direction2[1] = direction2[1]*-1;
				lastMiddles[0] = lastMiddles[0]*-1;
			}
			else {
				direction2[7] = direction2[7]*-1;
				lastMiddles[2] = lastMiddles[2]*-1;
			}
			var tempAx = objAxis[2];
			for(var ko = 0; ko < 3; ko++){
				tempAx[ko] = tempAx[ko]*-1;
			}
			objAxis[2] = objAxis[1];
			objAxis[1] = tempAx;
		}
		else{
			if(lastMiddles[0]==lastMiddles[2]){
				direction2[7] = direction2[7]*-1;
				lastMiddles[2] = lastMiddles[2]*-1;
			}
			else {
				direction2[1] = direction2[1]*-1;
				lastMiddles[0] = lastMiddles[0]*-1;
			}
			var tempAx = objAxis[1];
			for(var ko = 0; ko < 3; ko++){
				tempAx[ko] = tempAx[ko]*-1;
			}
			objAxis[1] = objAxis[2];
			objAxis[2] = tempAx;
		}
	}
	else if(axs == 1){
		var tempArr = [];
		var reorderArr;
		if(dir == -1){
			reorderArr = [3,4,5,2,1,0,6,7,8];
		}
		else{
			reorderArr = [5,4,3,0,1,2,6,7,8];
		}
		for(var faceCount = 0; faceCount<9; faceCount++){
			tempArr.push(faceMatrix[faceCount]);
		}
		for(var count = 0; count<9; count++){
			faceMatrix[count] = tempArr[reorderArr[count]];
		}
		if(dir == -1){
			if(lastMiddles[0]==lastMiddles[1]){
				direction2[1] = direction2[1]*-1;
				lastMiddles[0] = lastMiddles[0]*-1;
			}
			else {
				direction2[4] = direction2[4]*-1;
				lastMiddles[1] = lastMiddles[1]*-1;
			}
			var tempAx = objAxis[2];
			for(var ko = 0; ko < 3; ko++){
				tempAx[ko] = tempAx[ko]*-1;
			}
			objAxis[2] = objAxis[0];
			objAxis[0] = tempAx;			
		}
		else{
			if(lastMiddles[0]==lastMiddles[1]){
				direction2[4] = direction2[4]*-1;
				lastMiddles[1] = lastMiddles[1]*-1;
			}
			else {
				direction2[1] = direction2[1]*-1;
				lastMiddles[0] = lastMiddles[0]*-1;
			}
			var tempAx = objAxis[0];
			for(var ko = 0; ko < 3; ko++){
				tempAx[ko] = tempAx[ko]*-1;
			}
			objAxis[0] = objAxis[2];
			objAxis[2] = tempAx;
		}
		
	}
	else{
		var tempArr = [];
		var reorderArr;
		if(dir ==-1){
			reorderArr = [0,1,2,6,7,8,5,4,3];
		}
		else{
			reorderArr = [0,1,2,8,7,6,3,4,5];
		}
		for(var faceCount = 0; faceCount<9; faceCount++){
			tempArr.push(faceMatrix[faceCount]);
		}
		for(var count = 0; count<9; count++){
			faceMatrix[count] = tempArr[reorderArr[count]];
		}
		if(dir == -1){
			if(lastMiddles[2]==lastMiddles[1]){
				direction2[7] = direction2[7]*-1;
				lastMiddles[2] = lastMiddles[2]*-1;
			}
			else {
				direction2[4] = direction2[4]*-1;
				lastMiddles[1] = lastMiddles[1]*-1
				
			}
			var tempAx = objAxis[1];
			for(var ko = 0; ko < 3; ko++){
				//tempAx[ko] = tempAx[ko]*-1;
			}
			//objAxis[0] = objAxis[1];
			//objAxis[1] = tempAx;
			objAxis[1] = objAxis[2];
			objAxis[2] = objAxis[0];
			objAxis[0] = tempAx;			
		}
		else{
			if(lastMiddles[2]==lastMiddles[1]){
				direction2[4] = direction2[4]*-1;
				lastMiddles[1] = lastMiddles[1]*-1
			}
			else {
				direction2[7] = direction2[7]*-1;
				lastMiddles[2] = lastMiddles[2]*-1;
			}
			var tempAx = objAxis[1];
			for(var ko = 0; ko < 3; ko++){
				tempAx[ko] = tempAx[ko]*-1;
			}
			objAxis[1] = objAxis[0];
			objAxis[0] = tempAx;
		}	
	}
}
function switchMatrices(sideNom, dir){
	var tempFace = [];
	var tempC = [];
	for(var count = 0; count < 9; count++){
		tempC.push(faceMatrix[sideNom][count]);
		tempFace.push(cubes[2*tempC[count]+1]);
	}
	var arrClock = [6,3,0,7,4,1,8,5,2];
	var arrCounter = [2,5,8,1,4,7,0,3,6];
	for(var sCount = 0; sCount<9; sCount++){
		for(var fCount = 0; fCount<9; fCount++){
			for(var count3 = 0; count3<9; count3++){
				if(dir == 1){
					if(faceMatrix[sCount][fCount] == tempC[count3]){
						faceMatrix[sCount][fCount] = tempC[arrClock[count3]];
						break;
					}
				}
				else{
					if(faceMatrix[sCount][fCount] == tempC[count3]){
						faceMatrix[sCount][fCount] = tempC[arrCounter[count3]];
						break;
					}
				}

			}
			/*
			if(faceMatrix[sCount][fCount] == tempC[0]){
				faceMatrix[sCount][fCount] = tempC[6];
			}
			else if(faceMatrix[sCount][fCount] == tempC[1]){
				faceMatrix[sCount][fCount] = tempC[3];
			}
			else if(faceMatrix[sCount][fCount] == tempC[2]){
				faceMatrix[sCount][fCount] = tempC[0];
			}
			else if(faceMatrix[sCount][fCount] == tempC[3]){
				faceMatrix[sCount][fCount] = tempC[7];
			}
			else if(faceMatrix[sCount][fCount] == tempC[5]){
				faceMatrix[sCount][fCount] = tempC[1];
			}
			else if(faceMatrix[sCount][fCount] == tempC[6]){
				faceMatrix[sCount][fCount] = tempC[8];
			}
			else if(faceMatrix[sCount][fCount] == tempC[7]){
				faceMatrix[sCount][fCount] = tempC[5];
			}
			else if(faceMatrix[sCount][fCount] == tempC[8]){
				faceMatrix[sCount][fCount] = tempC[2];
			}*/
		}
	}
	var tempG = [];
	for(var count = 0; count < 9; count++){
		tempG.push(faceMatrix[sideNom][count]);
	}	
}
function resetFceMatrix(){
	var mtrx = [
		[ 0, 1, 2, 3, 4, 5, 6, 7, 8], //front
		[ 9,10,11,12,13,14,15,16,17], //side middle
		[24,25,26,21,22,23,18,19,20], //back
		[ 18, 9, 0, 21,12,3,24,15, 6], //left
		[ 1, 10,19, 4,13,22,7,16,25], //middle
		[ 2, 11, 20,5,14,23,8,17,26], //right
		[18,19,20, 9,10,11, 0, 1, 2], //bottom
		[ 3, 4, 5,12,13,14,21,22,23], //front middle
		[ 6, 7, 8,15,16,17,24,25,26] //top
	];
	return mtrx;
}
function checkFinish(){
	//Every cubes rotation matrix needs to be the same permutation of the identity matrix with rows * -1 or switched with eachother
	var finished = 0;
	var h = [];
	for(var q = 0; q < 27; q++){
		for( var count2 = 0; count2 < 4; count2++){
			var g = [];
			for( var count3 = 0; count3 < 4; count3++){
				var diff = Math.abs(cubes[2*q+1][count2][count3]-mat4()[count2][count3]);
				var value = Math.round(cubes[2*q+1][count2][count3]);
				if(q == 0){
					g.push(Math.round(cubes[2*q+1][count2][count3]));
				}
				else if(value != h[count2][count3] && q!=13){
					finished = 1;
					break;
				}
				
				/*
				if(diff > 0.001){
					finished = 1;
				}*/
			}
			if(q == 0){
				h.push(g);
			}
			
		}
	}
	if(finished == 0){
		alert("Congratulations! You've solved it! You did so amazingly fantastic, you should save the result");
		won = 0;
		//document.getElementsById("link").removeAttribute("hidden"); 
		//document.getElementById( "save" ).onclick = function () {};
	}
}
//front clockwise
//sidemiddle clockwise
//back counterclockwise
//left clockwise
//middle counterclockwise
//right counter clockwise
//top clockwise
//topmiddle counterclockwise
//bottom counter clockwise
function randomize(steps2){
		var step2 = 0;
		var interval = setInterval(function oneStep(){
			var j = Math.floor(Math.random()*9);
			/*
			if( j != 1){
				rotateSide(j);
			}*/
			rotateSide(Math.floor(Math.random()*9));
			step2 = step2+1;
			if(step2 >= steps2){
				dontRotate = 0;
				clearInterval(interval);
			}
		},300);
}

function rotateSide(sideNom){
	var zeta = 0;
	var ax;
	if(sideNom<3){
		ax = objAxis[2];
	}
	else if(sideNom<6){
		ax = objAxis[0];
	}
	else{
		ax = objAxis[1];
	}
	inter = setInterval(function rotating(){
		var tempJ = [];
		var direction = 1;
		if(sideNom==0 || sideNom==1 || sideNom==3 || sideNom==6){
			direction = -1;
		}
		direction = direction * switchDirection;
		for(var p = 0; p < 9; p++){
			var q = faceMatrix[sideNom][p];
			tempJ.push(q);
			cubes[2*q+1] = mult(cubes[2*q+1],rotate(3*switchDirection, ax));
			}
		rotCounter = rotCounter + 1;
		zeta = zeta+1;
		requestAnimFrame(render);
		if(zeta >= 30){
			rotCounter  = 0;
			switchMatrices(sideNom, direction2[sideNom]);
			checkFinish();
			clearInterval(inter);
		}
	},1);
		//requestAnimFrame(render);}, 1);
		
}


function colorCubes()
{
	var cubes = [];
	for(var cub = 0; cub<27; ++cub){
		var sides =[];
		var vertexes = [];
		vertexes = quad( 1, 0, 3, 2, cub, vertexes);
		vertexes = quad( 2, 3, 7, 6, cub, vertexes );
		vertexes = quad( 3, 0, 4, 7, cub, vertexes );
		vertexes = quad( 6, 5, 1, 2, cub, vertexes);
		vertexes = quad( 4, 5, 6, 7, cub, vertexes );
		vertexes = quad( 5, 4, 0, 1, cub, vertexes );
		cubes.push(vertexes);
		cubes.push(mat4());
	}
	return cubes;
}

function quad(a, b, c, d, cub, vertexes)
{
	var disX = 0;
	var disY = 0;
	var disZ = 0;
	var sep = 0.34;
	disX = (cub%3)*sep;
		
	var temp = cub%9;
	if(temp >= 6){
		disY = 2*sep;
	}
	else if(temp >=3){
		disY = sep;
	}
	if(cub >= 9){
		disZ = sep;
	}
	if(cub >= 18){
		disZ = 2*sep;
	}
    var vertices = [
        vec4( -0.5+disX, -0.5+disY,-0.18+disZ, 1.0 ),
        vec4( -0.5+disX,-0.18+disY,-0.18+disZ, 1.0 ),
        vec4(-0.18+disX,-0.18+disY,-0.18+disZ, 1.0 ),
        vec4(-0.18+disX, -0.5+disY,-0.18+disZ, 1.0 ),
        vec4( -0.5+disX, -0.5+disY, -0.5+disZ, 1.0 ),
        vec4( -0.5+disX,-0.18+disY, -0.5+disZ, 1.0 ),
        vec4(-0.18+disX,-0.18+disY, -0.5+disZ, 1.0 ),
        vec4(-0.18+disX, -0.5+disY, -0.5+disZ, 1.0 ),
		vec4(0,0,0, 1.0)
    ];

    var vertexColors = [
        [ 0.0, 0.0, 0.0, 1.0 ],  // black
        [ 1.0, 0.0, 0.0, 1.0 ],  // red
        [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
		[ 0.0, 0.0, 1.0, 1.0 ],  // blue
        [ 0.0, 1.0, 0.0, 1.0 ],  // green
		[ 1.0, 1.0, 1.0, 1.0 ],  // white
		[ 1.0, 0.65, 0.0, 1.0], //orange
        //[ 0.0, 1.0, 1.0, 1.0 ],  // cyan
        [ 0.9, 0.9, 0.9, 1.0 ]   // white
		[ 1.0, 0.0, 1.0, 1.0 ] //magenta
    ];

    // We need to parition the quad into two triangles in order for
    // WebGL to be able to render it.  In this case, we create two
    // triangles from the quad indices

    //vertex color assigned by the index of the vertex

    var indices = [ a, b, c, a, c, d ];
	var outer = false;
	var vertarray =[];
	var colarray =[];
	var aDist = length(vertices[a]);
	var bDist = length(vertices[b]);
	var cDist = length(vertices[c]);
	var dDist = length(vertices[d]);
	var obj = {vertix:vec4(),color:vec4()};
    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
		vertarray.push( vertices[indices[i]]);
		vertexes.push(vertices[indices[i]]);
        //colors.push( vertexColors[indices[i]] );

        // for solid colored faces use
		if(aDist > 1.1 && bDist > 1.1 && cDist > 1.1 && dDist>1.1){
			colors.push(vertexColors[a]);
			colarray.push(vertexColors[a]);
		}
		else{
			colors.push(vertexColors[0]);
			colarray.push(vertexColors[0]);
		}

    }
	//return {vertix:vertexes,color:colarray};
	return vertexes;
}
var count = 0;
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	count = count +1;
	var globMatrixLoc = gl.getUniformLocation(program,"globalRotMatrix");
	gl.uniformMatrix4fv(globMatrixLoc, false, flatten(globTheta));
	
	for( var k = 0; k < 27; k++){
		var rotMatrixLoc = gl.getUniformLocation(program,"rotMatrix");
		gl.uniformMatrix4fv(rotMatrixLoc, false, flatten(cubes[k*2+1]));
		gl.drawArrays( gl.TRIANGLES, k*36, 36 );
	}
	//gl.drawArrays( gl.TRIANGLES, 0, 36 );
    //theta[axis] +=0;
    //gl.uniform3fv(thetaLoc, theta);
    //requestAnimFrame( render );
}
