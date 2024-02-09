const courses = require("./Courses.json");
const config = require("./Config.json");

const classroomArr = require("./Classrooms.json");
const classroomList = classroomArr.map((classroom) => classroom.roomNum);
const teacherArr = require("./Teachers.json");

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

let makeSchedule = function () {
  let sectionArr = [];
  let periodsClassArr = [];
  let courseTeacherCount = [];
  let updateSections = function (arr) {
    arr.sort(
      (a, b) => a.course.schedulingPriority - b.course.schedulingPriority
    );
    return arr;
  };
  //clear array
  while (sectionArr.length > 0) {
    sectionArr.pop();
  }

  for (let course of courses) {
    for (i = 0; i < course.sections; i++) {
      sectionArr.push({
        course: course,
        section: i + 1,
        periodClass: null,
      });
    }
  }
  updateSections(sectionArr);
  for (let classroom of classroomArr) {
    for (let period of classroom.periodsAvailable) {
      periodsClassArr.push({
        classroom: classroom.roomNum,
        period: period,
      });
    }
  }
  for (let section of sectionArr) {
    let assignableRooms = periodsClassArr.filter((perClass) =>
      section.course.compatibleClassrooms.includes(perClass.classroom)
    ); // FIXME: This is not working !!! Filter query not correct
    if (assignableRooms.length == 0) {
      //console.log(
      //   "No more valid period-classrooms available to assign to " +
      //    section.course.name +
      //    " section " +
      //    section.section
      //);
    } else {
      section.periodClass = periodsClassArr.splice(
        periodsClassArr.indexOf(
          assignableRooms[Math.floor(Math.random() * assignableRooms.length)]
        ),
        1
      )[0];
    }
  }
  //create 2d array
  let schedule = [];
  for (let i = 0; i < config.numPeriods; i++) {
    schedule.push([]);
    for (let j = 0; j < classroomArr.length; j++) {
      schedule[i].push(null);
    }
  }
  //assign teachers
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
  //sort the courseTeacherCount array by the number of teachers who can teach each course
  const sortedCourseTeachersCount = Object.keys(courseTeacherCount).sort(
    (a, b) => courseTeacherCount[a] - courseTeacherCount[b]
  );
  //assign teachers to sections

  for (let section of sectionArr) {
    for (let teacher of teacherArr) {
      console.log(`${section.course.name}`);
      console.log(teacher.certifiedCourses);
      if (
        teacher.certifiedCourses.find(
          (element) => element.course == section.course.name
        )
      ) {
        //check if teacher has the open periods

        if (teacher.openPeriods.includes(section.periodClass.period)) {
          teacher.openPeriods.splice(
            teacher.openPeriods.indexOf(section.periodClass.period),
            1
          );
          // console.log(
          //   "Assigning " +
          //     teacher.name +
          //     " to " +
          //     section.course.name +
          //     " section " +
          //     section.section +
          //     " in period " +
          //     section.periodClass.period
          // );
          section.teacher = teacher;
          break;
        }
      }
    }
  }
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

printInCoolWay(makeSchedule());
