const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.lineWidth = 4;
ctx.strokeStyle = "black";
let Xcoord;
let Ycoord;
let radius = 12;
let distance;
let distanceToCenter;
let matrix = [];
let PlayerOne = true;
let List = [[],[],[]];
let ListOfEveryLine = [];
let index = 0;
let startingLineColor = 0;
let randomNumber = 0;


function init(y,x) {
  matrix = [];
  List = [[],[],[]];
  ListOfEveryLine = [];
  index = 0;
  ctx.strokeStyle = "black";
  Xcoord = x;
  Ycoord = y;
  document.getElementById("gameBoardId").style.display = "grid";
  document.getElementById("menuId").style.display = "none";
  document.getElementById("backButtonId1").style.display = "inline";
  document.getElementById("backButtonId").style.display = "none";
  document.getElementById("playerTurn").style.display = "block";
  distance = (700)/(y+1);
  distanceToCenter = (1000 - distance*(x+1))/2; 

  if(PlayerOne){
    document.getElementById("leftLineID").style.backgroundColor = "red";
    document.getElementById("rightLineID").style.backgroundColor = "red";
  }
  else{
    document.getElementById("leftLineID").style.backgroundColor = "yellow";
    document.getElementById("rightLineID").style.backgroundColor = "yellow";
  }
  if (y === 8 && x === 14){
    matrix = [[1,1,1,1,0,0,0,0,0,0,1,1,1,1],
              [1,1,1,0,0,0,0,0,0,0,0,1,1,1],
              [1,1,0,0,0,0,0,0,0,0,0,0,1,1],
              [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
              [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
              [1,1,0,0,0,0,0,0,0,0,0,0,1,1],
              [1,1,1,0,0,0,0,0,0,0,0,1,1,1],
              [1,1,1,1,0,0,0,0,0,0,1,1,1,1]];
    for(let i = 1; i <= y;i++){
      for(let j = 1;j <= x; j++){
          if(matrix[i-1][j-1]===0){
            ctx.beginPath();
            ctx.arc(j*distance + distanceToCenter,i*distance, radius, 0, 2*Math.PI);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.stroke();
          }
        }
      }

  }
  else {
    for(let i = 0; i< y;i++){
      matrix.push([]);
      for(let j = 0; j<x; j++){
        matrix[i].push(0);
      }
    }
    for(let i = 1; i <= y;i++){
      for(let j = 1;j <= x; j++){
        ctx.beginPath();
        ctx.arc(j*distance + distanceToCenter,i*distance, radius, 0, 2*Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.stroke();
      }
    }
  }
  if(PlayerOne){
    ctx.strokeStyle = "red";
  }
  else {
    ctx.strokeStyle = "yellow";
  }
}


function playGame(event) {
  let x = event.clientX - canvas.offsetLeft;
  let y = event.clientY - canvas.offsetTop;
  
  for(let i = 1; i <= Ycoord;i++){
    for(let j = 1;j <= Xcoord; j++){
      const circleX = j * distance + distanceToCenter;
      const circleY = i * distance;
      const d = Math.sqrt(Math.pow(x - circleX, 2) + Math.pow(y - circleY, 2));
      if(d <= radius && matrix[i-1][j-1] !== 1){
        matrix[i-1][j-1] = 1;
        List[index].push(circleX);
        List[index].push(circleY);
        List[index].push(i-1);
        List[index].push(j-1);
        index++;
        ctx.beginPath();
        if(PlayerOne){
          ctx.strokeStyle = "red";
          ctx.fillStyle = "red";
        }
        else {
          ctx.strokeStyle = "yellow";
          ctx.fillStyle = "yellow";
        }
        ctx.arc(j*distance + distanceToCenter,i*distance, radius, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
      }
    }
  }
  if(List[0].length != 0 && List[1].length != 0 && List[2].length != 0){
    if(checkForLineCrossing() || condition() || (List[0][2] === List[1][2] && List[1][2] === List[2][2]) || (List[0][3] === List[1][3] && List[1][3] === List[2][3])){
      resetMatrix();
      resetColors();
      reset();
      window.alert("Invalid move: Next players turn!");
      PlayerOne = !PlayerOne;
      if(PlayerOne){
        document.getElementById("leftLineID").style.backgroundColor = "red";
        document.getElementById("rightLineID").style.backgroundColor = "red";
      }
      else{
        document.getElementById("leftLineID").style.backgroundColor = "yellow";
        document.getElementById("rightLineID").style.backgroundColor = "yellow";
      }

    }
    else{
      randomNumber = Math.floor(Math.random()*101);
      drawTriangle();
      setDisabledCircles();
      for(let i = 0; i < 3;i++){
        let TemporaryList = [];
        if(i === 2){
          TemporaryList.push(List[i][0]);
          TemporaryList.push(List[i][1]);
          TemporaryList.push(List[0][0]);
          TemporaryList.push(List[0][1]);
        }
        else {
          TemporaryList.push(List[i][0]);
          TemporaryList.push(List[i][1]);
          TemporaryList.push(List[i+1][0]);
          TemporaryList.push(List[i+1][1]);
        }
        ListOfEveryLine.push(TemporaryList);
      }
      reset();
      PlayerOne = !PlayerOne;
      if(PlayerOne){
        document.getElementById("leftLineID").style.backgroundColor = "red";
        document.getElementById("rightLineID").style.backgroundColor = "red";
      }
      else{
        document.getElementById("leftLineID").style.backgroundColor = "yellow";
        document.getElementById("rightLineID").style.backgroundColor = "yellow";
      }
      if(randomNumber>50){
        randomFunction();
      }
    }
    if(isGameOver()){
      document.getElementById("gameBoardId").style.pointerEvents = "none";
      document.getElementById("gameBoardId").style.opacity= "0.5";
      document.getElementById("endPopUp").style.display = "flex";
      if(!PlayerOne){
        document.getElementById("endPopUp").style.backgroundColor = "red";
        document.getElementById("whoWon").innerHTML = "Player A WON!";
      }
      else {
        document.getElementById("endPopUp").style.backgroundColor = "yellow";
        document.getElementById("whoWon").innerHTML = "Player B WON!";
      }
    }
    reset();
  }
}

function randomFunction(){
  let numberOfCircles = 0;
  for(let i = 0; i < Ycoord;i++){
    for (let j = 0; j < Xcoord; j++){
      if(matrix[i][j] === 0){
        numberOfCircles++;
      }
    }
  }
  let listOfRandomNumbers = [];
  let num = Math.floor(Math.random()*4);
  for (let i = 0; i<num;i++){
    if(numberOfCircles===0) break;
    let x1;
    let x2;
    do{
      x1 = Math.floor(Math.random() * (Ycoord));
      x2 = Math.floor(Math.random() * (Xcoord));       
    }while(matrix[x1][x2]===1 && numberOfCircles.length>0);
    numberOfCircles--;
    listOfRandomNumbers.push(x1);
    listOfRandomNumbers.push(x2);
  }

  for(let k = 0; k<listOfRandomNumbers.length; k+=2){
    for(let i = 1; i <= Ycoord;i++){
      for(let j = 1;j <= Xcoord; j++){
        if(i-1 === listOfRandomNumbers[k] && j-1 === listOfRandomNumbers[k+1] && matrix[i-1][j-1] === 0){
          matrix[i-1][j-1] = 1;
          if(isGameOver()){
            matrix[i-1][j-1]=0;
            continue;
          }
          ctx.beginPath();
          ctx.fillStyle = "rgb(86, 81, 81)";
          ctx.strokeStyle = "rgb(86, 81, 81)";
          ctx.arc(j*distance + distanceToCenter,i*distance, radius, 0, 2*Math.PI);
          ctx.fill();
          ctx.stroke();
        }
      }
    }
  }
  if(PlayerOne){
    ctx.strokeStyle = "red";
    ctx.fillStyle = "red";
  }
  else {
    ctx.strokeStyle = "yellow";
    ctx.fillStyle = "yellow";
  }
}


function restartGame(){
  if(startingLineColor%2 === 0){
    PlayerOne = false;
  }
  else {
    PlayerOne = true;
  }
  startingLineColor++;
  document.getElementById("gameBoardId").style.pointerEvents = "auto";
  document.getElementById("gameBoardId").style.opacity= "1";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById("endPopUp").style.display = "none";
  init(Ycoord, Xcoord);
}


function isGameOver() {
  let Num = 0;
  for(let i = 1; i <= Ycoord;i++){
    for(let j = 1;j <= Xcoord; j++){
      if(matrix[i-1][j-1] !== 0){
        continue;
      }
      const x1 = j * distance + distanceToCenter;
      const y1 = i * distance;
      List[0] = [];
      List[0].push(x1);
      List[0].push(y1);
      List[0].push(i-1);
      List[0].push(j-1);
      for(let k = 1; k <= Ycoord;k++){
        for(let l = 1;l <= Xcoord; l++){
          if(matrix[k-1][l-1] !== 0 || (k === i && l === j)){
            continue;
          }
          const x2 = l * distance + distanceToCenter;
          const y2 = k * distance;
          List[1] = [];
          List[1].push(x2);
          List[1].push(y2);
          List[1].push(k-1);
          List[1].push(l-1);
          for(let m = 1; m <= Ycoord; m++){
            for(let n = 1; n <= Xcoord; n++){
              if(matrix[m-1][n-1] !== 0 || (m === i && n === j) || (m === k && n === l)){
                continue;
              }
              const x3 = n * distance + distanceToCenter;
              const y3 = m * distance;
              List[2] = [];
              List[2].push(x3);
              List[2].push(y3);
              List[2].push(m-1);
              List[2].push(n-1);

              if(!(checkForLineCrossing() || condition() || (List[0][2] === List[1][2] && List[1][2] === List[2][2]) || (List[0][3] === List[1][3] && List[1][3] === List[2][3]))){
                Num++;
              }
            }
          }
        }
      }
    }
  }
  if(Num===0){
    return true;
  }
  else{
    return false;
  }
}

function isPointInTriangle(x1, y1, x2, y2, x3, y3, px, py) {
  let area = Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);
  let area1= Math.abs((px * (y2 - y3) + x2 * (y3 - py) + x3 * (py - y2)) / 2);
  let area2= Math.abs((x1 * (py - y3) + px * (y3 - y1) + x3 * (y1 - py)) / 2);
  let area3= Math.abs((x1 * (y2 - py) + x2 * (py - y1) + px * (y1 - y2)) / 2);

  if(Math.abs(area - (area1 + area2 + area3)) < 0.00000001) {
    return true;
  }
  else {
    return false;
  }
}

function checkForLineCrossing(){
  for(let i = 0; i < ListOfEveryLine.length; i++){
    for(let j = 0; j< List.length; j++){
      let o1, o2, o3, o4;
      if(j === 2){
        o1 = orientationOfLine(ListOfEveryLine[i][0], ListOfEveryLine[i][1], ListOfEveryLine[i][2], ListOfEveryLine[i][3], List[j][0], List[j][1]);
        o2 = orientationOfLine(ListOfEveryLine[i][0], ListOfEveryLine[i][1], ListOfEveryLine[i][2], ListOfEveryLine[i][3], List[0][0], List[0][1]);
        o3 = orientationOfLine(List[j][0], List[j][1], List[0][0], List[0][1], ListOfEveryLine[i][0], ListOfEveryLine[i][1]);
        o4 = orientationOfLine(List[j][0], List[j][1], List[0][0], List[0][1], ListOfEveryLine[i][2], ListOfEveryLine[i][3]);
      }
      else {
        o1 = orientationOfLine(ListOfEveryLine[i][0], ListOfEveryLine[i][1], ListOfEveryLine[i][2], ListOfEveryLine[i][3], List[j][0], List[j][1]);
        o2 = orientationOfLine(ListOfEveryLine[i][0], ListOfEveryLine[i][1], ListOfEveryLine[i][2], ListOfEveryLine[i][3], List[j+1][0], List[j+1][1]);
        o3 = orientationOfLine(List[j][0], List[j][1], List[j+1][0], List[j+1][1], ListOfEveryLine[i][0], ListOfEveryLine[i][1]);
        o4 = orientationOfLine(List[j][0], List[j][1], List[j+1][0], List[j+1][1], ListOfEveryLine[i][2], ListOfEveryLine[i][3]);
      }
      if(o1 != o2 && o3 != o4){
        return true;
      }
    }
  }
  return false;
}

function orientationOfLine(x1, y1, x2, y2, x3, y3){
  let p = (y2-y1)*(x3-x2)-(x2-x1)*(y3-y2);
  if(p > 0){
    return 1;
  }
  else if(p < 0){
    return -1;
  }
  else {
    return 0;
  }
}
// ovo je za provjeru da li su na istoj liniji tacke
function condition(){
  let m1 = (List[1][1] - List[0][1])/(List[1][0] - List[0][0]);
  let m2 = (List[2][1] - List[1][1])/(List[2][0] - List[1][0]);
  if(Math.abs(m1-m2) < 0.00000000001) {
    return true;
  }
  return false;
}

function setDisabledCircles(){
  for(let k = 0;k<3;k++){
    for(let i = 1; i <= Ycoord;i++){
      for(let j = 1;j <= Xcoord; j++){
        if(matrix[i-1][j-1] === 0){
          const circleX = j * distance + distanceToCenter;
          const circleY = i * distance;
          let t;
          let d;
          if(k === 2){
            d = Math.abs((List[0][1]-List[k][1])*circleX - (List[0][0]-List[k][0])*circleY + List[0][0]*List[k][1] - List[0][1]*List[k][0])/Math.sqrt(Math.pow((List[0][1]-List[k][1]),2) + Math.pow((List[0][0]-List[k][0]),2))
            t = ((circleX-List[k][0])*(List[0][0]-List[k][0])+(circleY-List[k][1])*(List[0][1] - List[k][1]))/(Math.pow((List[0][0] - List[k][0]),2) + Math.pow((List[0][1] - List[k][1]),2));
          }
          else{
            d = Math.abs((List[k+1][1]-List[k][1])*circleX - (List[k+1][0]-List[k][0])*circleY + List[k+1][0]*List[k][1] - List[k+1][1]*List[k][0])/Math.sqrt(Math.pow((List[k+1][1]-List[k][1]),2) + Math.pow((List[k+1][0]-List[k][0]),2))
            t = ((circleX-List[k][0])*(List[k+1][0]-List[k][0])+(circleY-List[k][1])*(List[k+1][1] - List[k][1]))/(Math.pow((List[k+1][0] - List[k][0]),2) + Math.pow((List[k+1][1] - List[k][1]),2));
          }
          if(t <= 1 && t >= 0 && d < radius + 2/*+4*/){//mozda ostavim ovako
              if(PlayerOne){
                ctx.strokeStyle = "red";
                ctx.fillStyle = "red";
              }
              else {
                ctx.strokeStyle = "yellow";
                ctx.fillStyle = "yellow";
              }
              ctx.beginPath();
              ctx.arc(j*distance + distanceToCenter,i*distance, radius, 0, 2*Math.PI);
              ctx.fill();
              ctx.stroke();
              matrix[i-1][j-1] = 1;
          }  
        }
      }
    }
  }
}

function drawTriangle() {
  if(PlayerOne){
    ctx.strokeStyle = "red";
  }
  else {
    ctx.strokeStyle = "yellow";
  }
  ctx.beginPath();
  ctx.moveTo(List[0][0], List[0][1]);
  ctx.lineTo(List[1][0], List[1][1]);
  ctx.moveTo(List[1][0], List[1][1]);
  ctx.lineTo(List[2][0], List[2][1]);
  ctx.moveTo(List[2][0], List[2][1]);
  ctx.lineTo(List[0][0], List[0][1]);
  ctx.stroke();
}

function reset(){
  List[0] = [];
  List[1] = [];
  List[2] = [];
  index = 0;
}
function resetMatrix(){
  matrix[List[0][2]][List[0][3]] = 0;
  matrix[List[1][2]][List[1][3]] = 0;
  matrix[List[2][2]][List[2][3]] = 0;
}
function resetColors(){
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.arc(List[i][0], List[i][1], radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
}