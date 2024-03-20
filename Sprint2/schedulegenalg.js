//inital population
// const initalPopulation = [
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   [9, 8, 7, 6, 5, 4, 3, 2, 1],
//   [5, 6, 7, 8, 9, 4, 3, 2, 1],

//
//create ~50 randokm schedules
let initialPopulation = [];
for (let i = 0; i < 50; i++) {
  initialPopulation.push(shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
}

//actual genetic algorithm
//scoring
const fitness = (schedule) => {
  let score = 0;

  return score;
};
