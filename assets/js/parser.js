const csv = require("csv-parser");
const fs = require("fs");
const FileType = {
  Courses: Symbol("courses"),
  Teachers: Symbol("teachers"),
  Classrooms: Symbol("classrooms"),
};

async function parse(filePath, fileType) {
  // Read CSV
  let results = [];
  const dataPromise = new Promise(function (resolve) {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        resolve(results);
      });
  });
  results = await dataPromise;

  // Rename keys and reformat values depending on the type of file
  // Write to a json in assets/json
  switch (fileType) {
    case FileType.Courses:
      results = results.map(coursesFormat);
      fs.writeFileSync("assets/json/courses.json", JSON.stringify(results));
      break;
    case FileType.Teachers:
      results = results.map(teachersFormat);
      fs.writeFileSync("assets/json/teachers.json", JSON.stringify(results));
      break;
    case FileType.Classrooms:
      results = results.map(classroomsFormat);
      fs.writeFileSync("assets/json/classrooms.json", JSON.stringify(results));
      break;
  }

  console.log(results);
}

function coursesFormat(data) {
  return {
    name: data["Course Name"],
    sections: data["# of Sections"],
    compatibleClassrooms: data["Compatible Rooms"].split(", "),
    compatiblePeriods: data["Compatible Periods"]
      .split(",")
      .map((data) => Number(data)),
    userPriority: Number(data.Priority) || undefined,
  };
}

function teachersFormat(data) {
  return {
    name: data["Teacher Name"],
    certifiedCourses: data["Certified Courses"].split(", "),
    openPeriods: data["Avaliable Periods"]
      .split(",")
      .map((data) => Number(data)),
  };
}

function classroomsFormat(data) {
  return {
    roomNum: data["Classroom Number"],
    periodsAvaliable: data["Avaliable Periods"]
      .split(",")
      .map((data) => Number(data)),
  };
}

parse("courses.csv", FileType.Courses);
parse("teachers.csv", FileType.Teachers);
parse("classrooms.csv", FileType.Classrooms);
