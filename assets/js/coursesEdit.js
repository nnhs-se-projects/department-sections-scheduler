const courseSelector = document.getElementById("coursePicker");
const courseNameSelector = document.getElementById("namer");
const courseSectionSelector = document.getElementById("sectionSelector");
const coursePeriodsSelectors = [];

for (let i = 1; i <= 8; i++) {
  coursePeriodsSelectors.push(document.getElementById("Period " + i));
}

let currentCourseName;
let currentCourse;
let courseArr;

const onStart = async function () {
  // Get courses.json from server
  await fetch("/fetchCourses", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) =>
    response.json().then((data) => {
      console.log(data);
      courseArr = data;
      currentCourseName = courseSelector.value;
      currentCourse = courseArr.filter(
        (course) => course.name === currentCourseName
      )[0];

      if (currentCourseName === "addCourse") {
        return;
      }

      courseNameSelector.value = currentCourseName;
      updateCoursePeriodsSelector();
      updateCourseSectionSelector();
    })
  );
};

const updateCoursePeriodsSelector = function () {
  for (let i = 0; i < 8; i++) {
    coursePeriodsSelectors[i].checked =
      currentCourse.compatiblePeriods.includes(i + 1);
  }
};

const updateCourseSectionSelector = function () {
  courseSectionSelector.value = currentCourse.sections;
};

courseSelector.addEventListener("change", () => {
  currentCourseName = courseSelector.value;
  currentCourse = courseArr.filter(
    (course) => course.name === currentCourseName
  )[0];
  if (courseSelector.value === "addCourse") {
    courseNameSelector.value = "New Course";
    for (let i = 0; i < 8; i++) {
      coursePeriodsSelectors[i].checked = true;
    }
    courseSectionSelector.value = 0;
  } else {
    courseNameSelector.value = currentCourseName;
    updateCoursePeriodsSelector();
    updateCourseSectionSelector();
  }
});

onStart();
