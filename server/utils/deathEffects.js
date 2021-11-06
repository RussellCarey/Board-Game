// Do damage
exports.damageEnemyAllAround = () => {};

exports.damageFriendlyAllAround = () => {};

exports.damageEnemiesVerticle = () => {};

exports.damageFriendlyVerticle = () => {};

exports.damageEnemiesHorizontal = (tile, size) => {
  console.log("Running death effect");

  // Go Left
  for (let i = tile.position[1] - 1; i >= 0; i--) {
    tile.position[0][i].health -= 1;
  }

  // Go Right
  for (let i = tile.position[1] + 1; i < size; i++) {
    tile.position[0][i].health -= 1;
  }
};

exports.damageFriendlyHorizontal = () => {};

exports.damageEnemiesCross = () => {};

exports.damageFriendlyCross = () => {};

exports.damageEnemiesX = () => {};

exports.damageFriendlyX = () => {};

// Plus life
exports.healEnemyAllAround = () => {};

exports.healFriendlyAllAround = () => {};

exports.healEnemiesVerticle = () => {};

exports.healFriendlyVerticle = () => {};

exports.healEnemiesHorizontal = () => {};

exports.healFriendlyHorizontal = () => {};

exports.healEnemiesCross = () => {};

exports.healFriendlyCross = () => {};

exports.healEnemiesX = () => {};

exports.healFriendlyX = () => {};
