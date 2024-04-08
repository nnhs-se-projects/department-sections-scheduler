//inital population
// const initalPopulation = [
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   [9, 8, 7, 6, 5, 4, 3, 2, 1],
//   [5, 6, 7, 8, 9, 4, 3, 2, 1],

const sigmoid = (x) => {
  return 1 / (1 + Math.exp(-x));
};
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
  //#num of teachers that have a lunch period
  let sectioncount = 0;
  for (let i = 0; i < schedule.length; i++) {
    let period = schedule[i];
    for (let j = 0; j < period.length; j++) {
      let section = period[j];
      if (section != null) {
        //console.log(section);
        for (let i = 0; i < section.teacher.certifiedCourses.length; i++) {
          if (
            section.teacher.certifiedCourses[i].course === section.course.name
          ) {
            teacherPreference += section.teacher.certifiedCourses[i].preference;
          }
        }
        sectioncount++;
      }
    }
  }
  let teacherSpecific = getTeacherSpecific(schedule);
  //fidn ammount of teachers that have a lunch period
  let lunchCount = 0;
  let averageConcurenceDiff = 0;
  for (let teacher of teacherSpecific) {
    if (
      teacher.openPeriods.includes(4) ||
      teacher.openPeriods.includes(5) ||
      teacher.openPeriods.includes(6)
    ) {
      //console.log(teacher.name + " has a lunch period");
      lunchCount++;
    }
    //find longest concurence of periods
    let longestConcurence = 0;
    let currentConcurence = 0;
    let scheduledperiods = [];
    for (let i = 1; i <= config.numPeriods; i++) {
      if (!teacher.openPeriods.includes(i)) {
        scheduledperiods.push(i);
      }
    }
    for (let i = 0; i < scheduledperiods.length; i++) {
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
  averageConcurenceDiff = averageConcurenceDiff / teacherSpecific.length;
  classroomStay = sigmoid(classroomStay);

  lunchCount = lunchCount / teacherSpecific.length;
  let fit =
    config.weights.teacherPreference * (teacherPreference / sectioncount) +
    config.weights.lunchCount * lunchCount +
    config.weights.longestConcurence * averageConcurenceDiff;
  config.weights.classroomStay * classroomStay;
  // console.log("teacherPreference: " + teacherPreference / sectioncount);
  // console.log("lunchCount: " + lunchCount);
  // console.log("longestConcurence: " + averageConcurenceDiff);
  // console.log("classroomStay: " + classroomStay);
  return fit;
};

const getTeacherSpecific = (schedule) => {
  let teacherSpecific = require("./Teachers.json");
  //console.log(teacherSpecific);
  for (let i = 0; i < schedule.length; i++) {
    let period = schedule[i];
    for (let j = 0; j < period.length; j++) {
      let section = period[j];
      if (section != null) {
        teacherSpecific.find((teacher) => {
          if (teacher.name === section.teacher.name) {
            // console.log(
            //   "removing period: " +
            //     section.periodClass.period +
            //     " from " +
            //     teacher.name
            // );
            teacher.openPeriods.pop(section.periodClass.period);
          }
        });
      }
    }
  }
  //console.log(teacherSpecific);
  return teacherSpecific;
};

//types od crossovers
//crossover1
//https://www.figma.com/file/nVrAkw9OzLQihgoBWDx0Ho/Untitled?type=whiteboard&node-id=2%3A322&t=GBDQItPHfuVcZY2m-1

const crossover1 = (parent1, parent2) => {
  console.log("cross1");
  console.log(parent1);
  console.log(parent2);
  let IDSet = new Set();
  for (let i = 0; i < parent1.length; i++) {
    IDSet.add(parent1[i].id);
  }
  w;
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
          sectionNumber: section.sectionNumber,
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
        parent2withoutclassrooms[i],
        divider1,
        divider2
      )
    );
    console.log("child 2 worker");
    child2.push(
      crossover1worker(
        parent2withoutclassrooms[i],
        parent1withoutclassrooms[i],
        divider1,
        divider2
      )
    );
  }
  console.log("cross1");
  console.log(child1);

  randomcleanup(child1, child2);
  return [child1, child2];
};

