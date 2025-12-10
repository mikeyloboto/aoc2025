const fs = require("fs");

const { init } = require("z3-solver");

// Oh god what did I get myself into

fs.readFile("./input", "utf8", async (err, data) => {
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
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const { Context } = await init();
  for (const [i, mac] of cleanData.entries()) {
    const { Solver, Optimize, Int } = new Context("main");

    const [maxj, minj] = [Math.max(...mac.joltage), Math.min(...mac.joltage)];

    const vars = [];

    const solver = new Optimize();

    for (let ind = 0; ind < mac.sbuttons.length; ind++) {
      const v = Int.const(`${alphabet[ind]}`);
      solver.add(v.ge(0));
      vars.push(v);
    }

    for (let x = 0; x < mac.joltage.length; x++) {
      let condition = Int.val(0);
      for (const [y, btn] of mac.sbuttons.entries()) {
        if (btn[x] === 1) {
          condition = condition.add(vars[y]);
        }
      }
      condition = condition.eq(Int.val(mac.joltage[x]));
      solver.add(condition);
    }

    const sumVars = vars.reduce((a, v) => a.add(v), Int.val(0));

    solver.minimize(sumVars);

    const result = await solver.check();
    if (result === "sat") {
      counts.push(+solver.model().eval(sumVars).toString());
    }
  }

  console.log(
    "Final: ",
    counts.reduce((a, c) => a + c, 0),
  );
});
