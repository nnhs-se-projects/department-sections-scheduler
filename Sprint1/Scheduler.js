let sectionArr = [];
let periodsClassArr = [];
const courses = require("./Courses.json");
const config = require("./Config.json");
const classroomArr = require("./Classrooms.json");
const classroomList = classroomArr.map((classroom) => classroom.roomNum);
const teacherArr = require("./Teachers.json");
const teacherString = JSON.stringify(teacherArr);
const fs = require("fs");

let formattedSchedule = function (arr) {
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

  //iterate through arr and add each section to the formattedArr
  for (i = 0; i < arr.length; i++) {
    if (arr[i].periodClass != null) {
      roomIndex = classroomList.indexOf(arr[i].periodClass.classroom);
      formattedArr[arr[i].periodClass.period - 1][roomIndex] = arr[i];
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
  // Transpose the array to switch rows and columns
  const transposedArr = arr[0].map((_, colIndex) =>
    arr.map((row) => row[colIndex])
  );

  // Print the top border
  let topBorder = "╔";
  for (let j = 0; j < transposedArr[0].length + 1; j++) {
    topBorder += "═══════════════════════════════╗";
  }
  console.log(topBorder);

  // Print the header
  let header = "║ CTE Schedule by George".padEnd(32) + "║";
  for (let j = 0; j < transposedArr[0].length; j++) {
    header += ` Period ${j + 1}`.padEnd(31) + `║`;
  }
  console.log(header);

  // Print the separator
  let separator = "╠";
  for (let j = 0; j < transposedArr[0].length + 1; j++) {
    separator += "═══════════════════════════════╣";
  }
  console.log(separator);

  for (let i = 0; i < transposedArr.length; i++) {
    let row = `║ Room ${classroomList[i].toString().padEnd(25)}` + `║`;
    for (let j = 0; j < transposedArr[i].length; j++) {
      // Add padding to align columns
      let item = transposedArr[i][j]
        ? ` ${transposedArr[i][j].course.name} - ${transposedArr[i][j].sectionNumber}`.padEnd(
            31
          ) + `║`
        : " Empty                         ║";
      row += item;
    }
    console.log(row);

    // Print the separator after each row
    if (i < transposedArr.length - 1) console.log(separator);
  }

  // Print the bottom border
  let bottomBorder = "╚";
  for (let j = 0; j < transposedArr[0].length + 1; j++) {
    bottomBorder += "═══════════════════════════════╝";
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

  //parse is used to create a deep copy of the teacherArr
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
  for (let i = 0; i < teachers.length; i++) {
    teacher = teachers[i];
    if (
      !(
        teacher.openPeriods.includes(4) ||
        teacher.openPeriods.includes(5) ||
        teacher.openPeriods.includes(6)
      )
    ) {
      totalErrors++;
    }
  }
  console.log("Total errors: " + totalErrors);
  return totalErrors;
};

let generateSchedule = function () {
  //main code
  let teacherFailed = true;
  findCoursePriority();
  createSections();
  let classroomSchedulingAttempts = 0;
  let teacherSchedulingAttempts = 0;
  //throw out every schedule that doesn't work;
  //give teachers a failCap number of attempts to schedule before giving up
  while (teacherFailed) {
    //number of times period-classrooms have been assigned
    classroomSchedulingAttempts++;
    //if the teacher scheduling algorithm has failed, we need to reset the period-classrooms and reassign them
    teacherFailed = false;
    //whether or not the period-classrooms have been assigned validly
    let coursesAssigned = false;
    //whether or not the teacher scheduling algorithm has failed or if it has exceeded the failCap
    let teachersAssigned = false;

    //amount of times the teacher scheduling algorithm can failed before restarting
    //The higher this value, the longer the algorithm will run and the smaller the variation of schedules
    const failCap = 5;

    //amount of time the teacher scheduling algorithm has failed
    let failCount = 0;
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
        //they havent been assigned but we need to break out of the loop
        teachersAssigned = true;
      }
    }
  }

  //error check
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

  //info logging
  console.log("Total errors: " + errors);
  console.log("Total trial schedules made: " + classroomSchedulingAttempts);
  console.log("Total times teachers attempted: " + teacherSchedulingAttempts);
  return formattedSchedule(sectionArr);
};

let generateSchedules = function (numSchedules) {
  let schedules = [];
  for (let k = 0; k < numSchedules; k++) {
    //console.log("Generating schedule " + k);
    schedules.push(generateSchedule());
    //console.log("Schedule " + k + " generated");
  }
  return schedules;
};

//print schedule

//printInCoolWay(generateSchedule());

// let thing = generateSchedules(5);
// console.log(thing.length);
// for (i = 0; i < thing.length; i++) {
//   console.log("Schedule " + (i + 1));
//   printInCoolWay(thing[i]);
// }

let writeSchedules = function (num) {
  let schedulesArr = generateSchedules(num);

  for (let a = 0; a < num; a++) {
    fs.writeFileSync(
      "./Sprint1/GeneratedSchedules/Schedule" + (a + 1) + ".json",
      JSON.stringify(schedulesArr[a])
    );
  }
};

writeSchedules(100);

///cupcakes are good
