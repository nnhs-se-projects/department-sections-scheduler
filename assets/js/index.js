/**
 * contains client-side JavaScript function
 *  (primarily event handlers to fetch data from the Node server)
 */

let schedule = [];
const generateButton = document.getElementById("genButton");
const textSpace = document.getElementById("textStuff");

textSpace.style.fontSize = "24px";
textSpace.innerHTML = "Click the button to generate a schedule";

generateButton.addEventListener("click", async () => {
  console.log("Generating Schedule...");
  textSpace.style.fontSize = "24px";
  textSpace.innerHTML = "Generating Schedule...";
  await fetch("/getSchedule", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) =>
    response.json().then((data) => {
      console.log(data);
      if (data === false) {
        alert(
          "No valid schedule found / able to be generated, recheck your data"
        );
        textSpace.style.fontSize = "24px";
        textSpace.innerHTML =
          "No valid schedule found / able to be generated, recheck your data";
        return;
      }
      schedule = data;
      updateText();
    })
  );
});

const updateText = function () {
  textSpace.style.fontSize = "10px";
  textSpace.innerHTML = schedule;
};
