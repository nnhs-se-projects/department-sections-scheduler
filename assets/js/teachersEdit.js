const teacherSelector = document.getElementById("teacherPicker");
const teacherNameSelector = document.getElementById("namer");

const saveButton = document.getElementById("saveButton");
const deleteButton = document.getElementById("deleteButton");
let unsaved = true;

let currentTeacherName;
let currentTeacher;
let courseArr;
let teacherArr;

let sectionInputs = [];
let courseHolders = document.getElementsByClassName("courseHolder");

const onStart = async function () {
  // Get courses.json & teachers.json from server
  await fetch("/fetchEditTeachers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) =>
    response.json().then((data) => {
      console.log(data);
      teacherArr = data[0];
      courseArr = data[1];
      for (let i = 0; i < courseArr.length; i++) {
        sectionInputs.push(document.getElementById("course" + i));
      }
      currentTeacherName = teacherSelector.value;
      if (currentTeacherName === "addTeacher") {
        currentTeacher = null;
      } else {
        currentTeacher = teacherArr.filter(
          (teacher) => teacher.name === currentTeacherName
        )[0];
      }

      teacherNameSelector.value = currentTeacherName;

      updateFields();
    })
  );
};

const updateCourseHolders = function () {
  courseHolders = courseHolders.map((data) => {
    data.checked = currentTeacher.coursesAssigned
      .map((data) => data.course)
      .includes(data.id.slice(7));
    return data;
  });
  for (let i = 0; i < courseHolders.length; i++) {
    if (courseHolders[i].checked) {
      document.getElementById("course" + i).setAttribute("class", "");
    } else {
      document.getElementById("course" + i).setAttribute("class", "hidden");
    }
  }
};

const updateSectionInputs = function () {
  for (let i = 0; i < sectionInputs.length; i++) {
    sectionInputs[i].value = currentTeacher.coursesAssigned;
    if (
      currentTeacher.coursesAssigned
        .map((data) => data.course)
        .includes(courseArr[i])
    ) {
      sectionInputs[i].value = currentTeacher.coursesAssigned.filter(
        (data) => data.course === courseArr[i]
      )[0].sections;
    }
  }
};

for (let i = 0; i < courseHolders.length; i++) {
  courseHolders[i].addEventListener("change", () => {
    if (courseHolders[i].checked) {
      document.getElementById("course" + i).setAttribute("class", "");
    } else {
      document.getElementById("course" + i).setAttribute("class", "hidden");
    }
  });
}

const updateFields = function () {
  currentTeacherName = teacherSelector.value;
  if (currentTeacherName === "addTeacher") {
    deleteButton.setAttribute("class", "hiddenButton"); // Hide delete button
    currentTeacher = null;
    teacherNameSelector.value = "New Teacher";

    // Resets values for Add Course
    for (let i = 0; i < sectionInputs.length; i++) {
      sectionInputs[i].value = 0;
    }
    for (let i = 0; i < courseHolders.length; i++) {
      courseHolders[i].checked = false;
      document.getElementById("course" + i).setAttribute("class", "hidden");
    }
  } else {
    deleteButton.setAttribute("class", ""); // Show Delete Button
    // Update for everything other than Add Course
    currentTeacher = teacherArr.filter(
      (teacher) => teacher.name === currentTeacherName
    )[0];
    teacherNameSelector.value = currentTeacherName;
    updateCourseHolders();
    updateSectionInputs();
  }
};

teacherSelector.addEventListener("change", () => updateFields());

//FIXED UP TO HERE

