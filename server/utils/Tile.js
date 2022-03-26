const DeathEffects = require("./deathEffects");

class Tile {
  constructor(position, player, name, attack, health, rarity, img) {
    this.position = position;
    this.player = player || null;
    this.name = name || null;
    this.attack = attack || null;
    this.health = health || null;
    this.rarity = rarity || null;
    this.img = img || null;
    this.effectRange = 5;
    this.possibleMoves = this.generateMoveablePositions(position);
  }

  // This will produce - numbers but we have checks on the movement to not take those into account.
  createStartMovement = (y, x) => {
    const possibleMoves = [
      [y - 1, x - 1],
      [y - 1, x],
      [y - 1, x + 1],
      [y + 1, x - 1],
      [y + 1, x],
      [y + 1, x + 1],
      [y, x - 1],
      [y, x + 1],
    ];

    return possibleMoves;
  };

  createCrossMovement = (y, x) => {
    const possibleMoves = [
      [y + 1, x],
      [y - 1, x],
      [y, x - 1],
      [y, x + 1],
    ];

    return possibleMoves;
  };

  // There is a pattern where using the x and y numbers, odd to odd and even to even, can move in a star pattern and odd even or even odd move in a cross pattern.
  generateMoveablePositions = (position) => {
    // Even is true and odd is false..
    const yCan = position[0] % 2 === 0 ? true : false;
    const xCan = position[1] % 2 === 0 ? true : false;

    const y = position[0];
    const x = position[1];

    // Base on true or false values populate the
    if ((yCan && xCan) || (!yCan && !xCan)) {
      return [
        [y - 1, x - 1],
        [y - 1, x],
        [y - 1, x + 1],
        [y + 1, x - 1],
        [y + 1, x],
        [y + 1, x + 1],
        [y, x - 1],
        [y, x + 1],
      ];
    }

    if ((yCan && !xCan) || (!yCan && xCan)) {
      return [
        [y + 1, x],
        [y - 1, x],
        [y, x - 1],
        [y, x + 1],
      ];
    }
  };

  onDeathEffect = (boardsize) => {
    DeathEffects.damageEnemiesHorizontal(this, boardsize);
  };

  resetTile = () => {
    this.player = null;
    this.name = null;
    this.attack = null;
    this.health = null;
    this.rarity = null;
    this.img = null;
  };
}

module.exports = Tile;
