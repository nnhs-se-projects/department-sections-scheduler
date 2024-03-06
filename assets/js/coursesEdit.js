const courseSelector = document.getElementById("coursePicker");
const courseNameSelector = document.getElementById("namer");
const courseSectionSelector = document.getElementById("sectionSelector");
const coursePrioritySelector = document.getElementById("prioritySelector");
const coursePriorityToggle = document.getElementById("priorityOverrideEnabler");

let coursePeriodsSelectors = [];

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

  // for (let i = 0; i < 8; i++) {
  //   coursePeriodsSelectors[i].checked =
  //     currentCourse.compatiblePeriods.includes(i + 1);
  // }
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
    courseSectionSelector.value = 0;
  } else {
    currentCourse = courseArr.filter(
      (course) => course.name === currentCourseName
    )[0];
    courseNameSelector.value = currentCourseName;
    updateCoursePeriodsSelector();
    updateCourseSectionSelector();
    updateCoursePrioritySelector();
  }
};

courseSelector.addEventListener("change", () => updateFields());

//FIXME: we need to add a check to see if the course name is already in the database
//FIXME: add a save button
//FIXME: require all classrooms

onStart();