const verifyFields = function () {
  // Verify Teacher Name
  if (["", undefined, null].includes(courseNameSelector.value)) {
    alert("The course must be given a name!");
    return false;
  } else if (
    currentCourse == null &&
    courseArr.map((data) => data.name).includes(courseNameSelector.value)
  ) {
    alert("A course already exists with this name!");
    return false;
  } else if (
    currentCourse != null &&
    courseNameSelector.value !== currentCourseName &&
    courseArr.map((data) => data.name).includes(courseNameSelector.value)
  ) {
    alert("A course already exists with this name!");
    return false;
  } else if (
    courseNameSelector.value === "addCourse" ||
    courseNameSelector.value === "Add Course" ||
    courseNameSelector.value === "add course" ||
    courseNameSelector.value === "add Course" ||
    courseNameSelector.value === "Add course"
  ) {
    alert(
      "Why would you name a course '" +
        courseNameSelector.value +
        "' that's stupid and I know you're just trying to break our code have some respect for your developers please"
    );
    return false;
  }

  // Verify Sections
  if (courseSectionSelector.value < 0.0) {
    alert("Number of sections cannot be negative!");
    return false;
  } else if (courseSectionSelector.value % 1.0 !== 0.0) {
    alert("Number of sections must be an integer!");
    return false;
  }

  // Verify Priority Override
  if (
    coursePriorityToggle.checked &&
    (coursePrioritySelector.value < 0.0 || coursePrioritySelector.value > 1.0)
  ) {
    alert("Course priority must be within 0.0 - 1.0");
    return false;
  }

  return true;
};

const createJSON = function (saveCase) {
  const modifiedCourseArr = courseArr.map((data) => data);

  switch (saveCase) {
    // Add the current course to the array
    case SaveCase.Save:
      if (currentCourse == null) {
        modifiedCourseArr.push({
          name: courseNameSelector.value,
          sections: Number(courseSectionSelector.value),
          compatibleClassrooms: classroomSelectors
            .filter((data) => data.checked)
            .map((data) => data.id.slice(2)),
          compatiblePeriods: coursePeriodsSelectors
            .filter((data) => data.checked)
            .map((data) => Number(data.id.slice(7))),
          userPriority: coursePriorityToggle.checked
            ? Number(coursePrioritySelector.value)
            : undefined,
        });
      } else {
        modifiedCourseArr[modifiedCourseArr.indexOf(currentCourse)] = {
          name: courseNameSelector.value,
          sections: Number(courseSectionSelector.value),
          compatibleClassrooms: classroomSelectors
            .filter((data) => data.checked)
            .map((data) => data.id.slice(2)),
          compatiblePeriods: coursePeriodsSelectors
            .filter((data) => data.checked)
            .map((data) => Number(data.id.slice(7))),
          userPriority: coursePriorityToggle.checked
            ? Number(coursePrioritySelector.value)
            : undefined,
        };
      }

      console.log(modifiedCourseArr);
      return modifiedCourseArr;

    // Remove the current course from the array
    case SaveCase.Delete:
      modifiedCourseArr.splice(modifiedCourseArr.indexOf(currentCourse), 1);
      console.log(modifiedCourseArr);
      return modifiedCourseArr;
  }
};

const saveToServer = async function (arr) {
  const response = await fetch("/updateCourses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arr),
  });

  if (response.ok) {
    window.location = "/coursesEdit";
  } else {
    console.log("error creating entry");
  }
};

saveButton.addEventListener("click", () => {
  if (
    verifyFields() &&
    confirm(
      "Are you sure you would like to save these changes? This cannot be undone."
    )
  ) {
    unsaved = false;
    saveToServer(createJSON(SaveCase.Save));
  }
});

deleteButton.addEventListener("click", () => {
  if (currentCourse == null) {
    alert("how");
  } else if (
    confirm(
      "Are you sure you would like to delete this course? This cannot be undone."
    )
  ) {
    saveToServer(createJSON(SaveCase.Delete));
  }
});

const SaveCase = {
  Save: Symbol("save"),
  Delete: Symbol("delete"),
};

window.addEventListener("beforeunload", (event) => {
  if (unsaved) {
    event.returnValue = `Are you sure you want to leave?`;
  }
});

onStart();

//FIXME: Need to ensure that courses with dependencies of rooms that no longer exist have those rooms removed
//FIXME: Sort the rooms by room number/name
//ADDME: Some type of indication that there are saved/unsaved changes?
