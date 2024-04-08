const express = require("express");
const app = express();

const coll = document.getElementsByClassName("collapsible");
const classFilter = document.getElementById("classFilter");
const courseFilter = document.getElementById("courseFilter");
const teacherFilter = document.getElementById("teacherFilter");

const numOfClassrooms = document.getElementById("classroomsCount").textContent;

let i;
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    const content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.borderRadius = "0px 0px 10px 10px";
    }
  });
}

classFilter.addEventListener("keyup", () => {
  for (let i = 0; i < numOfClassrooms; i++) {
    const element = document.getElementById("viewClassrooms" + i);
    if (!element.textContent.includes(classFilter.value)) {
      element.setAttribute("class", "hidden");
    } else {
      element.setAttribute("class", "collapsible");
    }
  }
});
