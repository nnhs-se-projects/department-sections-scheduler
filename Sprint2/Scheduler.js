const sectionArr = [];
let periodsClassArr = [];
const courses = require("../server/model/Courses.json");
const config = require("./Config.json");
const classroomArr = require("../server/model/Classrooms.json");
const classroomList = classroomArr.map((classroom) => classroom.roomNum);
const teacherArr = require("../server/model/Teachers.json");
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
      item = "";
    }
    console.log(row);

    // Add teachers
    row = `║ Room ${classroomList[i].toString().padEnd(25)}` + `║`;
    for (let j = 0; j < transposedArr[i].length; j++) {
      // Add padding to align columns
      let item = transposedArr[i][j]
        ? ` ${transposedArr[i][j].teacher.name} - ${transposedArr[i][j].sectionNumber}`.padEnd(
            31
          ) + `║`
        : " Empty                         ║";
      row += item;
      item = "";
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

// stuff
const stringInCoolWay = function (arr) {
  console.log(arr);
  if (arr === false || arr === undefined || arr === null) {
    return false;
  }
  let temp = "";
  // Transpose the array to switch rows and columns
  const transposedArr = arr[0].map((_, colIndex) =>
    arr.map((row) => row[colIndex])
  );

  // Print the top border
  let topBorder = "╔";
  for (let j = 0; j < transposedArr[0].length + 1; j++) {
    topBorder += "═══════════════════════════════╗";
  }
  temp += topBorder + "\n";

  // Print the header
  let header = "║ CTE Schedule by George".padEnd(32) + "║";
  for (let j = 0; j < transposedArr[0].length; j++) {
    header += ` Period ${j + 1}`.padEnd(31) + `║`;
  }
  temp += header + "\n";

  // Print the separator
  let separator = "╠";
  for (let j = 0; j < transposedArr[0].length + 1; j++) {
    separator += "═══════════════════════════════╣";
  }
  temp += separator + "\n";

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
      item = "";
    }
    temp += row + "\n";

    // Add teachers
    row = `║ Room ${classroomList[i].toString().padEnd(25)}` + `║`;
    for (let j = 0; j < transposedArr[i].length; j++) {
      // Add padding to align columns
      let item = transposedArr[i][j]
        ? ` ${transposedArr[i][j].teacher.name} - ${transposedArr[i][j].sectionNumber}`.padEnd(
            31
          ) + `║`
        : " Empty                         ║";
      row += item;
      item = "";
    }
    temp += row + "\n";

    // Print the separator after each row
    if (i < transposedArr.length - 1) temp += separator + "\n";
  }

  // Print the bottom border
  let bottomBorder = "╚";
  for (let j = 0; j < transposedArr[0].length + 1; j++) {
    bottomBorder += "═══════════════════════════════╝";
  }
  temp += bottomBorder;

  return temp;
};

