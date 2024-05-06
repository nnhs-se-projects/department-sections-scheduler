/**
 * contains client-side JavaScript function
 *  (primarily event handlers to fetch data from the Node server)
 */

let schedule = [];
const generateButton = document.getElementById("genButton");
const textField = document.getElementById("textStuff");

generateButton.addEventListener("click", async () => {
  await fetch("/getSchedule", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) =>
    response.json().then((data) => {
      console.log(data);
      if (data === false) {
        alert("No valid schedule found");
        return;
      }
      schedule = data;
      updateText();
    })
  );
});

const updateText = function () {
  textField.innerHTML = "";
  for (let i = 0; i < schedule.length; i++) {
    textField.innerHTML += schedule[i] + "<br>";
  }
};
