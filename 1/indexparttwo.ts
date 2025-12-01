const fs = require("node:fs");

const inputData = fs.readFile("./input", "utf8", (err, data) => {
  if (!err) {
    const instructions = data.split("\n").filter((i) => i && i.length > 0);
    console.log(instructions);

    let val = 50;

    zeroCounter = 0;

    console.log(`${instructions.length} loaded`);

    for (const inst of instructions) {
      const dir = inst[0];
      const offset = +inst.substring(1);
      let startAtZero = val === 0;
      let addStartAtZero = val === 0;
      if (dir === "L") {
        val -= offset;
      } else {
        val += offset;
      }
      const initVal = val;
      while (true) {
        let counted = false;
        if (val > 99) {
          val -= 100;
          zeroCounter++;
          continue;
        } else if (val < 0) {
          val += 100;
          if (startAtZero) {
            startAtZero = false;
          } else {
            zeroCounter++;
          }
          continue;
        }
        if (val === 0 && dir === "L") {
          zeroCounter++;
        }
        if (val >= 0 && val <= 99) {
          break;
        }
      }
      if (offset % 100 === 0) {
        console.log("HERE");
      }
      console.log(
        `Init: ${initVal}, instruction: ${dir}${offset}, value: ${val}, zero counter: ${zeroCounter}`,
      );
    }
    console.log(zeroCounter);
  }
});
