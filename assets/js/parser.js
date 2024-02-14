const csv = require("csv-parser");
const fs = require("fs");

async function parse(filePath) {
  // Read CSV
  const results = [];
  return new Promise(function (resolve) {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        resolve(results);
      });
  });
}

async function parseCourses() {
  const courses = await parse("courses.csv");
  courses.map((data) => {
    return {
      name: data["Course Name"],
      sections: data["# of Sections"],
      compatibleClassrooms: data["Compatible Rooms"].split(", "),
      compatiblePeriods: data["Compatible Periods"]
        .split(",")
        .map((data) => Number(data)),
      userPriority: Number(data.Priority) || undefined,
    };
  });
  console.log(courses);
  fs.writeFileSync("assets/json/courses.json", JSON.stringify(courses));
}

async function parseTeachers() {
  const teachers = await parse("teachers.csv");
  teachers.map((data) => {
    return {
      name: data["Teacher Name"],
      certifiedCourses: data["Certified Courses"].split(", "),
      openPeriods: data["Avaliable Periods"]
        .split(",")
        .map((data) => Number(data)),
    };
  });
  console.log(teachers);
  fs.writeFileSync("assets/json/teachers.json", JSON.stringify(teachers));
}

async function parseClassrooms() {
  const classrooms = await parse("classrooms.csv");
  classrooms.map((data) => {
    return {
      roomNum: data["Classroom Number"],
      periodsAvaliable: data["Avaliable Periods"]
        .split(",")
        .map((data) => Number(data)),
    };
  });
  console.log(classrooms);
  fs.writeFileSync("assets/json/classrooms.json", JSON.stringify(classrooms));
}

parseCourses();
parseTeachers();
parseClassrooms();
