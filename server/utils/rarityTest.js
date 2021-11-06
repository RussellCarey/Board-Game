const grey = 55;
const green = 75;
const blue = 93;
const purple = 97;
const gold = 100;

let percentages = {
  grey: 0,
  green: 0,
  blue: 0,
  purple: 0,
  gold: 0,
};

const getRarity = (p) => {
  if (p >= 0 && p < grey) {
    return "grey";
  }

  if (p >= grey && p < green) {
    return "green";
  }

  if (p >= green && p < blue) {
    return "blue";
  }

  if (p >= blue && p < purple) {
    return "purple";
  }

  if (p >= purple && p <= gold) {
    return "gold";
  }
};

const getPercentage = () => {
  const percent = Math.random() * 100;
  return percent;
};

const calculatePercentags = () => {
  for (let i = 0; i < 1000; i++) {
    const value = getPercentage();
    const rarity = getRarity(value);
    percentages[rarity] += 1;

    if (i % 5 == 0) {
      console.log(percentages);
      percentages = {
        grey: 0,
        green: 0,
        blue: 0,
        purple: 0,
        gold: 0,
      };
    }
  }
};

calculatePercentags();
