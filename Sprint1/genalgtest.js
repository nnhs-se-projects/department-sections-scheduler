fitness = require("./schedulegenalg.js");
population = [];
population.push(require("./GeneratedSchedules/Schedule1.json"));

console.log(population);
console.log(population[0]);
console.log(fitness(population[0]));

function main() {
  testFitness();
}
