let sectionArr = [];
let periodsClassArr = [];
let courseTeacherCount = [];
const courses = require("./Courses.json");
const config = require("./Config.json");
//for failures
let failures = [];

const classroomArr = require("./Classrooms.json");
const classroomList = classroomArr.map((classroom) => classroom.roomNum);
let teacherArr = require("./Teachers.json");
const teacherString = JSON.stringify(teacherArr);

let formattedSchedule = function () {
  let formattedArr = []; // 2d array of classrooms and periods
  //initial setup of 2d array

  for (i = 0; i < config.numPeriods; i++) {
    let tempArr = [];
    for (j = 0; j < classroomArr.length; j++) {
      tempArr.push(null);
      //tempArr.push("Empty " + classroomList[j] + " period");
    }
    formattedArr.push(tempArr);
  }

  //iterate through sectionArr and add each section to the formattedArr
  for (i = 0; i < sectionArr.length; i++) {
    if (sectionArr[i].periodClass != null) {
      roomIndex = classroomList.indexOf(sectionArr[i].periodClass.classroom);
      formattedArr[sectionArr[i].periodClass.period - 1][roomIndex] =
        sectionArr[i];
    }
  }

  return formattedArr;
};

let updateFormattedSchedule = function (formattedArr) {
  //update schedule
  for (i = 0; i < sectionArr.length; i++) {
    if (sectionArr[i].periodClass != null) {
      roomIndex = classroomList.indexOf(sectionArr[i].periodClass.classroom);
      formattedArr[sectionArr[i].periodClass.period - 1][roomIndex] =
        sectionArr[i];
    }
  }
};

let findCoursePriority = function () {
  //all priorities should total 1
  const classroomPriority = 0.4;
  const periodPriority = 0.4;
  const sectionPriority = 0.2;
  const sectionCap = 4;
  //sectionCap is the maximum number of sections that designates a course as a high priority course
  //any amount of sections over sectionCap will not increase the priority of the course

  for (let course of courses) {
    if (course.schedulingPriority == undefined) {
      course.schedulingPriority = 0;
      course.schedulingPriority +=
        classroomPriority * (1 / course.compatibleClassrooms.length);
      course.schedulingPriority +=
        periodPriority * (1 / course.compatiblePeriods.length);
      course.schedulingPriority +=
        sectionPriority *
        ((course.sections > sectionCap ? sectionCap : course.sections) /
          sectionCap);
      // console.log(
      //   "Course " +
      //     course.name +
      //     " has a calculated scheduling priority of " +
      //     course.schedulingPriority
      // );
    } else {
      // console.log(
      //   "Course " +
      //     course.name +
      //     " has a defined scheduling priority of " +
      //     course.schedulingPriority
      // );
    }
  }
};

// function main code by beloved ChatGPT
let printInCoolWay = function (arr) {
  // Print the top border
  let topBorder = "╔";
  for (let j = 0; j < arr[0].length; j++) {
    topBorder += "═════════════════════╗";
  }
  console.log(topBorder);

  // Print the header
  let header = "║";
  for (let j = 0; j < arr[0].length; j++) {
    header += ` Room ${classroomList[j].toString().padEnd(15)}║`;
  }
  console.log(header);

  // Print the separator
  let separator = "╠";
  for (let j = 0; j < arr[0].length; j++) {
    separator += "═════════════════════╣";
  }
  console.log(separator);

  for (let i = 0; i < arr.length; i++) {
    let row = "║";
    for (let j = 0; j < arr[i].length; j++) {
      // Add padding to align columns
      let item = arr[i][j]
        ? ` ${arr[i][j].course.name} - ${arr[i][j].sectionNumber} ║`
        : " Empty               ║";
      row += item;
    }
    console.log(row);

    // Print the separator after each row
    if (i < arr.length - 1) console.log(separator);
  }

  // Print the bottom border
  let bottomBorder = "╚";
  for (let j = 0; j < arr[0].length; j++) {
    bottomBorder += "═════════════════════╝";
  }
  console.log(bottomBorder);
};

//update sections by priority
let sortSections = function () {
  sectionArr.sort(
    (a, b) => b.course.schedulingPriority - a.course.schedulingPriority
  );
};

// create sections for each class and then add them to the section array
let createSections = function () {
  //clear array
  while (sectionArr.length > 0) {
    sectionArr.pop();
  }

  for (let course of courses) {
    for (i = 0; i < course.sections; i++) {
      sectionArr.push({
        course: course,
        sectionNumber: i + 1,
        periodClass: null,
      });
    }
  }
  //sectionArr = sortSections();
};

let addSection = function (arr, course) {
  let secNum = 1;
  for (section in arr) {
    if (section.course == course) {
      secNum++;
    }
  }
  arr.push({
    course: course,
    section: secNum,
    periodClass: null,
  });
  sortSections();
  return arr;
};

let removeSection = function (arr, course) {
  let removedSection = null;
  let remainingSections = [];
  for (section in arr) {
    if (section.course == course && removedSection == null) {
      removedSection = section;
      arr.splice(section, 1);
    } else if (section.course == course && removedSection != null) {
      remainingSections.push(section);
    }
  }
  if (removedSection == null) {
    console.log("No sections of " + course + " found");
  } else {
    for (i = 0; i < remainingSections.length; i++) {
      arr[i].section = i + 1;
    }
    sortSections();
  }
  return arr;
};

