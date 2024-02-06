const csv = require("csv-parser");
const fs = require("fs");

const readData = async function () {
  const results = [];
  await fs.createReadStream("teachers.csv")
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      return results;
    });
    await fs.pipe.
    
};
console.log(readData());
