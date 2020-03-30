class Game {
  constructor(selectRange, boardSize, activeEnemy) {
    this.selectRange = selectRange;
    this.boardSize = boardSize;
    this.board = this.createBoard();
    this.userCombo = this.createUserCombo();
    this.turnCounter = 0;
    this.players = ['1', '2'];
    this.activePlayer = '1';
    this.activeEnemy = activeEnemy;
  }

  set size (size) {
    this.boardSize = size;
    this.board = this.createBoard();
    this.userCombo = this.createUserCombo();
    this.turnCounter = 0;
    this.players = ['1', '2'];
    this.activePlayer = '1';
    this.startGame();
  }

  nextTurn() {
    this.turnCounter ++;
    this.activePlayer = this.players.pop();
    this.players.unshift(this.activePlayer);
  }

  startGame() {
    renderAll();
  }

  click (row, col) {
    this.mapBoard(row, col)
    if (this.winAnalizer()) {
      return;
    }
    this.nextTurn();
    renderAll();
    if (this.activePlayer == '2' && this.activeEnemy) {
      this.enemy();
    }
  }

  mapBoard(row, col) {
    this.board[row][col] = this.activePlayer;

    if (this.userCombo[`r${row}`][0] == this.activePlayer || !this.userCombo[`r${row}`].length) {
      this.userCombo[`r${row}`].push(this.activePlayer);
    }
 
    if (this.userCombo[`c${col}`][0] == this.activePlayer || !this.userCombo[`c${col}`].length) {
      this.userCombo[`c${col}`].push(this.activePlayer);
    }

    if (row == col) {
      if (this.userCombo['ld'][0] == this.activePlayer || !this.userCombo[`ld`].length) {
        this.userCombo['ld'].push(this.activePlayer);
      }
    }

    if (row + col == this.boardSize - 1) {
      if (this.userCombo['rd'][0] == this.activePlayer || !this.userCombo[`rd`].length) {
        this.userCombo['rd'].push(this.activePlayer);
      }
    }
  }

  createBoard() {
    let board = [], row = [];
    for (let i = 0; i < this.boardSize; i ++, row =[]) {
      for (let j = 0; j < this.boardSize; j ++) {
        row.push('');
      }
      board.push(row);
    }
    return board;
  }

  createUserCombo() {
  let userCombo = {}
    for (let i = 0; i < this.boardSize; i ++) {
      for (let j of ['c', 'r'])
        userCombo[`${j}${i}`] = [];
      }
      userCombo[`rd`] = [];
      userCombo[`ld`] = [];
  return userCombo;
  }

  winAnalizer() {
    for (let combo in this.userCombo) {
      if (this.userCombo[combo].length == this.boardSize) {
        showResult(1);
        return true;
      }
    }
    if (this.turnCounter == this.boardSize ** 2 - 1) {
      showResult(0);
      return true;
    }
  }

  maxLength() {
    let maxLength = 0;
    for (let combo in this.userCombo) {
      if (this.userCombo[combo].length > maxLength) {
        maxLength = this.userCombo[combo].length;
      }
    }
    return maxLength;
  }

  findCombo() {
    let maxLength = this.maxLength();
    let allCombo = [];
    for (let i = maxLength; i >= 0; i --) {
      for (let combo in this.userCombo) {
        if (this.userCombo[combo].length == i) {
         allCombo.push(combo)
        }
      }
    }
    return allCombo
  }

  parseCombo(combo) {
    if (combo == 'ld') {
      for (let i = 0; i < this.boardSize; i ++) {
        if (!this.board[i][i]) {
          this.click(i, i);
          return true;
          }
        }
      return false;
      }

    if (combo == 'rd') {
      for (let i = 0; i < this.boardSize; i ++) {
        if (!this.board[i][this.boardSize - i - 1]) {
          this.click(i, this.boardSize - i - 1);
          return true;
          }
        }
        return false;
      }

    let row = combo[0] == 'r' ? combo[1]: 0;
    let col = combo[0] == 'c' ? combo[1]: 0;

    if (row) {
      for (col; col < this.boardSize; col ++){
        if (!this.board[row][col]) {
          this.click(row, col)
          return true;
        }
      }
      return false;
    }

    if (col) {
      for (row; row < this.boardSize; row ++){
        if (!this.board[row][col]) {
          this.click(row, col);
          return true;
        }
      }
    }
    return false;
  }

  enemy() {
    let allCombo = this.findCombo();
    for (let combo of allCombo) {
      if (this.parseCombo(combo)) {
        return;
      }
    }
  }
}

game = new Game(10, 3, false);