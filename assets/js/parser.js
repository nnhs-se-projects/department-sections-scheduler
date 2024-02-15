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
  // Call CSV parser
  let courses = await parse("courses.csv");

  // Reformat objects
  courses = courses.map((data) => {
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

  // Write to a .json file
  fs.writeFileSync("assets/json/courses.json", JSON.stringify(courses));

  // Returns the array of objects
  return courses;
}

async function parseTeachers() {
  // Call CSV parser
  let teachers = await parse("teachers.csv");

  // Reformat objects
  teachers = teachers.map((data) => {
    const courses = data["Certified Courses"].split(", ");
    const coursePreferences = data["Course Preferences"].split(", ");
    return {
      name: data["Teacher Name"],
      certifiedCourses: data["Certified Courses"].split(", ").map((data) => {
        return { course: data, preference: 1.0 };
      }),
      openPeriods: data["Avaliable Periods"]
        .split(",")
        .map((data) => Number(data)),
    };
  });

  // Write to a .json file
  fs.writeFileSync("assets/json/teachers.json", JSON.stringify(teachers));

  // Returns the array of objects
  return teachers;
}

async function parseClassrooms() {
  // Call CSV parser
  let classrooms = await parse("classrooms.csv");

  // Reformat objects
  classrooms = classrooms.map((data) => {
    return {
      roomNum: data["Classroom Number"],
      periodsAvaliable: data["Avaliable Periods"]
        .split(",")
        .map((data) => Number(data)),
    };
  });

  // Write to a .json file
  fs.writeFileSync("assets/json/classrooms.json", JSON.stringify(classrooms));

  // Returns the array of objects
  return classrooms;
}
parseCourses();
parseTeachers();
// export { parseCourses, parseTeachers, parseClassrooms };
