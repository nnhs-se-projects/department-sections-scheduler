const sectionArr = [];
let periodsClassArr = [];
const courses = require("./Courses.json");
const config = require("./Config.json");
const classroomArr = require("./Classrooms.json");
const classroomList = classroomArr.map((classroom) => classroom.roomNum);
const teacherArr = require("./Teachers.json");
const teacherString = JSON.stringify(teacherArr);
const fs = require("fs");

let lunchError = false;

let formattedSchedule = function (arr) {
  let formattedArr = []; // 2d array of classrooms and periods
  //initial setup of 2d array

  for (let i = 0; i < config.numPeriods; i++) {
    let tempArr = [];
    for (let j = 0; j < classroomArr.length; j++) {
      tempArr.push(null);
      //tempArr.push("Empty " + classroomList[j] + " period");
    }
    formattedArr.push(tempArr);
  }

  //iterate through arr and add each section to the formattedArr
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].periodClass != null) {
      roomIndex = classroomList.indexOf(arr[i].periodClass.classroom);
      formattedArr[arr[i].periodClass.period - 1][roomIndex] = arr[i];
    }
  }

  return formattedArr;
};

let updateFormattedSchedule = function (formattedArr) {
  //update schedule
  for (let i = 0; i < sectionArr.length; i++) {
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
    for (let i = 0; i < course.sections; i++) {
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
    for (let i = 0; i < remainingSections.length; i++) {
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
  const schedule = [];
  for (let i = 0; i < config.numPeriods; i++) {
    schedule.push([]);
    for (let j = 0; j < classroomArr.length; j++) {
      schedule[i].push(null);
    }
  }

  //assign sections to schedule
  for (const section of sectionArr) {
    schedule[section.periodClass.period - 1][
      classroomList.indexOf(section.periodClass.classroom)
    ] = section;
  }
};

const checkForValidSections = function () {
  for (const course of courses) {
    const teachers = JSON.parse(teacherString);
    const assignableTeachers = teachers.filter((teacher) =>
      teacher.courses.map((item) => item.course).includes(course.name)
    );
    let totalTeachableSections = 0;
    for (const teacher of assignableTeachers) {
      totalTeachableSections += teacher.courses.find(
        (item) => item.course === course.name
      ).sections;
    }
    console.log(totalTeachableSections === course.sections);
    if (!(totalTeachableSections === course.sections)) {
      return false;
    }
  }
  return true;
};
// let assignTeachersToSections = function () {
//   let lunchError = 0;
//   let totalErrors = 0;
//   for (let section of sectionArr) {
//     section.teacher = undefined;
//   }

//   //parse is used to create a deep copy of the teacherArr
//   let teachers = JSON.parse(teacherString);

//   for (let section of sectionArr) {
//     let assignableTeachers = teachers.filter(
//       (teacher) =>
//         teacher.certifiedCourses
//           .map((item) => item.course)
//           .includes(section.course.name) &&
//         teacher.openPeriods.includes(section.periodClass.period) &&
//         teacher.openPeriods.length > 3
//     );
//     if (assignableTeachers.length == 0) {
//       // console.log(
//       //   "No more valid teachers available to assign to " +
//       //     section.course.name +
//       //     " section " +
//       //     section.sectionNumber +
//       //     " in period: " +
//       //     section.periodClass.period
//       // );
//       totalErrors++;
//     } else {
//       teacherIndex = Math.floor(Math.random() * assignableTeachers.length);
//       teachers[
//         teachers.indexOf(assignableTeachers[teacherIndex])
//       ].openPeriods.splice(
//         assignableTeachers[teacherIndex].openPeriods.indexOf(
//           section.periodClass.period
//         ),
//         1
//       );
//       section.teacher = assignableTeachers[teacherIndex];

//       // console.log(
//       //   "Assigned " +
//       //     assignableTeachers[teacherIndex].name +
//       //     " to " +
//       //     section.course.name +
//       //     " section " +
//       //     section.sectionNumber +
//       //     " in period: " +
//       //     section.periodClass.period
//       // );
//     }
//   }
//   for (let i = 0; i < teachers.length; i++) {
//     teacher = teachers[i];
//     if (
//       !(
//         teacher.openPeriods.includes(4) ||
//         teacher.openPeriods.includes(5) ||
//         teacher.openPeriods.includes(6)
//       )
//     ) {
//       totalErrors++;
//       lunchError++;
//     }
//   }
//   errString = "Total errors: ";
//   let str = "";

//   for (let i = 0; i < lunchError; i++) {
//     str += "🍔";
//   }
//   for (let i = 0; i < totalErrors; i++) {
//     errString += "❌";
//   }
//   for (let i = 0; i < 40 - totalErrors; i++) {
//     errString += " ";
//   }

//   console.log(errString + "Starving Teachers: " + str);
//   //console.log("🍔🔥💀👌");
//   return totalErrors;
// };

const assignTeachersToSections = function () {
  let totalErrors = 0;
  for (const section of sectionArr) {
    section.teacher = undefined;
  }

  // Parse is used to create a deep copy of the teacherArr
  const teachers = JSON.parse(teacherString);

  for (const curTeacher of teachers) {
    let teacherCourseID = 1;
    for (const curCourse of curTeacher.courses) {
      for (let i = 0; i <= curCourse.sections; i++) {
        const assignableSections = sectionArr.filter(
          (section) =>
            section.course.name === curCourse.name &&
            section.teacher === undefined
        );
        if (assignableSections.length === 0) {
          totalErrors++;
        } else {
          const sectionIndex = Math.floor(
            Math.random() * assignableSections.length
          );
          sectionArr[
            sectionArr.indexOf(assignableSections[sectionIndex])
          ].teacher = curTeacher;
          sectionArr[
            sectionArr.indexOf(assignableSections[sectionIndex])
          ].courseID = `${
            sectionArr[sectionArr.indexOf(assignableSections[sectionIndex])]
              .course.name
          }-${
            sectionArr[sectionArr.indexOf(assignableSections[sectionIndex])]
              .teacher.name
          }-${teacherCourseID}`;
        }
      }
    }
    teacherCourseID++;
  }
  for (let i = 0; i < teachers.length; i++) {
    const teacher = teachers[i];
    if (
      !(
        teacher.openPeriods.includes(4) ||
        teacher.openPeriods.includes(5) ||
        teacher.openPeriods.includes(6)
      )
    ) {
      console.log(teacher.name + " is missing a lunch period");
      totalErrors++;
    }
  }
  console.log("Total errors: " + totalErrors);
  return totalErrors;
};

const generateSchedule = function () {
  // Main code
  let teacherFailed = true;
  findCoursePriority();
  createSections();
  let classroomSchedulingAttempts = 0;
  let teacherSchedulingAttempts = 0;
  // Throw out every schedule that doesn't work;
  // Give teachers a failCap number of attempts to schedule before giving up
  while (teacherFailed) {
    // Number of times period-classrooms have been assigned
    classroomSchedulingAttempts++;
    // If the teacher scheduling algorithm has failed, we need to reset the period-classrooms and reassign them
    teacherFailed = false;
    // Whether or not the period-classrooms have been assigned validly
    let coursesAssigned = false;
    // Whether or not the teacher scheduling algorithm has failed or if it has exceeded the failCap
    let teachersAssigned = false;

    // Amount of times the teacher scheduling algorithm can failed before restarting
    // The higher this value, the longer the algorithm will run and the smaller the variation of schedules
    const failCap = 5;

    // Amount of time the teacher scheduling algorithm has failed
    let failCount = 0;
    while (!coursesAssigned) {
      createPeriodClassrooms();
      coursesAssigned = assignPeriodClassrooms();
    }
    while (!teachersAssigned) {
      teacherSchedulingAttempts++;
      createInitSchedule();
      if (assignTeachersToSections() === 0) {
        teachersAssigned = true;
      } else {
        failCount++;
        // console.log("failure encountered");
        // console.log(failures);
      }
      if (failCount >= failCap) {
        teacherFailed = true;
        // Teachers haven't been assigned and we need to break out of the loop
        teachersAssigned = true;
      }
    }
  }

  // Error check
  let errors = 0;
  for (const section of sectionArr) {
    if (section.teacher === undefined || section.teacher == null) {
      console.log("Teacher not assigned to " + section.course.name);
      errors++;
    }
    if (section.periodClass === undefined || section.periodClass == null) {
      console.log("Period-classroom not assigned to " + section.course.name);
      errors++;
    }
  }

  // Info logging
  const errString = "Total errors: " + errors;
  errString.padEnd(20, " ");
  // console.log(errString + "  Starving Teacher? " + lunchError);
  console.log("Total trial schedules made: " + classroomSchedulingAttempts);
  console.log("Total times teachers attempted: " + teacherSchedulingAttempts);
  return formattedSchedule(sectionArr);
};

const generateSchedules = function (numSchedules) {
  const schedules = [];
  for (let k = 0; k < numSchedules; k++) {
    // console.log("Generating schedule " + k);
    schedules.push(generateSchedule());
    // console.log("Schedule " + k + " generated");
  }
  return schedules;
};

const writeSchedules = function (num, print) {
  const schedulesArr = generateSchedules(num);

  for (let a = 0; a < num; a++) {
    fs.writeFileSync(
      "./Sprint1/GeneratedSchedules/Schedule" + (a + 1) + ".json",
      JSON.stringify(schedulesArr[a])
    );
  }

  if (print) {
    for (let i; i < schedulesArr.length; i++) {
      console.log("");
      console.log("");
      console.log("");
      console.log("Schedule " + i + ":");
      printInCoolWay(schedulesArr[i]);
    }
  }
};

if (checkForValidSections()) {
  writeSchedules(100, true);
} else {
  console.log("Invalid number of sections to teachers");
}

// "Cupcakes are good
// I like cupcakes
// From the store
// They are good
// I like cupcakes
// Yes I do
// good cupcakes
// Please give me some cupcakes
// So I can eat them
// Good cupcakes
// How I love them
// Let me count the ways
// One, two, three
// Red velvet, chocolate, vanilla
// So many flavors
// I like cupcakes"
// - Written by Copilot

// The German Junkers Ju 87 Stuka dive bomber was a key element of the German Blitzkrieg tactics and was very successful in the early stages of the war. The Stuka was a
// very effective weapon, but it was vulnerable to enemy fighters. The Stuka was eventually replaced by more modern aircraft, but it remained in service until the end of the war.
// It was used in all major German offensives, including the invasion of Poland, the Battle of France, and the invasion of the Soviet Union. The Stuka was also used in the
// Mediterranean and North Africa, where it was used to support German and Italian ground forces. The Stuka was a feared weapon, and its distinctive siren became a symbol of
// German air power. The Stuka was eventually replaced by more modern aircraft, but it remained in service until the end of the war.
// It dive bombed by diving at a steep angle, releasing its bombs at the last moment before pulling out of the dive. This made it a very accurate weapon, and it was used to
// great effect against enemy tanks, artillery, and infantry. The Stuka was retrofitted with a cannon that fired through the propeller, making it a very effective ground attack
// and dive breaks so it could pull out of the dive even if the pilot was unconscious.
// - Mostly written by Copilot
