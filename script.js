let selectedPiece = null;

function createBoard() {
  let board = document.querySelector(".board");

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let square = document.createElement("div");
      square.className = "square";
      square.dataset.row = i;
      square.dataset.col = j;

      if ((i + j) % 2 === 0) {
        square.classList.add("white");
      } else {
        square.classList.add("red");
      }

      if (i < 3 && (i + j) % 2 !== 0) {
        let piece = createPiece(i, j, "black");
        square.appendChild(piece);
      }

      if (i > 4 && (i + j) % 2 !== 0) {
        let piece = createPiece(i, j, "white");
        square.appendChild(piece);
      }

      board.appendChild(square);
    }
  }
}

function createPiece(row, col, color) {
  let piece = document.createElement("div");
  piece.className = "piece " + color;
  piece.dataset.row = row;
  piece.dataset.col = col;

  piece.addEventListener("click", function (event) {
    if (selectedPiece && selectedPiece !== piece) {
      selectedPiece.classList.remove("selected");
    }
    piece.classList.add("selected");
    selectedPiece = piece;
  });

  return piece;
}

function movePiece(event) {
  let target = event.target;
  let board = document.querySelector(".board");

  if (!selectedPiece && target.classList.contains("piece")) {
    selectedPiece = target;
    selectedPiece.classList.add("selected");
  } else {
    let selectedSquare = selectedPiece.parentElement;

    let selectedRow = parseInt(selectedSquare.dataset.row);
    let selectedCol = parseInt(selectedSquare.dataset.col);
    let targetRow = parseInt(target.dataset.row);
    let targetCol = parseInt(target.dataset.col);

    let rowDiff = Math.abs(targetRow - selectedRow);
    let colDiff = Math.abs(targetCol - selectedCol);

    if (
      selectedPiece &&
      target.classList.contains("square") &&
      rowDiff === colDiff &&
      rowDiff >= 1 &&
      !target.querySelector(".piece")
    ) {
      let isKing = selectedPiece.classList.contains("king");

      let isDiagonal =
        (targetRow - selectedRow) / rowDiff ===
        (targetCol - selectedCol) / colDiff;

      if (
        isKing ||
        (selectedPiece.classList.contains("black") &&
          targetRow > selectedRow) ||
        (selectedPiece.classList.contains("white") && targetRow < selectedRow)
      ) {
        if (rowDiff === 1 && colDiff === 1) {
          target.appendChild(selectedPiece);
          selectedPiece.classList.remove("selected");
          selectedPiece = null;
        } else if (rowDiff === 2 && colDiff === 2) {
          let jumpedSquare = getJumpedSquare(
            selectedRow,
            selectedCol,
            targetRow,
            targetCol
          );
          let jumpedPiece = jumpedSquare.querySelector(".piece");

          if (
            jumpedPiece &&
            jumpedPiece.classList.contains(getOppositeColor(selectedPiece))
          ) {
            jumpedSquare.removeChild(jumpedPiece);
            target.appendChild(selectedPiece);
            selectedPiece.classList.remove("selected");
            selectedPiece = null;
          }
        }
      }
    }
  }

  if (selectedPiece) {
    let selectedSquare = selectedPiece.parentElement;
    let selectedRow = parseInt(selectedSquare.dataset.row);
    let color = selectedPiece.classList.contains("black") ? "black" : "white";
    if (
      (color === "black" && selectedRow === 7) ||
      (color === "white" && selectedRow === 0)
    ) {
      selectedPiece.classList.add("king");
    }
  }
}

function getJumpedSquare(startRow, startCol, endRow, endCol) {
  let jumpedRow = (startRow + endRow) / 2;
  let jumpedCol = (startCol + endCol) / 2;

  return document.querySelector(
    '.square[data-row="' + jumpedRow + '"][data-col="' + jumpedCol + '"]'
  );
}

function getOppositeColor(piece) {
  return piece.classList.contains("black") ? "white" : "black";
}

createBoard();
