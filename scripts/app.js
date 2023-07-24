document.addEventListener('DOMContentLoaded',() => {
  const grid = document.querySelector('.grid');
  const scoreDisplay = document.getElementById('score');
  const width = 8;
  const squares = [];
  let score = 0;
  const audio1 = new Audio('audio/s1.mp3');
  const audio2 = new Audio('audio/s2.mp3');
  const audio3 = new Audio('audio/s3.mp3');
  const audio4 = new Audio('audio/s4.mp3');

  const candyColors = [
    'url(images/red-candy.png)',
    'url(images/blue-candy.png)',
    'url(images/green-candy.png)',
    'url(images/orange-candy.png)',
    'url(images/yellow-candy.png)',
    'url(images/purple-candy.png)'
  ];

//Create Board
  function createBoard(){
    for(let i = 0; i < width*width; i++){
      const square = document.createElement('div'); //built-in method .createElement() creates a new element in the HTML via the JS using and type of the element created here is div, and this div is being stored inside a variable named square in the js file

      square.setAttribute('draggable', true);
      square.setAttribute('id', i);
  
      let randomColor = Math.floor(Math.random() * candyColors.length); //setting randomColor range [0,5]
      //console.log(randomColor);
      square.style.backgroundImage = candyColors[randomColor];

      //next put the div element named square created into/inside the (div with class="grid")
      grid.appendChild(square);

      //pushing square in squares array
      squares.push(square);
    }
  }
  createBoard();

//Drag the candies
  let colorBeingDragged;
  let colorBeingReplaced;
  let squareIdBeingDragged; 
  let squareIdBeingReplaced;

  squares.forEach(SQUARE => {
    SQUARE.addEventListener('dragstart', dragStart);
    SQUARE.addEventListener('dragover', dragOver);
    SQUARE.addEventListener('dragenter', dragEnter);
    SQUARE.addEventListener('dragleave', dragLeave);
    SQUARE.addEventListener('drop', dragDrop);
    SQUARE.addEventListener('dragend', dragEnd);
  })

  function dragStart(){
    colorBeingDragged = this.style.backgroundImage;
    squareIdBeingDragged = parseInt(this.id); 
    //console.log(colorBeingDragged);
    console.log(this.id,'dragstart');
  } 

  function dragOver(e){
    e.preventDefault();
    console.log(this.id,'dragover');
  } 

  function dragEnter(e){
    e.preventDefault();
    console.log(this.id,'dragenter');
  } 

  function dragLeave(){
    console.log(this.id,'dragleave');
  } 

  function dragDrop(){
    colorBeingReplaced = this.style.backgroundImage;
    squareIdBeingReplaced = parseInt(this.id);
    console.log(this.id,'dragdrop');

    squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;  
    this.style.backgroundImage = colorBeingDragged;
  } 

  function dragEnd(){
    console.log(this.id,'dragend');
//What is a valid move?
    let validMoves = [
      squareIdBeingDragged - 1, 
      squareIdBeingDragged - width,
      squareIdBeingDragged + 1,
      squareIdBeingDragged + width
    ];

    let validMove = validMoves.includes(squareIdBeingReplaced);

    if(squareIdBeingReplaced && validMove){
      squareIdBeingReplaced = null;
    }
    else if(squareIdBeingReplaced && !validMove){
      squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
    }
    else squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
  } 

//Drop candies once some have been cleared
  function moveDown(){
    for(i = 0; i < 56; i++){
      if(squares[i + width].style.backgroundImage === ''){
        squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
        squares[i].style.backgroundImage = '';
        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        const isFirstRow = firstRow.includes(i);
        if(isFirstRow && squares[i].style.backgroundImage === ''){
        //if(firstRow.includes(i) && squares[i].style.backgroundImage === ''){ //direct attack also possible lol
          let randomColor = Math.floor(Math.random() * candyColors.length);
          squares[i].style.backgroundImage = candyColors[randomColor];
        }
      }
    }
  }

//Checking for matches
  //check for row of three
  function checkRowForThree(){
    for(i = 0; i < 62; i++){
      let rowOfThree = [i, i+1, i+2];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
      if(notValid.includes(i)){
        continue;
      }

      if(rowOfThree.every(INDEX => squares[INDEX].style.backgroundImage === decidedColor && !isBlank)){ //check using every if all 3 have same color
        //if all 3 have same color make all 3 empty
        rowOfThree.forEach(index2 => {
          squares[index2].style.backgroundImage = '';    
        })
        score += 3;    
        scoreDisplay.innerHTML = score;
        audio1.play();
      }
    }
  }
  checkRowForThree();

  //check for column of three
  function checkColumnForThree(){
    for(i = 0; i < 48; i++){
      let columnOfThree = [i, i+width, i+width*2];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      if(columnOfThree.every(INDEX => squares[INDEX].style.backgroundImage === decidedColor && !isBlank)){ //check using every if all 3 have same color
        //if all 3 have same color make all 3 empty
        columnOfThree.forEach(index2 => {
          squares[index2].style.backgroundImage = '';    
        })
        score += 3;    
        scoreDisplay.innerHTML = score;
        audio2.play();
      }
    }
  }
  checkColumnForThree();

  //check for row of four
  function checkRowForFour(){
    for(i = 0; i < 61; i++){
      let rowOfFour = [i, i+1, i+2, i+3];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
      if(notValid.includes(i)){
        continue;
      }

      if(rowOfFour.every(INDEX => squares[INDEX].style.backgroundImage === decidedColor && !isBlank)){ //check using every if all 4 have same color
        //if all 4 have same color make all 4 empty
        rowOfFour.forEach(index2 => {
          squares[index2].style.backgroundImage = '';    
        })
        score += 4;    
        scoreDisplay.innerHTML = score;
        audio3.play();
      }
    }
  }
  checkRowForFour();

  //check for column of four
  function checkColumnForFour(){
    for(i = 0; i < 40; i++){
      let columnOfFour = [i, i+width, i+width*2, i+width*3];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      if(columnOfFour.every(INDEX => squares[INDEX].style.backgroundImage === decidedColor && !isBlank)){ //check using every if all 4 have same color
        //if all 4 have same color make all 4 empty
        columnOfFour.forEach(index2 => {
          squares[index2].style.backgroundImage = '';    
        })
        score += 4;   
        scoreDisplay.innerHTML = score; 
        audio4.play();
      }
    }
  }
  checkColumnForFour();

  //checkRowForFive(); and checkColumnForFive(); can also be added

  window.setInterval(function(){
    moveDown();
    checkRowForFour();
    checkColumnForFour();
    checkRowForThree();
    checkColumnForThree();
  }, 100);

  })