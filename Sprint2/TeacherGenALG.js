//0 is really bad, 1 is really good
// const fitness = (paramArray) => {
//   let fitness = 0;
//   let numberOfSections = paramArray.length;
//   for (let section of paramArray) {
//     //use teacher preferences to judge fitness

//     let course = section.teacher.certifiedCourses.find(
//       (element) => (element.course = section.course.name)
//     );

//     fitness += course.preference || 0;
//     console.log(course.preference || 0);
//     console.log(fitness);
//   }
//   return fitness / numberOfSections;
// };

//fake fitness function
const fitness = (paramArray) => {
  //evaluate how sorted an array is
  let fitness = 0;
  for (let i = 0; i < paramArray.length - 1; i++) {
    if (paramArray[i] < paramArray[i + 1]) {
      fitness++;
    }
  }
};
//create crossover function
const crossover = (parent1, parent2) => {
  let child = [];
  let midpoint = Math.floor(Math.random() * parent1.length);
  for (let i = 0; i < parent1.length; i++) {
    if (i < midpoint) {
      child.push(parent1[i]);
    } else {
      child.push(parent2[i]);
    }
  }
  return child;
};

//create mutation function
const mutation = (paramArray) => {
  let tempArray = paramArray.slice();
  let index1 = Math.floor(Math.random() * paramArray.length);
  let index2 = Math.floor(Math.random() * paramArray.length);
  tempArray[index1] = paramArray[index2];
  tempArray[index2] = paramArray[index1];
  return tempArray;
};

//create selection function
const selection = (pop) => {
  //sort the array by fitness
  //return the top 50% of the array
  pop.sort((a, b) => {
    return fitness(b) - fitness(a);
  });
  pop.unshift();
};

//cleanup algorithm
const cleanup = (paramArray) => {
  //remove duplicates throw duplacates to end of array
  let duplicates = [];
  let tempArray = paramArray.slice();
  for (let i = 0; i < tempArray.length; i++) {
    if (
      tempArray.indexOf(tempArray[i]) !== tempArray.lastIndexOf(tempArray[i])
    ) {
      duplicates.push(tempArray[i]);
      tempArray.splice(i, 1);
    }
  }
  return tempArray.concat(duplicates);
};
//genetic algorithm

const geneticAlgorithm = (initalPopulation, numGenerations) => {
  pop = initalPopulation.slice();
  let generation = 0;
  while (generation < numGenerations) {
    let newPop = [];
    for (let i = 0; i < pop.length; i++) {
      let parent1 = pop[Math.floor(Math.random() * pop.length)];
      let parent2 = pop[Math.floor(Math.random() * pop.length)];
      let child = crossover(parent1, parent2);
      cleanup(child);
      if (Math.random() < 0.7) {
        child = mutation(child);
      }
      newPop.push(child);
    }
    pop = newPop;
    selection(pop);
    console.log(pop);
    generation++;
  }
  return pop[0];
};

//create initial population
let initialPopulation = [];
for (let i = 0; i < 3; i++) {
  initialPopulation.push([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
}
//run genetic algorithm
console.log(geneticAlgorithm(initialPopulation, 3));
