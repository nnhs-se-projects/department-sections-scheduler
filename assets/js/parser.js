const csv = require("csv-parser");
const fs = require("fs");

const FileType = {
  Courses: Symbol("courses"),
  Teachers: Symbol("teachers"),
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

  // Rename keys and reformat values
  switch (fileType) {
    case FileType.Courses:
      results = results.map(coursesFormat);
      break;
    case FileType.Teachers:
      results = results.map(teachersFormat);
      break;
  }

  console.log(results);
  fs.writeFileSync("assets/json/courses.json", JSON.stringify(results));
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
  return {};
}

parse("courses.csv", FileType.Courses);
