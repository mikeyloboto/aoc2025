const fs = require("fs");

fs.readFile("./input", "utf8", (err, data) => {
  if (!err) {
    const cleanData = data.trim().split("\n");

    let totalJoltage = 0;
    console.time("proc");
    for (const bank of cleanData) {
      const batteries = bank.split("").map(Number);

      while (batteries.length > 12) {
        let removed = false;
        for (let i = 0; i < batteries.length - 1; i++) {
          if (batteries[i] < batteries[i + 1]) {
            // remove current and break out
            batteries.splice(i, 1);
            removed = true;
            break;
          }
        }

        // if nothing is removed, then all batteries are in descending order, just yeet the last one
        if (!removed) {
          batteries.splice(batteries.length - 1, 1);
        }
      }

      const rowJoltage = +batteries.map(String).join("");
      totalJoltage += rowJoltage;
    }
    console.timeEnd("proc");

    console.log(`Total Joltage: ${totalJoltage.toString()}`);
  }
});
