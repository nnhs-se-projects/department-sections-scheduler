const teacherSelector = document.getElementById("teacherPicker");
const teacherNameSelector = document.getElementById("namer");

const saveButton = document.getElementById("saveButton");
const deleteButton = document.getElementById("deleteButton");
let unsaved = true;

let currentTeacherName;
let currentTeacher;
let courseArr;
let teacherArr;

const sectionInputs = [];
let courseHolders = document.getElementsByClassName("courseHolder");
courseHolders = [].slice.call(courseHolders);

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
        sectionInputs.push(document.getElementById("input" + i));
      }
      for (let i = 0; i < sectionInputs.length; i++) {
        sectionInputs[i].value = 0;
      }
      for (let i = 0; i < courseHolders.length; i++) {
        courseHolders[i].checked = false;
        document.getElementById("course" + i).setAttribute("class", "hidden");
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
    if (
      currentTeacher.coursesAssigned
        .map((data) => data.course)
        .includes(courseArr[i].name)
    ) {
      sectionInputs[i].value = currentTeacher.coursesAssigned.filter(
        (data) => data.course === courseArr[i].name
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

const verifyFields = function () {
  // Verify Teacher Name
  if (["", undefined, null].includes(teacherNameSelector.value)) {
    alert("The teacher must be given a name!");
    return false;
  } else if (
    currentTeacher == null &&
    teacherArr.map((data) => data.name).includes(teacherNameSelector.value)
  ) {
    alert("A teacher already exists with this name!");
    return false;
  } else if (
    currentTeacher != null &&
    teacherNameSelector.value !== currentTeacherName &&
    teacherArr.map((data) => data.name).includes(teacherNameSelector.value)
  ) {
    alert("A teacher already exists with this name!");
    return false;
  } else if (
    teacherNameSelector.value === "addTeacher" ||
    teacherNameSelector.value === "Add Teacher" ||
    teacherNameSelector.value === "add teacher" ||
    teacherNameSelector.value === "add Teacher" ||
    teacherNameSelector.value === "Add teacher"
  ) {
    alert(
      "Why would you name a teacher '" +
        teacherNameSelector.value +
        "' that's stupid and I know you're just trying to break our code have some respect for your developers please"
    );
    return false;
  }

  // Verify Sections
  for (let i = 0; i < sectionInputs.length; i++) {
    if (sectionInputs[i].value < 0.0) {
      alert("Number of sections cannot be negative!");
      return false;
    } else if (sectionInputs[i].value % 1.0 !== 0.0) {
      alert("Number of sections must be an integer!");
      return false;
    }
  }

  return true;
};

const createJSON = function (saveCase) {
  const modifiedTeacherArr = teacherArr.map((data) => data);

  switch (saveCase) {
    // Add the current teacher to the array
    case SaveCase.Save:
      if (currentTeacher == null) {
        let sectionsTaught = 0;
        const coursesAssigned = [];
        for (let i = 0; i < courseHolders.length; i++) {
          if (courseHolders[i].checked) {
            coursesAssigned.push({
              course: courseHolders[i].id.slice(7),
              sections: Number(sectionInputs[i].value),
            });
            sectionsTaught += Number(sectionInputs[i].value);
          }
        }
        modifiedTeacherArr.push({
          name: teacherNameSelector.value,
          coursesAssigned,
          sectionsTaught,
          openPeriods: [1, 2, 3, 4, 5, 6, 7, 8],
        });
      } else {
        let sectionsTaught = 0;
        const coursesAssigned = [];
        for (let i = 0; i < courseHolders.length; i++) {
          if (courseHolders[i].checked) {
            coursesAssigned.push({
              course: courseHolders[i].id.slice(7),
              sections: Number(sectionInputs[i].value),
            });
            sectionsTaught += Number(sectionInputs[i].value);
          }
        }
        modifiedTeacherArr[modifiedTeacherArr.indexOf(currentTeacher)] = {
          name: teacherNameSelector.value,
          coursesAssigned,
          sectionsTaught,
          openPeriods: [1, 2, 3, 4, 5, 6, 7, 8],
        };
      }
      console.log(modifiedTeacherArr);
      return modifiedTeacherArr;

    // Remove the current teacher from the array
    case SaveCase.Delete:
      modifiedTeacherArr.splice(modifiedTeacherArr.indexOf(currentTeacher), 1);
      console.log(modifiedTeacherArr);
      return modifiedTeacherArr;
  }
};

const saveToServer = async function (arr) {
  const response = await fetch("/updateTeachers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arr),
  });

  if (response.ok) {
    window.location = "/teachersEdit";
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
  if (currentTeacher == null) {
    alert("how");
  } else if (
    confirm(
      "Are you sure you would like to delete this teacher? This cannot be undone."
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
