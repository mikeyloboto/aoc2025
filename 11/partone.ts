import * as fs from 'fs';

let cleanData: { serv: string; conn: string[] }[] = [];

function procSolution(data: string[]) {
  cleanData = data.map((row) => ({
    serv: row.split(/:/g)[0]!.trim(),
    conn: row.split(/:/g)[1]!.trim().split(/\s/g)
  }));

  const start = cleanData.find((d) => d.serv === 'you')!;
  const chains = recMap(start);
  console.log(chains.length);
}

function recMap(node: { serv: string; conn: string[] }) {
  const chains: string[][] = [];

  node.conn.forEach((c) => {
    if (c === 'out') {
      chains.push([c]);
    } else {
      const higherChains = recMap(cleanData.find((d) => d.serv === c)!);
      if (higherChains.length > 0) {
        higherChains.forEach((ch) => {
          chains.push([c, ...ch]);
        });
      }
    }
  });

  return chains;
}

fs.readFile('./input', 'utf8', (err, data) => {
  if (!err) {
    procSolution(data.trim().split(/\n/g));
  }
});
