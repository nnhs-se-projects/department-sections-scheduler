let courses = require("./Courses.json");
let config = require("./Config.json");

let classroomArr = require("./Classrooms.json");
let classroomList = classroomArr.map((classroom) => classroom.roomNum);
let teacherArr = require("./Teachers.json");
let sectionArr = [];
let periodsClassArr = [];
let courseTeacherCount = [];

// create sections for each class and then add them to the section array
for (let course of courses) {
  for (i = 0; i < course.sections; i++) {
    sectionArr.push({
      course: course,
      section: i + 1,
      periodClass: null,
    });
  }
}

// create period classrooms for each classroom and then add them to the period class array
for (let classroom of classroomArr) {
  for (let period of classroom.periodsAvailable) {
    periodsClassArr.push({
      classroom: classroom.roomNum,
      period: period,
    });
  }
}

for (let section of sectionArr) {
  if (periodsClassArr.length == 0) {
    console.log(
      "No more period-classrooms available to assign to " +
        section.course.name +
        " section " +
        section.section
    );
  }
  section.periodClass = periodsClassArr.pop();
}

console.log("\nCurrent course list:");
console.log(sectionArr);
//create 2d array
let schedule = [];
for (let i = 0; i < config.numPeriods; i++) {
  schedule.push([]);
  for (let j = 0; j < classroomArr.length; j++) {
    schedule[i].push(null);
  }
}
//assign sections to schedule
for (let section of sectionArr) {
  console.log(
    "Assigning " +
      section.course.name +
      " section " +
      section.section +
      " to period " +
      section.periodClass.period +
      " classroom " +
      section.periodClass.classroom
  );
  schedule[section.periodClass.period - 1][
    classroomList.indexOf(section.periodClass.classroom)
  ] = section;
}
console.log("\nInitial schedule w/o teachers:");
//print schedule by rows
console.log(schedule);

//assign teachers
console.log("\nAssigning teachers:");
console.log(teacherArr);
//find the ammount of teachers who can teach each course
//build a dictionary of course names and the number of teachers who can teach them
for (let course of courses) {
  courseTeacherCount[course.name] = 0;
}
console.log(courseTeacherCount);
for (let teacher of teacherArr) {
  for (let course of teacher.certifiedCourses) {
    //

    console.log("Teacher " + teacher.name + " can teach " + course);
    console.log(course);
    //find index of courses object that has name that = course
    let courseIndex = courses.findIndex(
      (courseObj) => courseObj.name == course
    );
    console.log(courseIndex);
  }
}
console.log(courseTeacherCount);
