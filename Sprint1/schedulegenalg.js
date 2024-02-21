//inital population
// const initalPopulation = [
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   [9, 8, 7, 6, 5, 4, 3, 2, 1],
//   [5, 6, 7, 8, 9, 4, 3, 2, 1],

const config = require("./Config.json");
//
//create ~50 randokm schedules
//actual genetic algorithm
//scoring
const testschedule = require("../schedule.json");

const setOfsectionsWOclassrooms = (schedule) => {
  let sectionsset = new Set();
  for (let i = 0; i < schedule.length; i++) {
    let period = schedule[i];
    for (let j = 0; j < period.length; j++) {
      let section = period[j];
      if (section != null) {
        sectionsset.add({
          course: section.course,
          sectionnumber: section.sectionnumber,
          teacher: section.teacher,
        });
      }
    }
  }
};

const fitness = (schedule) => {
  //average teacher preference of class
  let teacherPreference = 0;
  let averageConcurenceDiff = 0;
  //#num of teachers that have a lunch period
  let sectioncount = 0;
  for (let i = 0; i < schedule.length; i++) {
    let period = schedule[i];
    for (let j = 0; j < period.length; j++) {
      let section = period[j];
      if (section != null) {
        console.log(section);
        for (let i = 0; i < section.teacher.certifiedCourses.length; i++) {
          if (
            section.teacher.certifiedCourses[i].course === section.course.name
          ) {
            teacherPreference +=
              section.teacher.certifiedCourses[i].teacherPreference;
          }
        }
        sectioncount++;
      }
    }
  }
  let teacherSpecific = getTeacherSpecific(schedule);
  //fidn ammount of teachers that have a lunch period
  let lunchCount = 0;
  for (let teacher of teacherSpecific) {
    if (
      teacher.avaliablePeriods.length.includes(4) ||
      teacher.avaliablePeriods.length.includes(5) ||
      teacher.avaliablePeriods.length.includes(6)
    ) {
      lunchCount++;
    }
    //find longest concurence of periods
    let longestConcurence = 0;
    let currentConcurence = 0;
    let scheduledperiods = [];
    for (let i = 1; i <= config.numPeriods; i++) {
      if (teacher.avaliablePeriods.includes(i)) {
        scheduledperiods.push(i);
      }
    }
    for (let i = 0; i < scheduleperiods.length; i++) {
      if (scheduledperiods.includes(i)) {
        currentConcurence++;
      } else {
        if (currentConcurence > longestConcurence) {
          longestConcurence = currentConcurence;
        }
        currentConcurence = 0;
      }
    }
    if (currentConcurence > longestConcurence) {
      longestConcurence = currentConcurence;
    }
    //ideal longest concurence is 0 any more or any less is bad
    averageConcurenceDiff += Math.abs(longestConcurence - 3);
  }
  //make a value for how often a teacher stays at the same classeoom
  let classroomStay = 0;
  for (let teacher of teacherSpecific) {
    let classrooms = new Map();
    for (let i = 0; i < schedule.length; i++) {
      let period = schedule[i];
      for (let j = 0; j < period.length; j++) {
        let section = period[j];
        if (section != null) {
          if (section.teacher.name === teacher.name) {
            if (classrooms.has(section.periodClass.classroom)) {
              classrooms.set(
                section.periodClass.classroom,
                classrooms.get(section.periodClass.classroom) + 1
              );
            } else {
              classrooms.set(section.periodClass.classroom, 1);
            }
          }
        }
      }
    }
    for (let [key, value] of classrooms) {
      if (value > 1) {
        classroomStay += value * value;
      }
    }
  }

  lunchCount = lunchCount / teacherSpecific.length;
  let fit =
    config.weights.teacherPreference * (teacherPreference / sectioncount) +
    config.weights.lunchCount * lunchCount +
    config.weights.longestConcurence * averageConcurenceDiff;
  config.weights.classroomStay * sigmoid(classroomStay);

  return fit;
};

