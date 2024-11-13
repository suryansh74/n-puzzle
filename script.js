let tilePositions = [];
let tileWinCondition = [];
let NoT;
let xZero = 0;
let yZero = 0;
let uTposx = 0;
let uTposy = 0;
let gameGenerated = false;

function generate() {
  var n = document.getElementById("n").value;
  var container = document.getElementById("blocksContainer");
  container.innerHTML = "";
  if (n == "") {
    document.getElementById("e1").innerHTML = "Input Field cannot be 'Empty'";
  } else if (n < 0) {
    document.getElementById("e1").innerHTML =
      "Input Field cannot be 'Negative'";
  } else if (n == 0) {
    document.getElementById("e1").innerHTML =
      "Input Field cannot be 'Non-Zero'";
  } else {
    NoT = parseInt(n);  // Ensure NoT is a number
    if (isNaN(NoT) || NoT <= 0) {
      document.getElementById("e1").innerHTML = "Invalid grid size";
      return;
    }
    
    winGenerate();  // This sets up the win condition array
    console.log("NoT:", NoT);  // Log NoT value

    console.log(tilePositions);
    console.log("=======");
    console.log(tileWinCondition);
    arraysEqual(tilePositions, tileWinCondition);
    if (arraysEqual(tilePositions, tileWinCondition)) {
      document.getElementById("gameMsg").innerHTML = "<h2>You Won</h2>";
    } else if (gameGenerated) {
      document.getElementById("e1").innerHTML = "";
      for (let i = 0; i < NoT; i++) {
        for (let j = 0; j < NoT; j++) {
          var block = document.createElement("div");
          block.classList.add("block");
          if (tilePositions[i * NoT + j] == 0) {
            block.classList.add("blockZero");
            xZero = i;
            yZero = j;
          }
          block.textContent = tilePositions[i * NoT + j];
          container.append(block);
        }
        var br = document.createElement("br");
        container.append(br);
      }
    } else {
      // Now `NoT` should be correctly set
      const shuffledArray = generateShuffledArray2();
      document.getElementById("e1").innerHTML = "";
      for (let i = 0; i < NoT; i++) {
        for (let j = 0; j < NoT; j++) {
          var block = document.createElement("div");
          block.classList.add("block");
          if (shuffledArray[i * NoT + j] == 0) {
            block.classList.add("blockZero");
            xZero = i;
            yZero = j;
          }
          block.textContent = shuffledArray[i * NoT + j];
          container.append(block);
        }
        var br = document.createElement("br");
        container.append(br);
      }
      tilePositions = [...shuffledArray];
      gameGenerated = true;
    }
  }
}

// function generateShuffledArray(n) {
//   let arr = [];
//   for (let i = 0; i < n; i++) {
//     arr.push(i);
//   }

//   // Shuffle the array using Fisher-Yates algorithm
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }

//   return arr;
// }
function generateShuffledArray2() {
  let arr = [...tileWinCondition];
  for (let k = 0; k < 100; k++) {
    let i = findZero(arr);
    let match = Math.floor(Math.random() * 4) + 1;
    console.log(`Match: ${match}, i: ${i}`); // Debugging log
    if (match == 1 && ((i - 1) % NoT !== 0) && (i - 1) >= 0) {
      console.log(`Swapping with left: ${i} <--> ${i - 1}`);
      [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
    }
    if (match == 2 && (i - NoT) >= 0) {
      console.log(`Swapping with top: ${i} <--> ${i - NoT}`);
      [arr[i], arr[i - NoT]] = [arr[i - NoT], arr[i]];
    }
    if (match == 3 && (i + NoT < NoT * NoT) && (i + NoT < arr.length)) {
      console.log(`Swapping with bottom: ${i} <--> ${i + NoT}`);
      [arr[i], arr[i + NoT]] = [arr[i + NoT], arr[i]];
    }
    if (match == 4 && ((i + 1) % NoT !== 0) && (i + 1) < NoT * NoT) {
      console.log(`Swapping with right: ${i} <--> ${i + 1}`);
      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    }
  }
  return arr;
}
function findZero(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == 0) {
      return i;
    }
  }
}

function move() {
  var selectedTile = document.getElementById("gameMove").value;
  if (isValidMove(selectedTile)) {
    document.getElementById("gameMsg").innerHTML = "";
    // Swap positions only if the move is valid
    [tilePositions[xZero * NoT + yZero], tilePositions[uTposx * NoT + uTposy]] =
      [
        tilePositions[uTposx * NoT + uTposy],
        tilePositions[xZero * NoT + yZero],
      ];
    generate();
  } else {
    document.getElementById("gameMsg").innerHTML = "Invalid Move";
  }
}

function isValidMove(selectedTile) {
  findPosUT(selectedTile);
  //   console.log(`Checking move for tile: ${selectedTile}, Current Position: (${xZero}, ${yZero}), Target Position: (${uTposx}, ${uTposy})`);

  // Check the validity of the move based on the current and target positions
  if (xZero + 1 == uTposx && yZero == uTposy && uTposx < NoT) {
    return true;
  } else if (xZero - 1 == uTposx && yZero == uTposy && uTposx >= 0) {
    return true;
  } else if (xZero == uTposx && yZero == uTposy + 1 && uTposy < NoT) {
    return true;
  } else if (xZero == uTposx && yZero == uTposy - 1 && uTposy >= 0) {
    return true;
  } else {
    return false;
  }
}

function findPosUT(t) {
  for (let i = 0; i < NoT * NoT; i++) {
    if (tilePositions[i] == t) {
      let x = Math.floor(i / NoT);
      let y = i % NoT; // Correct modulus operation for y-coordinate
      uTposx = x;
      uTposy = y;
      //   console.log(`Found tile ${t} at position: (${uTposx}, ${uTposy})`);
      return; // Exit the function once the position is found
    }
  }
  console.log(`Tile ${t} not found in the positions.`);
}
function winGenerate() {
  for (let i = 0; i < NoT * NoT - 1; i++) {
    tileWinCondition[i] = i + 1;
  }
  tileWinCondition[NoT * NoT - 1] = 0;
  console.log(tileWinCondition);
}

function arraysEqual(arr1, arr2) {
  // Check if arrays have the same length
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Check if every element is the same
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  // Arrays are equal
  return true;
}
function reset() {
  gameGenerated = false;
}
