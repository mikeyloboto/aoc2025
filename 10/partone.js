const fs = require("fs");

procButton = (state, buttons) => {
  const res = [...state];
  for (const b of buttons) {
    res[b] = !res[b];
  }
  return res;
};

boolCache = new Map();

buildBoolMap = (len) => {
  if (boolCache.get(len)) {
    return boolCache.get(len);
  }
  let res = [];
  for (let i = 0; i < Math.pow(2, len); i++) {
    const num = i
      .toString(2)
      .padStart(len, "0")
      .split("")
      .map((d) => d === "1");
    res.push(num);
  }
  boolCache.set(len, res);
  return res;
};

compareState = (s1, s2) => {
  if (s1.length !== s2.length) return false;
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) return false;
  }
  return true;
};

fs.readFile("./input", "utf8", (err, data) => {
  if (err) return;
  const cleanData = data
    .trim()
    .split(/\n/g)
    .map((row) => {
      const wires = row.split(/\s/g);

      const indicator = wires.splice(0, 1)[0];
      const indicators = indicator.replaceAll(/[\[\]]/g, "").split("");
      const bindicators = indicators.map((i) => i === "#");
      const joltage = wires.splice(-1)[0];
      return {
        indicators,
        bindicators,
        buttons: wires.map((btn) =>
          btn
            .replaceAll(/[\(\)]/g, "")
            .split(/,/g)
            .map(Number)
            .sort((a, b) => a - b),
        ),
        joltage: joltage
          .replaceAll(/[\{\}]/g, "")
          .split(/,/g)
          .map(Number),
      };
    });

  let counts = [];
  for (const [i, mac] of cleanData.entries()) {
    // first remove the buttons that change lights that should not be changed:
    // const undesiredLights = mac.bindicators
    //  .map((a, i) => ({ light: a, i }))
    //  .filter((a) => !a.light)
    //  .map((a) => a.i);
    // console.log(undesiredLights);
    // let viableButtons = [...mac.buttons].filter(
    //  (b) => !b.some((bidx) => undesiredLights.includes(bidx)),
    // );
    // console.log(viableButtons);
    // Nope, not a good approach, we do want them sometimes
    // ok ok, hol up. Pressing button twice reverts it effect entirely. So each button needs to be pressed at most once,
    // thus we can map all combinations of buttons presses, check which will give the desired state, then sort asc by length...
    // Bruteforcey, yes, but since we can represent button map as boolean[], where each bool is whether the button is pressed or not, then worse case is 2^n
    // with n boing number of buttons, which I am hoping is not too too bad. Well, that did bite me in the past, will see.

    const candidates = [];
    const bools = buildBoolMap(mac.buttons.length);
    for (const b of bools) {
      let state = new Array(mac.bindicators.length).fill(false);
      for (let bi = 0; bi < b.length; bi++) {
        if (b[bi]) state = procButton(state, mac.buttons[bi]);
      }
      if (compareState(state, mac.bindicators)) {
        candidates.push(b.filter((btn) => btn));
      }
    }
    counts.push(candidates.sort((a, b) => a.length - b.length)[0].length);
  }
  console.log(counts.reduce((a, c) => a + c, 0));
});
