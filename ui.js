window.addEventListener('load', game.startGame);

let boardEl = document.getElementById('board');
let modalEl = document.getElementById('modal');
let resetButtons = document.getElementsByClassName('reset');
let selectEl = document.getElementById('select');
let checkboxEl = document.getElementById('checkbox');
let turnEl = document.getElementById('turn');
let playerEl = document.getElementById('player');

for (let btn of resetButtons) {
  btn.addEventListener('click', function () {
    if (!modalEl.classList.contains('hidden')) {
      modalEl.classList.add('hidden');
    }
    game.size = game.boardSize;
  });
}

selectEl.addEventListener('change', function(event) {
  game.size = event.currentTarget.value;
});

checkboxEl.addEventListener('change', function(event) {
  game.activeEnemy = game.activeEnemy == false ? true: false;
});

boardEl.addEventListener('click', function (event) {
  let targetClasses = event.target.classList;
  let targetData = event.target.dataset;
  if (targetClasses.contains('field') && !targetClasses.contains('busy')) {
    game.click(parseInt(targetData.row), parseInt(targetData.col));
  }
});

function showResult(win) {
  let header = modalEl.getElementsByTagName('h2')[0];
  if (win) {
    header.textContent = `🍾 Победил игрок №${game.activePlayer}! 🍾\nВсего ${game.turnCounter + 1} ходов!`;
  } else {
      header.textContent = `🍾🍾🍾🍾Победила дружба!\nВсего ${game.turnCounter + 1} ходов!`;
  }

  modalEl.classList.remove('hidden');
}

function renderBoard() {
  const fields = [];
  for (let [i, row] of game.board.entries()) {
    for (let [j, value] of row.entries()) {
      fields.push(`
        <div class="field ${value ? 'busy' : 'free'} ${value == '1' ? 'cross' : ''} ${value == '2' ? 'null' : ''}" 
            data-row="${i}" 
            data-col="${j}"
            style="grid-row:${i + 1};grid-column:${j + 1};"
        >
        </div>
      `);
    }
  }
  boardEl.innerHTML = fields.join('');
}

function renderSelect() {
  const fields = [];
  for (let i = 3; i < game.selectRange + 1; i++) {
    if (i == game.boardSize) {
      fields.push(`<option selected value="${i}">${i} х ${i}</option>`);
    } else {
      fields.push(`<option value="${i}">${i} х ${i}</option>`);
    }
  }
  selectEl.innerHTML = fields.join('');
}

function renderAll() {
  renderSelect();
  renderBoard();
  turnEl.textContent = game.turnCounter + 1;
  playerEl.textContent = game.activePlayer;
}

