let courses = require("./Courses.json");
let config = require("./Config.json");

let classroomArr = require("./Classrooms.json");
let roomArr = map((classroom) => classroom.roomNum);
let classroomList = classroomArr.map((classroom) => classroom.roomNum);
let teacherArr = require("./Teachers.json");
let sectionArr = [];
let periodsClassArr = [];
let courseTeacherCount = [];

let initializeVisualSchedule = function () {
  let visualSchedule = []; // 2d array of classrooms and periods
  //initial setup of 2d array

  for (i = 0; i < config.numPeriods; i++) {
    let tempArr = [];
    for (j = 0; j < classroomArr.length; j++) {
      tempArr.push(null);
    }
    visualSchedule.push(tempArr);
  }

  for (i = 0; i < sectionArr.length; i++) {
    console.log(
      sectionArr[i].periodClass.period +
        " " +
        sectionArr[i].periodClass.classroom
    );
    roomIndex = visualSchedule[sectionArr[i].periodClass.period][
      visualSchedule[0].indexOf(roomArr[i].periodClass.classroom)
    ] = sectionArr[i];
  }
  //index = visualSchedule[0].indexOf(sectionArr[3].periodClass.classroom);
  //console.log(visualSchedule[sectionArr[3].periodClass.period][index]);
  //visualSchedule[sectionArr[3].periodClass.period][index] = sectionArr[3];
  //console.log(visualSchedule[sectionArr[3].periodClass.period][index]);
  return visualSchedule;
};

let updateSchedule = function (visualSchedule) {
  //update schedule
  for (let section of sectionArr) {
    visualSchedule[section.periodClass.period][section.periodClass.classroom] =
      section;
  }
};

// function main code by beloved ChatGPT
let printInCoolWay = function (arr) {
  for (let i = 0; i < arr.length; i++) {
    let row = "[ ";
    for (let j = 0; j < arr[i].length; j++) {
      // Add padding to align columns
      row += `(item${arr[i][j]}) | `;
    }
    // Remove the trailing ' | ' and add the closing bracket
    row = row.slice(0, -2) + " ]";
    console.log(row);
  }
};

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
//find the amount of teachers who can teach each course
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
    courseTeacherCount[course.course] += 1;

    //find index of courses object that has name that = course
  }
}
console.log(courseTeacherCount);

//sort the courseTeacherCount array by the number of teachers who can teach each course
const sortedCourseTeachersCount = Object.keys(courseTeacherCount).sort(
  (a, b) => courseTeacherCount[a] - courseTeacherCount[b]
);
console.log(sortedCourseTeachersCount);
//assign teachers to sections

for (let course of sortedCourseTeachersCount) {
  for (let teacher of teacherArr) {
    if (teacher.certifiedCourses.includes(course)) {
      for (let section of sectionArr) {
        if (section.course.name == course) {
          section.teacher = teacher;
          break;
        }
      }
    }
  }
}

//print array (in super cool way)
//printInCoolWay(visualSchedule);

console.log(initializeVisualSchedule());
