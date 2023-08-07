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

  return { check, resetBoard, placeMark, showBoard };
})();

const Player = (playerName, playerMark) => {
  const name = playerName,
    mark = playerMark;

  const getName = () => name;
  const getMark = () => mark;

  return { getName, getMark };
};

const gameFlow = (() => {
  const players = { p1: null, p2: null };
  let activePlayer = 1;

  const setPlayers = (name1, name2) => {
    players.p1 = Player(name1, "X");
    players.p2 = Player(name2, "O");
  };

  const getPlayer = (player) => players[`p${player}`];

  const reset = () => {
    gameBoard.resetBoard();
    activePlayer = 1;
  };

  const playTurn = (cell) => {
    try {
      gameBoard.placeMark(cell, getPlayer(activePlayer).getMark());
    } catch (e) {
      console.log("Error: ", e.message);
      return undefined;
    }

    res = gameBoard.check();

    if (res === null) {
      _switchActivePlayer();
    }

    return res;
  };

  const _switchActivePlayer = () =>
    activePlayer === 1 ? (activePlayer = 2) : (activePlayer = 1);

  return { setPlayers, playTurn, getPlayer, reset };
})();
