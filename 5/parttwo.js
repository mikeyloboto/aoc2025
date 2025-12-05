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
    }))
    .sort((a, b) => (a.bot === b.bot ? 0 : a.bot < b.bot ? -1 : 1));
  const available = splitData[1].trim().split("\n").map(Number);

  let freshDeduped = [];

  for (const fr of fresh) {
    if (freshDeduped.length === 0) {
      freshDeduped.push(fr);
      continue;
    }

    if (fr.bot <= freshDeduped[freshDeduped.length - 1].top) {
      if (fr.top <= freshDeduped[freshDeduped.length - 1].top) {
        continue;
      }
      fr.bot = freshDeduped[freshDeduped.length - 1].top + 1;
    }
    freshDeduped.push(fr);
  }

  console.log(fresh);
  console.log(freshDeduped);
  console.log(freshDeduped.reduce((a, c) => a + (c.top - c.bot + 1), 0));
});
