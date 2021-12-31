// Return a random integer between min (inclusive) and max (exclusive)
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

// Return a random float between two min (inclusive) and max (exclusive)
export const getRandomFloat = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const getRandomBool = () => {
  return Math.random() > 0.5;
}

// Return {dx, dy}, where abs(dx) + abs(dy) == totalSpeed
export const getRandomVector = (totalSpeed) => {
  const part1 = getRandomFloat(0, totalSpeed);
  const part2 = totalSpeed - part1;
  const dx = getRandomBool() ? -part1 : part1; 
  const dy = getRandomBool() ? -part2 : part2;
  return {dx, dy};
};