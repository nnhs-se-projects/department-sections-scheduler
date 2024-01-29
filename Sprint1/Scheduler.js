let courses = require("./Courses.json");
let config = require("./Config.json");

let classroomArr = require("./Classrooms.json");
let classroomList = classroomArr.map((classroom) => classroom.roomNum);
let teacherArr = require("./Teachers.json");
let sectionArr = [];
let periodsClassArr = [];
let courseTeacherCount = [];
let visualSchedule = []; // 2d array of classrooms and periods

let initializeVisualSchedule = function () {
  for (i = 0; i < config.numPeriods; i++) {
    let tempArr = [];
    for (j = 0; j < classroomArr.length; j++) {
      tempArr.push(null);
    }
    visualSchedule.push(tempArr);
  }

  for (i = 0; i < config.numPeriods; i++) {
    for (j = 0; j < classroomArr; j++) {
      visualSchedule[i][j] = null; //<- NOT DONE; NEEDS FIXING
    }
  }
};

// i tried, but it may not work and may need debugging, this can at least serve as a skeleton
let printInCoolWay = function (theArray) {
  for (i = 0; i < theArray.length; i++) {
    println("[");
    for (j = 0; j < theArray[i].length; j++) {
      print(j + ", ");
    }
    print("]");
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
console.log(courseTeacherCount);

//sort the courseTeacherCount array by the number of teachers who can teach each course
const sortedCourseTeachersCount = Object.keys(courseTeacherCount).sort(
  (a, b) => courseTeacherCount[a] - courseTeacherCount[b]
);
sectionArr.sort(
  (a, b) =>
    sortedCourseTeachersCount.indexOf(a.course.name) -
    sortedCourseTeachersCount.indexOf(b.course.name)
);
//console.log(sortedCourseTeachersCount);

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
        console.log(
          "Assigning " +
            teacher.name +
            " to " +
            section.course.name +
            " section " +
            section.section +
            " in period " +
            section.periodClass.period
        );
        section.teacher = teacher;
        break;
      }
    }
  }
}
console.log(schedule);
for (let period of schedule) {
  for (let classroom of period) {
    if (classroom) {
      console.log(
        ` Course ${classroom.course.name} Period: ${classroom.periodClass.period} Classroom: ${classroom.periodClass.classroom} Teacher ${classroom.teacher.name} Section: ${classroom.section}`
      );
    }
  }
}

//create

//let temp schedule = the sections arr sorted by period then classroom
//we need to make a 2d array of classrooms and periods, and then print in in a readable and nice way

//print array (in super cool way)
//printInCoolWay(visualSchedule);
