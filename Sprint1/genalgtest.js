import { fitness } from "./schedulegenalg.js";

population = [];

function testFitness() {
  for (schedule in population) {
    console.log(schedule);
    console.log(fitness(schedule));
  }
}

function main() {
  testFitness();
}
