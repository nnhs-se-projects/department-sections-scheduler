const roomSelector = document.getElementById("classroomPicker");
const roomNameSelector = document.getElementById("namer");

const saveButton = document.getElementById("saveButton");
const deleteButton = document.getElementById("deleteButton");

let currentRoomName;
let currentRoom;
let classroomsArr;

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
      classroomsArr = data;
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

const saveToServer = async function (arr) {
  const response = await fetch("/updateClassrooms", {
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
};

saveButton.addEventListener("click", () => {
  if (
    verifyFields() &&
    confirm(
      "Are you sure you would like to save these changes? This cannot be undone."
    )
  ) {
    saveToServer(createJSON(SaveCase.Save));
  }
});

deleteButton.addEventListener("click", () => {
  if (currentRoom == null) {
    alert("how");
  } else if (
    confirm(
      "Are you sure you would like to delete this room? This cannot be undone."
    )
  ) {
    saveToServer(createJSON(SaveCase.Delete));
  }
});

const SaveCase = {
  Save: Symbol("save"),
  Delete: Symbol("delete"),
};

onStart();

//FIXME: Need to ensure that courses with dependencies of rooms that no longer exist have those rooms removed
//FIXME: Re-read the code and ensure no errors
