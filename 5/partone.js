const fs = require("fs");

fs.readFile("./input", "utf8", (err, data) => {
  if (err) return;

  const splitData = data.split("\n\n");

  const fresh = splitData[0]
    .trim()
    .split("\n")
    .map((r) => ({
      bot: Math.min(...r.split("-").map(Number)),
      top: Math.max(...r.split("-").map(Number)),
    }));
  const available = splitData[1].trim().split("\n").map(Number);

  let freshCount = 0;

  for (const ing of available) {
    if (fresh.some((f) => ing >= f.bot && ing <= f.top)) {
      freshCount++;
    }
  }

  console.log(freshCount);
});
