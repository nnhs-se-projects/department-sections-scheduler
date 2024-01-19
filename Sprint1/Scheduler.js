let courses = require("./Courses.json").courses;
let classrooms = require("./Classrooms.json").classrooms;

let sectionArr = [];
let periodsClassArr = [];

// create sections for each class and then add them to the section array
for (let course of courses) {
  for (i = 0; i < course.sections; i++) {
    sectionArr.push({
      //course: course,
      section: i + 1,
      periodClass: null,
    });
  }
}

// create period classrooms for each classroom and then add them to the period class array
for (let classroom of classrooms) {
  for (let period of classroom.periodsAvailable) {
    periodsClassArr.push({
      classroom: classroom.roomNum,
      period: period,
    });
  }
}

for (let section of sectionArr) {
  if (periodsClassArr.length == 0) {
    console.log("No more periods to assign");
    break;
  }
  section.periodClass = periodsClassArr.pop();
}

console.log(sectionArr);
