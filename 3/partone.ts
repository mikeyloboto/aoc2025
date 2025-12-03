const fs = require("fs");

fs.readFile("./input", "utf8", (err, data) => {
  if (!err) {
    const cleanData = data.trim().split("\n");

    let totalJoltage = 0;
    for (const bank of cleanData) {
      const batteries = bank.split("").map(Number);
      //find max val and index
      let max = [0, 0];
      for (let i = 0; i < batteries.length; i++) {
        if (batteries[i] > max[0]) {
          max = [batteries[i], i];
        }
      }

      let secMax = [0, 0];
      if (max[1] !== batteries.length - 1) {
        // search for max at the end
        for (let i = max[1] + 1; i < batteries.length; i++) {
          if (batteries[i] > secMax[0]) {
            secMax = [batteries[i], i];
          }
        }
      } else {
        for (let i = 0; i < max[1]; i++) {
          if (batteries[i] > secMax[0]) {
            secMax = [batteries[i], i];
          }
        }
      }

      const ordered =
        max[1] < secMax[1] ? `${max[0]}${secMax[0]}` : `${secMax[0]}${max[0]}`;
      totalJoltage += +ordered;
    }

    console.log(`Total Joltage: ${totalJoltage}`);
  }
});
