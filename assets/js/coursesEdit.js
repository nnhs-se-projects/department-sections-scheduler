const courseSelector = document.getElementById("coursePicker");
const courseNameSelector = document.getElementById("namer");
const courseSectionSelector = document.getElementById("sectionSelector");
const coursePeriodsSelectors = [];

for (let i = 1; i <= 8; i++) {
  coursePeriodsSelectors.push(document.getElementById(i));
}

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
      currentCourse = courseSelector.value;
      if (currentCourse === "addCourse") {
        return;
      }
      courseNameSelector.value = currentCourse;
      for (let i = 0; i < 8; i++) {
        coursePeriodsSelectors[i] = data
          .filter((course) => course.name === currentCourse)[0]
          .compatiblePeriods.includes(i.toString());
      }
    })
  );
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