// create period classrooms for each classroom and then add them to the period class array
let createPeriodClassrooms = function () {
  periodsClassArr = [];
  for (let classroom of classroomArr) {
    for (let period of classroom.periodsAvailable) {
      periodsClassArr.push({
        classroom: classroom.roomNum,
        period: period,
      });
    }
  }
};

//assign period-classrooms to sections
let assignPeriodClassrooms = function () {
  sortSections();
  for (let section of sectionArr) {
    let assignableRooms = periodsClassArr.filter(
      (perClass) =>
        section.course.compatibleClassrooms.includes(perClass.classroom) &&
        section.course.compatiblePeriods.includes(perClass.period)
    );

    if (assignableRooms.length == 0) {
      // console.log(
      //   "No more valid period-classrooms available to assign to " +
      //     section.course.name +
      //     " section " +
      //     section.sectionNumber
      // );
      return false;
    } else {
      section.periodClass = periodsClassArr.splice(
        periodsClassArr.indexOf(
          assignableRooms[Math.floor(Math.random() * assignableRooms.length)]
        ),
        1
      )[0];
      // console.log(
      //   "Assigning " +
      //     section.course.name +
      //     " section " +
      //     section.sectionNumber +
      //     " to period " +
      //     section.periodClass.period +
      //     " classroom " +
      //     section.periodClass.classroom
      // );
      // console.log("Remaining period-classrooms: " + periodsClassArr.length);
    }
  }
  return true;
};

let createInitSchedule = function () {
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
    schedule[section.periodClass.period - 1][
      classroomList.indexOf(section.periodClass.classroom)
    ] = section;
  }
};

let assignTeachersToSections = function () {
  let totalErrors = 0;
  for (let section of sectionArr) {
    section.teacher = undefined;
  }
  let teachers = JSON.parse(teacherString);

  for (let section of sectionArr) {
    let assignableTeachers = teachers.filter(
      (teacher) =>
        teacher.certifiedCourses
          .map((item) => item.course)
          .includes(section.course.name) &&
        teacher.openPeriods.includes(section.periodClass.period)
    );
    if (assignableTeachers.length == 0) {
      // console.log(
      //   "No more valid teachers available to assign to " +
      //     section.course.name +
      //     " section " +
      //     section.sectionNumber +
      //     " in period: " +
      //     section.periodClass.period
      // );
      totalErrors++;
    } else {
      teacherIndex = Math.floor(Math.random() * assignableTeachers.length);
      teachers[
        teachers.indexOf(assignableTeachers[teacherIndex])
      ].openPeriods.splice(
        assignableTeachers[teacherIndex].openPeriods.indexOf(
          section.periodClass.period
        ),
        1
      );
      section.teacher = assignableTeachers[teacherIndex];
      // console.log(
      //   "Assigned " +
      //     assignableTeachers[teacherIndex].name +
      //     " to " +
      //     section.course.name +
      //     " section " +
      //     section.sectionNumber +
      //     " in period: " +
      //     section.periodClass.period
      // );
    }
  }
  //console.log("Total errors: " + totalErrors);
  failures.push(totalErrors);
  return totalErrors;
};

let teacherFailed = true;

findCoursePriority();
createSections();
let schedulingAttempts = 0;
let teacherSchedulingAttempts = 0;
while (teacherFailed) {
  schedulingAttempts++;
  teacherFailed = false;
  let coursesAssigned = false;
  let teachersAssigned = false;
  let failCount = 0;
  const failCap = 5;
  while (!coursesAssigned) {
    createPeriodClassrooms();
    coursesAssigned = assignPeriodClassrooms();
  }
  while (!teachersAssigned) {
    teacherSchedulingAttempts++;
    createInitSchedule();
    if (assignTeachersToSections() == 0) {
      teachersAssigned = true;
    } else {
      failCount++;
      //console.log("failure encountered");
      //console.log(failures);
    }
    if (failCount >= failCap) {
      teacherFailed = true;
      teachersAssigned = true;
    }
  }
}
let errors = 0;
for (let section of sectionArr) {
  if (section.teacher == undefined || section.teacher == null) {
    console.log("Teacher not assigned to " + section.course.name);
    errors++;
  }
  if (section.periodClass == undefined || section.periodClass == null) {
    console.log("Period-classroom not assigned to " + section.course.name);
    errors++;
  }
}
console.log("Total trial schedules made: " + schedulingAttempts);
console.log("Total times teachers attempted: " + teacherSchedulingAttempts);

//console.log(schedule);
//for (let period of schedule) {
//   for (let classroom of period) {
//     if (classroom) {
//       console.log(
//         ` Course ${classroom.course.name} Period: ${classroom.periodClass.period} Classroom: ${classroom.periodClass.classroom} Teacher ${classroom.teacher.name} Section: ${classroom.section}`
//       );
//     }
//   }
// }

//create

//let temp schedule = the sections arr sorted by period then classroom
//we need to make a 2d array of classrooms and periods, and then print in in a readable and nice way

//print array (in super cool way)
//printInCoolWay(visualSchedule);

//print array (in super cool way)
printInCoolWay(formattedSchedule());

//console.log(formattedSchedule());
