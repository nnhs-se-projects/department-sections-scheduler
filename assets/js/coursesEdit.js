const courseSelector = document.getElementById("coursePicker");
const courseNameSelector = document.getElementById("namer");
const courseSectionSelector = document.getElementById("sectionSelector");
const coursePrioritySelector = document.getElementById("prioritySelector");
const coursePriorityToggle = document.getElementById("priorityOverrideEnabler");

const saveButton = document.getElementById("saveButton");
const deleteButton = document.getElementById("deleteButton");
let unsaved = true;

let currentCourseName;
let currentCourse;
let courseArr;
let classroomsArr;
let teacherArr;

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
      teacherArr = data[2];
      for (const classroom of classroomsArr) {
        classroomSelectors.push(
          document.getElementById("C " + classroom.roomNum)
        );
      }
      currentCourseName = courseSelector.value;
      if (currentCourseName === "addCourse") {
        currentCourse = null;
      } else {
        currentCourse = courseArr.filter(
          (course) => course.name === currentCourseName
        )[0];
      }

      courseNameSelector.value = currentCourseName;
      updateFields();
    })
  );
};

const updateCoursePeriodsSelector = function () {
  coursePeriodsSelectors = coursePeriodsSelectors.map((data) => {
    data.checked = currentCourse.compatiblePeriods.includes(
      Number(data.id.slice(7))
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
      .getElementById("prioritySelectorDiv")
      .setAttribute("class", "hidden");
    coursePrioritySelector.value = 0.5;
  } else {
    coursePriorityToggle.checked = true;
    document.getElementById("prioritySelectorDiv").setAttribute("class", "");
    coursePrioritySelector.value = currentCourse.userPriority;
  }
};

coursePriorityToggle.addEventListener("change", () => {
  if (coursePriorityToggle.checked) {
    document.getElementById("prioritySelectorDiv").setAttribute("class", "");
  } else {
    document
      .getElementById("prioritySelectorDiv")
      .setAttribute("class", "hidden");
  }
});

const updateFields = function () {
  currentCourseName = courseSelector.value;
  if (currentCourseName === "addCourse") {
    deleteButton.setAttribute("class", "hiddenButton"); // Hide delete button
    currentCourse = null;
    courseNameSelector.value = "New Course";

    // Resets values for Add Course
    for (let i = 0; i < 8; i++) {
      coursePeriodsSelectors[i].checked = true;
    }
    for (let i = 0; i < classroomSelectors.length; i++) {
      classroomSelectors[i].checked = false;
    }
    courseSectionSelector.value = 0;
    coursePrioritySelector.value = 0.5;
    coursePriorityToggle.checked = false;
    document
      .getElementById("prioritySelectorDiv")
      .setAttribute("class", "hidden");
  } else {
    deleteButton.setAttribute("class", ""); // Show Delete Button

    // Update for everything other than Add Course
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

const verifyFields = function () {
  // Verify Course Name
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

const saveToServer = async function (arr, saveData) {
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

const SaveData = {
  Courses: Symbol("courses"),
  Teachers: Symbol("teachers"),
};

window.addEventListener("beforeunload", (event) => {
  if (unsaved) {
    event.returnValue = `Are you sure you want to leave?`;
  }
});

const ensureSaveDependencies = function () {
  if (currentCourse != null && currentCourseName !== courseNameSelector.value) {
    const dependentTeachers = teacherArr.filter((teacher) =>
      teacher.coursesAssigned
        .map((data) => data.course)
        .includes(currentCourseName)
    );
    let dependentTeachersNameString = "";
    for (let i = 0; i < dependentTeachers.length; i++) {
      dependentTeachersNameString += dependentTeachers[i].name + ", ";
    }
    dependentTeachersNameString = dependentTeachersNameString.slice(0, -2);
    if (dependentTeachers.length > 0) {
      const confirmation = confirm(
        "This course is currently in use by " +
          dependentTeachersNameString +
          ". Are you sure you would like to rename this course?."
      );
      if (confirmation) {
        dependentTeachers.forEach((teacher) => {
          teacher.coursesAssigned.splice(
            teacher.coursesAssigned
              .map((data) => data.course)
              .indexOf(currentCourseName),
            1,
            {
              course: courseNameSelector.value,
              sections: teacher.coursesAssigned
                .map((data) => data.course)
                .indexOf(currentCourseName).sections,
            }
          );
        });
        saveToServer(courseArr, SaveData.Courses);
        return true;
      }
      return false;
    }
  }
  return true;
};

onStart();

//FIXME: Need to ensure that courses with dependencies of rooms that no longer exist have those rooms removed
//FIXME: Sort the rooms by room number/name
//ADDME: Some type of indication that there are saved/unsaved changes?
