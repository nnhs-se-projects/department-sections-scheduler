const courseSelector = document.getElementById("coursePicker");
const courseNameSelector = document.getElementById("namer");
const courseSectionSelector = document.getElementById("sectionSelector");
const coursePrioritySelector = document.getElementById("prioritySelector");
const coursePriorityToggle = document.getElementById("priorityOverrideEnabler");

let currentCourseName;
let currentCourse;
let courseArr;
let classroomsArr;

let coursePeriodsSelectors = [];

for (let i = 1; i <= 8; i++) {
  coursePeriodsSelectors.push(document.getElementById("Period " + i));
}

let classroomSelectors = [];

const onStart = async function () {
  // Get courses.json & classrooms.json from server
  await fetch("/fetchEditCourses", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) =>
    response.json().then((data) => {
      console.log(data);
      courseArr = data[0];
      classroomsArr = data[1];
      for (const classroom of classroomsArr) {
        classroomSelectors.push(
          document.getElementById("C " + classroom.roomNum)
        );
      }
      currentCourseName = courseSelector.value;
      currentCourse = courseArr.filter(
        (course) => course.name === currentCourseName
      )[0];

      courseNameSelector.value = currentCourseName;
      updateFields();
    })
  );
};

const updateCoursePeriodsSelector = function () {
  coursePeriodsSelectors = coursePeriodsSelectors.map((data) => {
    data.checked = currentCourse.compatiblePeriods.includes(
      Number(data.id.slice(7, 8))
    );
    return data;
  });
};

const updateClassroomsSelectors = function () {
  classroomSelectors = classroomSelectors.map((data) => {
    data.checked = currentCourse.compatibleClassrooms.includes(
      String(data.id.slice(2))
    );
    return data;
  });
};

const updateCourseSectionSelector = function () {
  courseSectionSelector.value = currentCourse.sections;
};

const updateCoursePrioritySelector = function () {
  if (currentCourse.userPriority === undefined) {
    coursePriorityToggle.checked = false;
    document
      .getElementById("sectionSelectorDiv")
      .setAttribute("class", "hidden");
  } else {
    coursePriorityToggle.checked = true;
    document.getElementById("sectionSelectorDiv").setAttribute("class", "");
    coursePrioritySelector.value = currentCourse.userPriority;
  }
};

coursePriorityToggle.addEventListener("change", () => {
  if (coursePriorityToggle.checked) {
    document.getElementById("sectionSelectorDiv").setAttribute("class", "");
  } else {
    document
      .getElementById("sectionSelectorDiv")
      .setAttribute("class", "hidden");
  }
});

const updateFields = function () {
  currentCourseName = courseSelector.value;
  if (courseSelector.value === "addCourse") {
    currentCourse = null;
    courseNameSelector.value = "New Course";
    for (let i = 0; i < 8; i++) {
      coursePeriodsSelectors[i].checked = true;
    }
    for (let i = 0; i < classroomSelectors.length; i++) {
      classroomSelectors[i].checked = false;
    }
    courseSectionSelector.value = 0;
  } else {
    currentCourse = courseArr.filter(
      (course) => course.name === currentCourseName
    )[0];
    courseNameSelector.value = currentCourseName;
    updateCoursePeriodsSelector();
    updateCourseSectionSelector();
    updateCoursePrioritySelector();
    updateClassroomsSelectors();
  }
};

courseSelector.addEventListener("change", () => updateFields());

//FIXME: we need to add a check to see if the course name is already in the database
//FIXME: add a save button
//FIXME: require all classrooms

onStart();
