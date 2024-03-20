let teacherArr = require("./Teachers.json");
const teacherString = JSON.stringify(teacherArr);
let somethingElse = JSON.parse(teacherString);
console.log(somethingElse);
somethingElse[0] = null;
console.log(somethingElse);

somethingElse = JSON.parse(teacherString);
console.log(somethingElse);
console.log(somethingElse[0].certifiedCourses[0]);
