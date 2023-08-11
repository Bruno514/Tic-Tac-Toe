const gameBoard = (() => {
  let _boardArray = [null, null, null, null, null, null, null, null, null];

  const check = () => {
    let responses = { none_resp: null, win_resp: "win", draw_resp: "draw" };

    const possibleMatches = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < possibleMatches.length; i++) {
      let valuesOfMatch = [];
      let match = possibleMatches[i];

      match.forEach((cell) => {
        valuesOfMatch.push(_boardArray[cell]);
      });

      if (valuesOfMatch.every((v) => v === valuesOfMatch[0] && v != null)) {
        return responses.win_resp;
      } else if (!_boardArray.flat().includes(null)) {
        return responses.draw_resp;
      }
    }

    return responses.none_resp;
  };

  const resetBoard = () => {
    _boardArray = [null, null, null, null, null, null, null, null, null];
  };

  const showBoard = () => {
    console.log(_boardArray);
  };

  const getCell = (cell) => _boardArray[cell];

  const placeMark = (cell, mark) => {
    if (!_validMove(cell)) {
      throw Error("Invalid move.");
    }

    _boardArray[cell] = mark;

    return true;
  };

  const _validMove = (cell) => {
    if (_boardArray[cell] === null && (cell >= 0 || cell <= 8)) {
      return true;
    }

    return false;
  };

  return { check, resetBoard, placeMark, showBoard, getCell };
})();

const Player = (playerName, playerMark) => {
  const name = playerName,
    mark = playerMark;

  const getName = () => name;
  const getMark = () => mark;

  return { getName, getMark };
};

const gameState = (() => {
  let gameActive = false;

  const isGameActive = () => gameActive;
  const startGame = () => {
    gameActive = true;
  };
  const endGame = () => {
    gameActive = false;
  };

  return { isGameActive, startGame, endGame };
})();

const gameFlow = (() => {
  const players = { p1: null, p2: null };
  let activePlayer = 1;

  const setPlayers = (name1, name2) => {
    players.p1 = Player(name1, "X");
    players.p2 = Player(name2, "O");
  };

  const getPlayer = (player) => players[`p${player}`];

  const getActivePlayer = () => players[`p${activePlayer}`];

  const reset = () => {
    gameBoard.resetBoard();
    activePlayer = 1;
  };

  const playTurn = (cell) => {
    if (gameState.isGameActive()) {
      try {
        gameBoard.placeMark(cell, getPlayer(activePlayer).getMark());
      } catch (e) {
        throw e;
      }

      res = gameBoard.check();

      if (!!res) {
        gameState.endGame();
      }

      return res;
    }
  };

  const nextTurn = () => {
    _switchActivePlayer();
  };

  const _switchActivePlayer = () =>
    activePlayer === 1 ? (activePlayer = 2) : (activePlayer = 1);

  return { setPlayers, getPlayer, getActivePlayer, playTurn, nextTurn, reset };
})();

gameFlow.setPlayers("Bruno1", "Bruno2");

const displayController = (() => {
  let _CachedDom = undefined;

  const init = () => {
    _CachedDom = _cacheDom();
    _bindEvents();
    _toggleBoard();
  };

  const _bindEvents = () => {
    _CachedDom.button.addEventListener("click", _startGame);
    _CachedDom.board.querySelectorAll(".cell").forEach((element) => {
      element.addEventListener("click", _playTurn);
    });
  };

  const _cacheDom = () => {
    const button = document.querySelector("button");
    const board = document.querySelector(".board");
    const versus = document.querySelector(".versus");

    return { button, board, versus };
  };

  const _playTurn = (e) => {
    const cell = e.target;
    const cellNumber = cell.dataset.cellNumber;

    let res = gameFlow.playTurn(cellNumber);
    if(!!res) {
      document.querySelector(".message").textContent = res;
    }

    gameFlow.nextTurn();
    _renderBoard();
  };

  const _toggleBoard = () => {
    if (_CachedDom.board.style.display === "none") {
      _CachedDom.board.style.display = "grid";
    } else {
      _CachedDom.board.style.display = "none";
    }
  };

  // Events
  const _startGame = () => {
    _CachedDom.button.style.display = "none";
    _CachedDom.versus.style.display = "none";
    _toggleBoard();
    gameState.startGame();
  };

  const _renderBoard = (e) => {
    document.querySelectorAll(".cell").forEach((element) => {
      const cellNumber = element.dataset.cellNumber;

      if (gameBoard.getCell(cellNumber) == "X") {
        element.className = "cell cross";
      } else if (gameBoard.getCell(cellNumber) == "O") {
        element.className = "cell circle";
      } else {
        element.className = "cell";
      }
    });
  };

  return { init };
})();

displayController.init();