//update sections by priority
let sortSections = function () {
  // sectionArr.sort(
  //   (a, b) => b.course.schedulingPriority - a.course.schedulingPriority
  // );
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

let sectionSigmoid = function (section) {
  const periodSkew = [0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < sectionArr.length; i++) {
    if (
      (sectionArr[i].perClass !== undefined ||
        sectionArr[i].perClass !== null) &&
      sectionArr[i].course.name === section.course.name
    ) {
      periodSkew[sectionArr.periodClass.period - 1]++;
    }
  }
  // Find Minimum of period skew
  let min = periodSkew[0];
  let minIndex = 0;
  for (let i = 0; i < periodSkew.length; i++) {
    if (periodSkew[i] < min) {
      min = periodSkew[i];
      minIndex = i;
    }
  }
  return minIndex + 1;
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
      teacher.coursesAssigned.map((item) => item.course).includes(course.name)
    );
    let totalTeachableSections = 0;
    for (const teacher of assignableTeachers) {
      totalTeachableSections += teacher.coursesAssigned.find(
        (item) => item.course === course.name
      ).sections;
    }
    if (!(totalTeachableSections === course.sections)) {
      console.log(course);
      console.log("TeachSect:" + totalTeachableSections);
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
    // if (
    //   !(
    //     !curTeacher.openPeriods.includes(4) ||
    //     !curTeacher.openPeriods.includes(5) ||
    //     !curTeacher.openPeriods.includes(6)
    //   )
    // ) {
    //   curTeacher.openPeriods.splice(
    //     curTeacher.openPeriods.indexOf(Math.floor(Math.random() * 3 + 4)),
    //     1
    //   );
    // }

    for (const curCourse of curTeacher.coursesAssigned) {
      for (let i = 0; i < curCourse.sections; i++) {
        const assignableSections = sectionArr.filter(
          (section) =>
            section.course.name === curCourse.course &&
            section.teacher === undefined
        );
        if (assignableSections.length === 0) {
          console.log(
            curCourse.course +
              " has no more sections to assign to " +
              curTeacher.name +
              " on the " +
              (i + 1) +
              "th section"
          );
          totalErrors++;
        } else {
          const sectionIndex = Math.floor(
            Math.random() * assignableSections.length
          );
          curTeacher.openPeriods.splice(
            curTeacher.openPeriods.indexOf(
              assignableSections[sectionIndex].periodClass.period
            ),
            1
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
      let periodMissing = 4;
      if (teacher.openPeriods.includes(4)) {
        periodMissing = 5;
      }
      if (teacher.openPeriods.includes(5)) {
        periodMissing = 6;
      }
      console.log(teacher.name + " is missing a lunch period ❌🧁");
      console.log(teacher.openPeriods);
      totalErrors++;
    }
  }
  // console.log("Total errors: " + totalErrors);
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
        console.log(" Failure " + failCount + " encountered");
        // console.log("failure encountered");
        // console.log(failures);
      }
      if (failCount >= failCap) {
        teacherFailed = true;
        // Teachers haven't been assigned and we need to break out of the loop
        teachersAssigned = true;
        console.log("Failures Reached Failcap, restarting\n");
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
  // console.log("Schedule generated");
  const schedule = formattedSchedule(sectionArr);
  if (!eradicateDupeTeachers(schedule)) {
    return false;
  }
  return schedule;
};

// swappy mcswap methods
const eradicateDupeTeachers = function (schedule) {
  for (let i = 0; i < schedule.length; i++) {
    for (let j = 0; j < schedule[i].length; j++) {
      if (schedule[i][j] === null) {
        continue;
      }
      if (
        checkForTeacherInPeriod(schedule[i][j].teacher, i + 1, schedule) !== 1
      ) {
        const dupeTeacherSections = grabDupeTeachers(
          schedule[i][j].teacher,
          i + 1,
          schedule
        );
        if (!swapTeachers(dupeTeacherSections, i + 1, schedule)) {
          return false;
        }
      }
    }
  }
  return true;
};

const checkForTeacherInPeriod = function (teacher, period, schedule) {
  let teacherCount = 0;
  for (let i = 0; i < schedule[period - 1].length; i++) {
    if (schedule[period - 1][i] === null) {
      continue;
    }
    if (schedule[period - 1][i].teacher.name === teacher.name) {
      teacherCount++;
    }
  }
  return teacherCount;
};

const grabDupeTeachers = function (teacher, period, schedule) {
  const dupeTeacherSections = [];
  for (let i = 0; i < schedule[period - 1].length; i++) {
    if (schedule[period - 1][i] === null) {
      continue;
    }
    if (schedule[period - 1][i].teacher.name === teacher.name) {
      dupeTeacherSections.push(schedule[period - 1][i]);
    }
  }
  return dupeTeacherSections;
};

const swapTeachers = function (dupeTeacherSections, period, schedule) {
  /** Hint: use Copilot to do this
   * Priority: [# of section's periods avaliable] + [# of teacher's periods avaliable] */
  const swappable0 = [];
  const swappable1 = [];
  for (let i = 0; i < schedule.length; i++) {
    for (let j = 0; j < schedule[i].length; j++) {
      // Add to swappable 1
      if (
        !findLunches(dupeTeacherSections[0].teacher, schedule).includes(
          i + 1
        ) &&
        schedule[i][j] === null &&
        dupeTeacherSections[0].course.compatiblePeriods.includes(i + 1) &&
        dupeTeacherSections[0].course.compatibleClassrooms.includes(
          classroomList[j]
        ) &&
        checkForTeacherInPeriod(
          dupeTeacherSections[0].teacher,
          i + 1,
          schedule
        ) === 0
      ) {
        swappable0.push([i, j]);
      }

      // Add to swappable 1
      if (
        ![4, 5, 6].includes(i + 1) &&
        schedule[i][j] === null &&
        dupeTeacherSections[1].course.compatiblePeriods.includes(i + 1) &&
        dupeTeacherSections[1].course.compatibleClassrooms.includes(
          classroomList[j]
        ) &&
        checkForTeacherInPeriod(
          dupeTeacherSections[1].teacher,
          i + 1,
          schedule
        ) === 0
      ) {
        swappable1.push([i, j]);
      }
    }
  }

  if (swappable0.length === 0 && swappable1.length === 0) {
    console.log(
      dupeTeacherSections[0].teacher.name +
        " Period " +
        period +
        " is unswappable"
    );
    return false;
  }

  if (swappable0.length > swappable1.length) {
    const swappingCoord =
      swappable0[Math.floor(Math.random() * swappable0.length)];
    const temp = schedule[swappingCoord[0]][swappingCoord[1]];
    schedule[swappingCoord[0]][swappingCoord[1]] = dupeTeacherSections[0];
    schedule[dupeTeacherSections[0].periodClass.period - 1][
      classroomList.indexOf(dupeTeacherSections[0].periodClass.classroom)
    ] = temp;
  } else {
    const swappingCoord =
      swappable1[Math.floor(Math.random() * swappable1.length)];
    const temp = schedule[swappingCoord[0]][swappingCoord[1]];
    schedule[swappingCoord[0]][swappingCoord[1]] = dupeTeacherSections[1];
    schedule[dupeTeacherSections[1].periodClass.period - 1][
      classroomList.indexOf(dupeTeacherSections[1].periodClass.classroom)
    ] = temp;
  }
  return true;
};

const findLunches = function (teacher, schedule) {
  const lunches = [];
  for (let i = 4; i < 7; i++) {
    for (let j = 0; j < schedule[i].length; j++) {
      if (schedule[i][j] === null) {
        continue;
      }
      if (schedule[i][j].teacher.name === teacher.name) {
        lunches.push(i + 1);
      }
    }
  }
  return lunches;
};

// lag generator methods
const generateSchedules = function (numSchedules) {
  if (!checkForValidSections()) {
    console.log("nuh uh");
    return false;
  }
  const schedules = [];
  for (let k = 0; k < numSchedules; k++) {
    // console.log("Generating schedule " + k);
    const schedule = generateSchedule();
    if (schedule === false) {
      k--;
      continue;
    }
    schedules.push(schedule);
    console.log("Schedule " + k + " generated");
  }
  return schedules;
};

const writeSchedules = function (num, print) {
  const schedulesArr = generateSchedules(num);

  for (let a = 0; a < num; a++) {
    fs.writeFileSync(
      "./Sprint2/GeneratedSchedules/Schedule" + (a + 301) + ".json",
      JSON.stringify(schedulesArr[a])
    );
  }

  if (print) {
    for (let i = 0; i < schedulesArr.length; i++) {
      console.log("");
      console.log("");
      console.log("");
      console.log("Schedule " + (i + 1) + ":");
      printInCoolWay(schedulesArr[i]);
    }
  }
};

// if (checkForValidSections()) {
//   writeSchedules(200, true);
// } else {
//   console.log("Invalid number of sections to teachers");
// }

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
// I like cupcakes
// They are good"
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

//FIXME: Ensure the valid sections check works backwards and forwards. Currently iterates through sections, should also iterate through teachers.

const getSchedule = function () {
  const schedule = generateSchedules(1)[0];
  console.log(stringInCoolWay(schedule));
  return stringInCoolWay(schedule);
};

module.exports = getSchedule;
