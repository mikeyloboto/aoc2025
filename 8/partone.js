const fs = require("fs");

calcDistance = (n1, n2) => {
  return Math.sqrt(
    Math.pow(n1.coord[0] - n2.coord[0], 2) +
    Math.pow(n1.coord[1] - n2.coord[1], 2) +
    Math.pow(n1.coord[2] - n2.coord[2], 2),
  );
};

fs.readFile("./input", "utf8", (err, data) => {
  if (err) return;

  const cleanData = data
    .trim()
    .split("\n")
    .map((row, i) => ({ coord: row.split(","), id: i }));

  const iterations = 1000;

  const cache = new Array(1000).fill([...new Array(1000).fill(0)]);

  const nets = [];

  console.log(cleanData.length);
  for (let iter = 0; iter < iterations; iter++) {
    console.log(`iteration ${iter}`);
    let shortest = 1000000000000;

    let [f, s] = [null, null];

    //for (const fir of cleanData) {
    //  for (const sec of cleanData) {
    for (let i = 0; i < cleanData.length - 1; i++) {
      for (let j = i + 1; j < cleanData.length; j++) {
        // check if already connected
        if (
          nets.some(
            (net) =>
              net.includes(cleanData[i].id) && net.includes(cleanData[j].id),
          )
        ) {
          continue;
        }

        let dist = cache[i][j];
        if (dist === 0) {
          dist = calcDistance(cleanData[i], cleanData[j]);
          cache[i][j] = dist;
          cache[j][i] = dist;
        } else {
        }

        if (dist < shortest) {
          shortest = dist;
          [f, s] = [cleanData[i], cleanData[j]];
          // connect them;
        }
      }
    }

    // decide how to proceed
    if (nets.find((n) => n.includes(f.id))) {
      nets.find((n) => n.includes(f.id)).push(s.id);
    } else if (nets.find((n) => n.includes(s.id))) {
      nets.find((n) => n.includes(s.id)).push(f.id);
    } else nets.push([f.id, s.id]);
  }

  const topThree = nets.sort((a, b) => b.length - a.length).splice(0, 3);
  console.log(
    topThree,
    topThree.reduce((a, c) => a * c.length, 1),
  );
});
