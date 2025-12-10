const fs = require("fs");

fs.readFile("./testinput", "utf8", (err, data) => {
  if (err) return;
  const cleanData = data.trim().split(/\n/g);
  console.log(cleanData);
});
