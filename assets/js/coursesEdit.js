const courseSelector = document.getElementById("coursePicker");
const courseNameSelector = document.getElementById("namer");
const courseSectionSelector = document.getElementById("sectionSelector");
const coursePeriodsSelectors = [];

for (let i = 1; i <= 8; i++) {
  coursePeriodsSelectors.push(document.getElementById(i));
}

let currentCourse;
let courseArr = fetch('/endpoint', {
  method: "GET",''
})

const onStart = function () {
  currentCourse = courseSelector.value;
  if (currentCourse === "addCourse") {
    return;
  }
  courseNameSelector.value = currentCourse;
  console.log(typeof courseArr[0]);
  for (let i = 0; 1 < 8; i++) {
    coursePeriodsSelectors[i] = courseArr.filter(
      (course) => course.name === currentCourse
    )[0].compatiblePeriods;
  }
};

courseSelector.addEventListener("change", () => {
  currentCourse = courseSelector.value;
  if (courseSelector.value === "addCourse") {
    // pass
  } else {
    courseNameSelector.value = currentCourse;
  }
});

onStart();
