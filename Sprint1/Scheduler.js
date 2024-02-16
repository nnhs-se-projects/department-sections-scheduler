let sectionArr = [];
let periodsClassArr = [];
let courseTeacherCount = [];
const courses = require("./Courses.json");
const config = require("./Config.json");

const classroomArr = require("./Classrooms.json");
const classroomList = classroomArr.map((classroom) => classroom.roomNum);
const teacherArr = require("./Teachers.json");

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
    header += ` Classroom ${j + 1}         ║`;
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
        ? ` ${arr[i][j].course.name} - ${arr[i][j].section} ║`
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
let updateSections = function (arr) {
  arr.sort((a, b) => b.course.schedulingPriority - a.course.schedulingPriority);
  return arr;
};

// create sections for each class and then add them to the section array
let createSections = function (arr) {
  //clear array
  while (arr.length > 0) {
    arr.pop();
  }

  for (let course of courses) {
    for (i = 0; i < course.sections; i++) {
      arr.push({
        course: course,
        section: i + 1,
        periodClass: null,
      });
    }
  }
  arr = updateSections(arr);
  console.log(arr);
  return arr;
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
  updateSections(arr);
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
    updateSections(arr);
  }
  return arr;
};

// create period classrooms for each classroom and then add them to the period class array
let createPeriodClassrooms = function () {
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
  for (let section of sectionArr) {
    let assignableRooms = periodsClassArr.filter((perClass) =>
      section.course.compatibleClassrooms.includes(perClass.classroom)
    ); // FIXME: This is not working !!! Filter query not correct
    if (assignableRooms.length == 0) {
      console.log(
        "No more valid period-classrooms available to assign to " +
          section.course.name +
          " section " +
          section.section
      );
    } else {
      section.periodClass = periodsClassArr.splice(
        periodsClassArr.indexOf(
          assignableRooms[Math.floor(Math.random() * assignableRooms.length)]
        ),
        1
      )[0];
    }
  }
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
};

let assignTeachersToSections = function () {
  for (let section of sectionArr) {
    let assignableTeachers = teacherArr.filter(
      (teacher) =>
        teacher.certifiedCourses.find((teachableCourse) => {
          teachableCourse.course == section.course.name;
        }) > 0 && teacher.openPeriods.includes(section.periodClass.period)
    );
    if (assignableTeachers.length == 0) {
      console.log(
        "No more valid teachers available to assign to " +
          section.course.name +
          " section " +
          section.section
      );
    } else {
      teacherIndex = Math.floor(Math.random() * assignableTeachers.length);
      assignableTeachers[teacherIndex].openPeriods.splice(
        assignableTeachers[teacherIndex].openPeriods.indexOf(
          section.periodClass.period
        ),
        1
      );
      section.teacher = assignableTeachers[teacherIndex];
      console.log(
        "Assigned " +
          assignableTeachers[teacherIndex].name +
          " to " +
          section.course.name +
          " section " +
          section.section
      );
    }
  }
};
createSections(sectionArr);
createPeriodClassrooms();
assignPeriodClassrooms();
createInitSchedule();
console.log("\nInitial schedule w/o teachers:");
//print schedule by rows
assignTeachersToSections();

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
