const fs = require("fs");

fs.readFile("./input", "utf8", (err, data) => {
  if (err) return;

  const cleanData = data.trim().split("\n");

  let beams = [];

  const wid = cleanData[0].length;

  let splits = 0;

  let timelines = 0;

  for (const row of cleanData) {
    const splitters = [];
    for (let i = 0; i < row.length; i++) {
      // keep all splitters in mind

      if (row[i] === "S") {
        // start of beam
        beams.push({ beam: i, count: 1 });
      }

      if (row[i] === "^") {
        // remember relevant splitter
        splitters.push(i);
      }
    }

    // proc splits
    const removal = [];
    const adding = [];
    if (splitters.length > 0) {
      newBeams = [];
      for (const beam of beams) {
        if (splitters.includes(beam.beam)) {
          beam.active = false;

          // left
          const lbeam = newBeams.find((b) => b.beam === beam.beam + 1);
          if (lbeam) {
            lbeam.count += beam.count;
          } else {
            newBeams.push({
              beam: beam.beam + 1,
              count: beam.count,
            });
          }
          // right
          const rbeam = newBeams.find((b) => b.beam === beam.beam - 1);
          if (rbeam) {
            rbeam.count += beam.count;
          } else {
            newBeams.push({
              beam: beam.beam - 1,
              count: beam.count,
            });
          }
        } else {
          // fall through
          const sbeam = newBeams.find((b) => b.beam === beam.beam);
          if (sbeam) {
            sbeam.count += beam.count;
          } else {
            newBeams.push({
              beam: beam.beam,
              count: beam.count,
            });
          }
        }
      }
      beams = newBeams;
    }
  }
  console.log(beams.reduce((a, c) => a + c.count, 0));
});
