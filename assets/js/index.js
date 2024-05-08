/**
 * contains client-side JavaScript function
 *  (primarily event handlers to fetch data from the Node server)
 */

let schedule = [];
let csv = null;
let encodedURI = null;
const downloadButton = document.getElementById("downloadButton");
const generateButton = document.getElementById("genButton");
const textSpace = document.getElementById("textStuff");

textSpace.style.fontSize = "24px";
textSpace.innerHTML = "Click the button to generate a schedule";

downloadButton.setAttribute("class", "hidden");

generateButton.addEventListener("click", async () => {
  downloadButton.setAttribute("class", "hidden");
  console.log("Generating Schedule...");
  textSpace.style.fontSize = "24px";
  textSpace.innerHTML =
    "Generating Schedule... <br/> This may take a few seconds.";
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
        downloadButton.setAttribute("class", "hidden");

        return;
      }
      schedule = data[0];
      csv = data[1];
      encodedURI = data[2];
      updateText();
      updateDownload();
    })
  );
});

const updateText = function () {
  textSpace.style.fontSize = "10px";
  textSpace.innerHTML = schedule;
};

const updateDownload = function () {
  downloadButton.setAttribute("class", "");
  downloadButton.setAttribute("href", encodedURI);
  downloadButton.setAttribute("download", "Schedule.csv");
};
