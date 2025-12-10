const fs = require("fs");

// Oh god what did I get myself into

procButton = (state, buttons) => {
  const res = [...state];
  for (let b = 0; b < res.length; b++) {
    res[b] += buttons[b];
  }
  return res;
};

oobCheck = (state, target) => {
  for (let s = 0; s < state.length; s++) {
    if (state[s] > target[s]) {
      return true;
    }
  }
  return false;
};

scaleButton = (buttons, scale) => {
  return buttons.map((b) => b * scale);
};

compareState = (s1, s2) => {
  //console.log("compare", s1, s2);
  if (s1.length !== s2.length) return false;
  //console.log("length check passed");
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i]) {
      //console.log("mismatch at ", i);
      return false;
    }
  }
  //console.log("match");
  return true;
};

recProc = (options, previous, target) => {
  const candidates = [];

  //console.log("options", options, "previous", previous, "target", target);
  if (options.length === 1) {
    //console.log("first line of options", options[0]);
    for (const op of options[0]) {
      if (compareState(target, procButton(previous, op))) {
        return [op];
      }
    }
    return null;
  } else {
    for (const op of options[0]) {
      const curState = procButton(previous, op);
      if (oobCheck(curState, target)) {
        continue;
      }
      const valOp = recProc(options.slice(1), curState, target);
      if (valOp) {
        candidates.push(
          ...valOp.map((v) => {
            if (Array.isArray(v[0])) {
              return [op, ...v];
            } else {
              return [op, v];
            }
          }),
        );
      }
    }
    if (candidates.length === 0) return null;
    return candidates;
  }
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
      const joltage = wires
        .splice(-1)[0]
        .replaceAll(/[\{\}]/g, "")
        .split(/,/g)
        .map(Number);
      const buttons = wires.map((btn) =>
        btn
          .replaceAll(/[\(\)]/g, "")
          .split(/,/g)
          .map(Number)
          .sort((a, b) => a - b),
      );
      const sbuttons = [];
      for (const b of buttons) {
        const sb = [];
        for (let i = 0; i < joltage.length; i++) {
          sb.push(b.includes(i) ? 1 : 0);
        }
        sbuttons.push(sb);
      }
      return {
        indicators,
        bindicators,
        buttons,
        sbuttons,
        joltage,
      };
    });

  let counts = [];
  for (const [i, mac] of cleanData.entries()) {
    console.log("Processing", i, mac);

    // boolmaps no longer needed
    // come up with new logic...
    const [maxj, minj] = [Math.max(...mac.joltage), Math.min(...mac.joltage)];
    //console.log(minj, maxj);
    // might be useful later

    const buttonOptions = [];

    for (const btn of mac.sbuttons) {
      const opt = [];
      for (let p = maxj; p >= 0; p--) {
        opt.push(scaleButton(btn, p));
      }
      buttonOptions.push(opt);
    }

    // console.log(buttonOptions);
    const startJoltage = new Array(mac.joltage.length).fill(0);
    const candidates = recProc(buttonOptions, startJoltage, mac.joltage);
    //console.log("Proc candidates");
    const reducedCandidates = candidates
      .map((can) => can.map((bt) => Math.max(...bt)))
      .map((r) => r.reduce((a, c) => a + c, 0))
      .sort((a, b) => a - b);
    counts.push(reducedCandidates[0]);
    console.log("best so far: ", counts);
    // ok, at this point we have all possible changes button presses would introduce, so we can pick 1 from each row, and see if we get desired joltage
    // but at this point the scaling is fucking horrific: (max(joltage) ^ n of buttons...)
  }

  console.log(
    "Final: ",
    counts.reduce((a, c) => a + c, 0),
  );
});
