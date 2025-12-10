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
    .map((row, i) => ({ coord: row.split(",").map(Number), id: i }));

  let distances = [];
  const nets = new Array(cleanData.length).fill([]).map((e, i) => [i]);

  const targetIter = 1000;

  console.time("distances");
  // pregenerate distances between all pairs
  for (let i = 0; i < cleanData.length - 1; i++) {
    for (let j = i + 1; j < cleanData.length; j++) {
      const dist = calcDistance(cleanData[i], cleanData[j]);
      distances.push({ i, j, dist });
    }
  }
  distances = distances.sort((a, b) => a.dist - b.dist);

  console.timeEnd("distances");
  // 652.271ms

  let i = 0;
  let iter = 0;
  console.time("connections");
  for (const d of distances) {
    if (iter === targetIter - 1) break;

    if (nets.find((n) => n.includes(d.i) && n.includes(d.j))) {
      iter++;
      continue;
    }
    const inet = nets.find((n) => n.includes(d.i));
    const jnet = nets.find((n) => n.includes(d.j));

    inet.push(...jnet);
    nets.splice(nets.indexOf(jnet), 1);

    iter++;
  }
  console.timeEnd("connections");
  // 25.683ms

  const topThree = nets.sort((a, b) => b.length - a.length).splice(0, 3);
  console.log(
    topThree,
    topThree.reduce((a, c) => a * c.length, 1),
  );
});