const crossover1worker = (parent1, parent2, d1, d2) => {
  console.log("cross1worker");
  console.log(parent1);
  console.log(parent2);

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

//duplicates in child1 are the missing sections in child2
//duplicates in child2 are the missing sections in child1
const randomcleanup = (child1, child2) => {
  console.log("cleanup");
  console.log(child1);
  console.log(child2);
  //find duplicates throw into other array
  c1set = new Set();
  c2set = new Set();
  let c1duplicates = [];
  let c2duplicates = [];
  for (let i = 0; i < child1.length; i++) {
    if (c1set.has(child1[i])) {
      c1duplicates.push(child1[i]);
      child1[i] = null;
    } else {
      c1set.add(child1[i]);
    }
  }
  for (let i = 0; i < child2.length; i++) {
    if (c2set.has(child2[i])) {
      c2duplicates.push(child2[i]);
      child2[i] = null;
    } else {
      c2set.add(child2[i]);
    }
  }
  //add duplicates to other array
  for (i = 0; i < c2duplicates.length; i++) {
    //iterate through period classrooms till you find a null
    for (j = 0; j < child1.length; j++) {
      for (k = 0; k < child1[j].length; k++) {
        if (child1[j][k] == null) {
          //check if section is compatable with classroom and the teacher who is assigned to a section is not already assigned to a section in that period
          if (
            child1[j][k].course.compatableClassrooms.includes(
              c2duplicates[i]
            ) &&
            !child1[j].includes(c2duplicates[i])
          ) {
            //teachers
            //iteate through periods and check if teacher is already assigned to a section in that period
            let teacher = c2duplicates[i].teacher;
            let teacherassigned = false;
            for (l = 0; l < child1.length; l++) {
              if (child1[l].includes(teacher)) {
                teacherassigned = true;
              }
            }
            if (!teacherassigned) {
              child1[j][k] = c2duplicates[i];
            }
            break;
          }
        }
      }
    }
  }

  //}
};

const isValidschedule = (schedule) => {
  return true; //fix this l`ater
  //check if all sections are scheduled
  let sections = setOfsectionsWOclassrooms(schedule);
  console.log(sections);
  for (let section of sections) {
    let scheduled = false;
    for (let i = 0; i < schedule.length; i++) {
      let period = schedule[i];
      for (let j = 0; j < period.length; j++) {
        let scheduledsection = period[j];
        if (
          scheduledsection != null &&
          scheduledsection.course === section.course &&
          scheduledsection.sectionnumber === section.sectionnumber
        ) {
          scheduled = true;
        }
      }
    }
    if (!scheduled) {
      return false;
    }
  }
  //check if all sections are scheduled in a compatable classroom
  for (let i = 0; i < schedule.length; i++) {
    let period = schedule[i];
    for (let j = 0; j < period.length; j++) {
      let section = period[j];
      if (section != null) {
        if (
          !section.course.compatableClassrooms.includes(section.periodClass)
        ) {
          return false;
        }
      }
    }
  }
  //check if no teacher is double booked
  let teacherSpecific = getTeacherSpecific(schedule);
  for (let teacher of teacherSpecific) {
    let scheduledperiods = [];
    for (let i = 0; i < schedule.length; i++) {
      let period = schedule[i];
      for (let j = 0; j < period.length; j++) {
        let section = period[j];
        if (section != null) {
          if (section.teacher.name === teacher.name) {
            if (scheduledperiods.includes(section.periodClass.period)) {
              return false;
            }
            scheduledperiods.push(section.periodClass.period);
          }
        }
      }
    }
  }
  return true;
};

//determines if a section can be scheduled in a particu,ar classroom
const isValidClassroom = (classroom, section) => {
  section.course.compatableClassrooms.includes(classroom);
};
//test crossover1
const testcross1 = () => {
  let parent1 = require("./GeneratedSchedules/Schedule1.json");
  let parent2 = require("./GeneratedSchedules/Schedule2.json");
  let childrenArray = crossover1(parent1, parent2);
  let child1 = childrenArray[0];
  let child2 = childrenArray[1];
  //save children to files
  const fs = require("fs");
  fs.writeFile(
    "./GeneratedSchedules/child1.json",
    JSON.stringify(child1),
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  fs.writeFile(
    "./GeneratedSchedules/child2.json",
    JSON.stringify(child2),
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
  console.log(isValidschedule(child1));
  console.log(isValidschedule(child2));
  console.log(fitness(child1));
  console.log(fitness(child2));
  console.log("child1");
  console.log(child1);
  console.log("child2");
  console.log(child2);
};

testcross1();

module.exports = {
  crossover1,
  fitness,
  isValidschedule,
  setOfsectionsWOclassrooms,
  getTeacherSpecific,
  isValidClassroom,
  randomcleanup,
  crossover1worker,
};
