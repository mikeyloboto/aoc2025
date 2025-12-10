const fs = require("fs");

fs.readFile("./input", "utf8", (err, data) => {
  if (!err) {
    const cleanData = data
      .trim()
      .split("\n")
      .map((r) => r.split(""));

    const [x, y] = [cleanData.length, cleanData[0].length];

    const checkMask = [];

    let initMap = cleanData;
    let reformedMap = [];
    let availableRolls = 0;

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (!(i === 0 && j === 0)) {
          checkMask.push({ x: i, y: j });
        }
      }
    }

    console.time("proc");

    while (true) {
      for (let i = 0; i < x; i++) {
        refRow = [];
        for (let j = 0; j < y; j++) {
          // do cell automata stuff here
          if (initMap[i][j] !== "@") {
            refRow.push(initMap[i][j]);
          } else {
            let rolls = 0;
            for (const m of checkMask) {
              if (!initMap[i + m.x]) continue;
              if (!initMap[i + m.x][j + m.y]) continue;
              if (initMap[i + m.x][j + m.y] === "@") {
                rolls++;
              }
            }
            // console.log(`${i}; ${j}: ${rolls}`);
            if (rolls < 4) {
              refRow.push("x");
              availableRolls++;
            } else refRow.push("@");
          }
        }
        reformedMap.push(refRow);
      }

      if (reformedMap.find((row) => row.find((cell) => cell === "x"))) {
        // can continue
      } else {
        break;
      }
      //swap maps
      initMap = reformedMap.map((row) =>
        row.map((cell) => (cell === "x" ? "." : cell)),
      );
      reformedMap = [];
    }
    console.timeEnd("proc");
    // 259.03ms (This is horrible)

    // console.log(checkMask);
    // console.log(cleanData.map((r) => r.join("")).join("\n"));
    // console.log();
    // console.log(reformedMap.map((r) => r.join("")).join("\n"));

    console.log(`Available rolls: ${availableRolls}`);
  }
});
