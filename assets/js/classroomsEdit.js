const roomSelector = document.getElementById("classroomPicker");
const roomNameSelector = document.getElementById("namer");

const saveButton = document.getElementById("saveButton");
const deleteButton = document.getElementById("deleteButton");

let currentRoomName;
let currentRoom;
let classroomsArr;
let courseArr;

let periodsSelectors = [];

for (let i = 1; i <= 8; i++) {
  periodsSelectors.push(document.getElementById("Period " + i));
}

const onStart = async function () {
  // Get courses.json & classrooms.json from server
  await fetch("/fetchEditClassrooms", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) =>
    response.json().then((data) => {
      console.log(data);
      classroomsArr = data[0];
      courseArr = data[1];
      currentRoomName = roomSelector.value;
      if (currentRoomName === "addRoom") {
        currentRoom = null;
      } else {
        currentRoom = classroomsArr.filter(
          (room) => room.roomNum === currentRoomName
        )[0];
      }

      roomNameSelector.value = currentRoomName;
      updateFields();
    })
  );
};

const updatePeriodsSelector = function () {
  periodsSelectors = periodsSelectors.map((data) => {
    data.checked = currentRoom.periodsAvailable.includes(
      Number(data.id.slice(7))
    );
    return data;
  });
};

const updateFields = function () {
  currentRoomName = roomSelector.value;
  if (currentRoomName === "addRoom") {
    deleteButton.setAttribute("class", "hiddenButton"); // Hide delete button
    currentRoom = null;
    roomNameSelector.value = "New Room";

    // Resets values for Add Room
    for (let i = 0; i < 8; i++) {
      periodsSelectors[i].checked = true;
    }
  } else {
    deleteButton.setAttribute("class", ""); // Show Delete Button

    // Update for everything other than Add Room
    currentRoom = classroomsArr.filter(
      (room) => room.roomNum === currentRoomName
    )[0];
    roomNameSelector.value = currentRoomName;
    updatePeriodsSelector();
  }
};

roomSelector.addEventListener("change", () => updateFields());

const verifyFields = function () {
  // Verify Room Name
  if (roomNameSelector.value in ["", undefined, null]) {
    alert("The room must be given a number/name!");
    return false;
  } else if (
    currentRoom == null &&
    roomNameSelector.value in classroomsArr.map((data) => data.roomNum)
  ) {
    alert("A course already exists with this name!");
    return false;
  } else if (
    currentRoom != null &&
    roomNameSelector !== currentRoomName &&
    roomNameSelector.value in classroomsArr.map((data) => data.roomNum)
  ) {
    alert("A course already exists with this name!");
    return false;
  } else if (
    roomNameSelector.value === "addRoom" ||
    roomNameSelector.value === "Add Room" ||
    roomNameSelector.value === "add room" ||
    roomNameSelector.value === "add Room" ||
    roomNameSelector.value === "Add room"
  ) {
    alert(
      "Why would you name a room '" +
        roomNameSelector.value +
        "' that's stupid and I know you're just trying to break our code have some respect for your developers please"
    );
    return false;
  }

  return true;
};

const createJSON = function (saveCase) {
  const modifiedRoomArr = classroomsArr.map((data) => data);

  switch (saveCase) {
    // Add the current course to the array
    case SaveCase.Save:
      if (currentRoom == null) {
        modifiedRoomArr.push({
          roomNum: roomNameSelector.value,
          periodsAvailable: periodsSelectors
            .filter((data) => data.checked)
            .map((data) => Number(data.id.slice(7))),
        });
      } else {
        modifiedRoomArr[modifiedRoomArr.indexOf(currentRoom)] = {
          roomNum: roomNameSelector.value,
          periodsAvailable: periodsSelectors
            .filter((data) => data.checked)
            .map((data) => Number(data.id.slice(7))),
        };
      }
      console.log(modifiedRoomArr);
      return modifiedRoomArr;

    // Remove the current course from the array
    case SaveCase.Delete:
      modifiedRoomArr.splice(modifiedRoomArr.indexOf(currentRoom), 1);
      console.log(modifiedRoomArr);
      return modifiedRoomArr;
  }
};

const saveToServer = async function (arr, saveData) {
  let response;
  switch (saveData) {
    case SaveData.Courses:
      response = await fetch("/updateCourses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arr),
      });
      break;
    case SaveData.Classrooms:
      response = await fetch("/updateClassrooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(arr),
      });

      if (response.ok) {
        window.location = "/classroomsEdit";
      } else {
        console.log("error creating entry");
      }
      break;
  }
};

saveButton.addEventListener("click", () => {
  if (
    verifyFields() &&
    confirm(
      "Are you sure you would like to save these changes? This cannot be undone."
    ) &&
    ensureSaveDependencies()
  ) {
    saveToServer(createJSON(SaveCase.Save), SaveData.Classrooms);
  }
});

deleteButton.addEventListener("click", () => {
  if (currentRoom == null) {
    alert("how");
  } else if (
    confirm(
      "Are you sure you would like to delete this room? This cannot be undone."
    ) &&
    ensureDeleteDependencies()
  ) {
    saveToServer(createJSON(SaveCase.Delete), SaveData.Classrooms);
  }
});

const ensureSaveDependencies = function () {
  if (currentRoom != null && currentRoomName !== roomNameSelector.value) {
    const dependentCourses = courseArr.filter((course) =>
      course.compatibleClassrooms.includes(currentRoomName)
    );
    let dependentCoursesNameString = "";
    for (let i = 0; i < dependentCourses.length; i++) {
      dependentCoursesNameString += dependentCourses[i].name + ", ";
    }
    dependentCoursesNameString = dependentCoursesNameString.slice(0, -2);
    if (dependentCourses.length > 0) {
      const confirmation = confirm(
        "This room is currently in use by " +
          dependentCoursesNameString +
          ". Are you sure you would like to rename this room?."
      );
      if (confirmation) {
        dependentCourses.forEach((course) => {
          course.compatibleClassrooms.splice(
            course.compatibleClassrooms.indexOf(currentRoomName),
            1,
            roomNameSelector.value
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

const ensureDeleteDependencies = function () {
  const dependentCourses = courseArr.filter((course) =>
    course.compatibleClassrooms.includes(currentRoomName)
  );
  let dependentCoursesNameString = "";
  for (let i = 0; i < dependentCourses.length; i++) {
    dependentCoursesNameString += dependentCourses[i].name + ", ";
  }
  dependentCoursesNameString = dependentCoursesNameString.slice(0, -2);
  if (dependentCourses.length > 0) {
    const confirmation = confirm(
      "This room is currently in use by " +
        dependentCoursesNameString +
        ". Would you like to remove this course?."
    );
    if (confirmation) {
      dependentCourses.forEach((course) => {
        course.compatibleClassrooms.splice(
          course.compatibleClassrooms.indexOf(currentRoomName),
          1
        );
      });
      saveToServer(courseArr, SaveData.Courses);
      return true;
    }
    return false;
  }
  return true;
};

const SaveCase = {
  Save: Symbol("save"),
  Delete: Symbol("delete"),
};

const SaveData = {
  Courses: Symbol("courses"),
  Classrooms: Symbol("classrooms"),
};

onStart();

//FIXME: Sort the rooms by room number/name
//FIXME: name check code not working
