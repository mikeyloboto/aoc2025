const fs = require("node:fs");

const inputData = fs.readFile("./input", "utf8", (err, data) => {
  if (!err) {
    const instructions = data.split("\n").filter((i) => i && i.length > 0);
    console.log(instructions);

    let val = 50;

    zeroCounter = 0;

    iterCounter = 0;

    console.log(`${instructions.length} loaded`);

    for (const inst of instructions) {
      const dir = inst[0];
      const offset = +inst.substring(1);
      if (dir === "L") {
        val -= offset;
      } else {
        val += offset;
      }
      val = (val + 1000000) % 100;
      if (val === 0) {
        zeroCounter++;
      }

      iterCounter++;
      if (val === 0) console.log(`Rotation: ${dir}${offset} new val: ${val}`);
    }
    console.log(zeroCounter);
  }
});
