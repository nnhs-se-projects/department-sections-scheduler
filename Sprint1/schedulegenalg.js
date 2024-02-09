//inital population
// const initalPopulation = [
//   [1, 2, 3, 4, 5, 6, 7, 8, 9],
//   [9, 8, 7, 6, 5, 4, 3, 2, 1],
//   [5, 6, 7, 8, 9, 4, 3, 2, 1],

const config = require("./Config.json");
const {
  formatSchedule,
  updateFormattedSchedule,
  printInCoolWay,
} = require("./Scheduler.js");
//
//create ~50 randokm schedules
//actual genetic algorithm
//scoring
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
        teacherPreference += section.teacher.preference;
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
  }
  lunchCount = lunchCount / teacherSpecific.length;
  teacherPreference = teacherPreference / sectioncount;

  return sigmoid(config * teacherPreference + weight2 * lunchCount);
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
