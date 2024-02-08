const csv = require("csv-parser");
const fs = require("fs");

const readData = async function () {
  let results = [];
  const dataPromise = new Promise(function (resolve) {
    fs.createReadStream("courses.csv")
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        resolve(results);
      });
  });
  results = await dataPromise;
  return results;
};

(async () => {
  let results = await readData();
  results = results.map((data) => {
    const newData = {
      name: data["Course Name"],
      sections: data["# of Sections"],
      compatibleClassrooms: data["Compatible Rooms"].split(", "),
      compatiblePeriods: data["Compatible Periods"]
        .split(",")
        .map((data) => Number(data)),
      userPriority: Number(data.Priority) || undefined,
    };
    return newData;
  });
  console.log(results);
  fs.writeFileSync("assets/json/courses.json", JSON.stringify(results));
})();
