const courseSelector = document.getElementById("coursePicker");
const courseNameSelector = document.getElementById("namer");
const courseSectionSelector = document.getElementById("sectionSelector");

let currentCourse;
let courseArr = document.getElementById("courseArr");

const onStart = function () {
  currentCourse = courseSelector.value;
  if (currentCourse === "addCourse") {
    return;
  }
  courseNameSelector.value = currentCourse;
};

courseSelector.addEventListener("change", () => {
  console.log("funny");
  if (courseSelector.value === "addCourse") {
  } else {
  }
});

onStart();
