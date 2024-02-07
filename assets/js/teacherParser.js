const csv = require("csv-parser");
const fs = require("fs");

const readData = async function () {
  let results = [];
  const dataPromise = new Promise(function (resolve) {
    fs.createReadStream("teachers.csv")
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
  const results = await readData();
  results.map((data) => {
    return data;
  });
})();