const getTeacherSpecific = (schedule) => {
  let teacherSpecific = require("./Teachers.json");
  for (let i = 0; i < schedule.length; i++) {
    let period = schedule[i];
    for (let j = 0; j < period.length; j++) {
      let section = period[j];
      if (section != null) {
        teacherSpecific.find((teacher) => {
          if (teacher.name === section.teacher.name) {
            teacher.avaliablePeriods.pop(section.periodClass.period);
          }
        });
      }
    }
  }
  return teacherSpecific;
};

//types od crossovers
//crossover1
//https://www.figma.com/file/nVrAkw9OzLQihgoBWDx0Ho/Untitled?type=whiteboard&node-id=2%3A322&t=GBDQItPHfuVcZY2m-1

crossover1 = (parent1, parent2) => {
  //clone all the sections and strip them of their classrooms
  let parent1withoutclassrooms = [];
  let parent2withoutclassrooms = [];
  for (let i = 0; i < parent1.length; i++) {
    let period = parent1[i];
    let newperiod = [];
    for (let j = 0; j < period.length; j++) {
      let section = period[j];
      if (section != null) {
        //should clone the atributtes of the section
        newperiod.push({
          course: section.course,
          sectionnumber: section.sectionnumber,
          teacher: section.teacher,
        });
      }
    }
    parent1withoutclassrooms.push(newperiod);
  }
  for (let i = 0; i < parent2.length; i++) {
    let period = parent2[i];
    let newperiod = [];
    for (let j = 0; j < period.length; j++) {
      let section = period[j];
      if (section != null) {
        //should clone the atributtes of the section
        newperiod.push({
          course: section.course,
          teacher: section.teacher,
        });
      }
    }
    parent2withoutclassrooms.push(newperiod);
  }

  //seperate each classroom into seperate arrays

  let child1 = [];
  let child2 = [];
  let divider1 = Math.floor(
    (Math.random() * parent1withoutclassrooms.length) / 2
  );
  let divider2 = Math.floor(
    (Math.random() * parent1.length) / 2 + parent1withoutclassrooms.length / 2
  );

  for (let i = 0; i < parent1.length; i++) {
    //enact worker function on each period
    child1.push(
      crossover1worker(
        parent1withoutclassrooms[i],
        parent2withoutclassrooms[i]
      ),
      divider1,
      divider2
    );
    child2.push(
      crossover1worker(
        parent2withoutclassrooms[i],
        parent1withoutclassrooms[i]
      ),
      divider1,
      divider2
    );
  }
  randomcleanup(child1);
  randomcleanup(child2);
};

const crossover1worker = (parent1, parent2, d1, d2) => {
  let c1 = [];
  let c2 = [];
  let c1set = new Set();
  let c2set = new Set();
  let c1duplicates = [];
  let c2duplicates = [];
  for (let i = 0; i < d1; i++) {
    c1.push(parent1[i]);
  }
  for (let i = d1; i < d2; i++) {
    c1.push(parent2[i]);
  }
  for (let i = d2; i < parent2.length; i++) {
    c1.push(parent1[i]);
  }
  for (let i = 0; i < d1; i++) {
    c2.push(parent2[i]);
  }
  for (let i = d1; i < d2; i++) {
    c2.push(parent1[i]);
  }
  for (let i = d2; i < parent2.length; i++) {
    c2.push(parent2[i]);
  }
  //cleanup
  //find duplicates throw into other array
  for (let i = 0; i < c1.length; i++) {
    if (c1set.has(c1[i])) {
      c1duplicates.push(c1[i]);
      c1[i] = null;
    } else {
      c1set.add(c1[i]);
    }
  }
  for (let i = 0; i < c2.length; i++) {
    if (c2set.has(c2[i])) {
      c2duplicates.push(c2[i]);
      c2[i] = null;
    } else {
      c2set.add(c2[i]);
    }
  }
  //replace duplicates
  for (i = 0; i < c1.length; i++) {
    if (c1[i] == null) {
      c1[i] = c2duplicates.pop();
    }
  }
  for (i = 0; i < c2.length; i++) {
    if (c2[i] == null) {
      c2[i] = c1duplicates.pop();
    }
  }
  return [c1, c2];
};
let testarr = "abcdefghij".split("");
let testarr2 = "acdfghijeb".split("");
console.log(crossover1worker(testarr, testarr2, 2, 6));

//duplicates in child1 are
const randomcleanup = (child1, child2) => {};
