import * as fs from 'fs';

type Node = {
  serv: string;
  conn: string[];
  matconn: Node[];
  traversed: boolean;
  paths: number;
  available: string[];
  potPaths: { path: string[]; count: number }[];
};

let cleanData: Node[] = [];

const nodeMap: { [key: string]: Node } = {};

const START_NODE = 'svr';
// const END_NODE = 'dac';
const END_NODE = 'out';
// const VISIT_NODE: string[] = [];
const VISIT_NODE = ['dac', 'fft'];

let pathCount = 0;

const nodeCache = new Map<string, string[][]>();

function procSolution(data: string[]) {
  cleanData = data.map((row, index) => ({
    serv: row.split(/:/g)[0]!.trim(),
    conn: row.split(/:/g)[1]!.trim().split(/\s/g),
    matconn: [],
    traversed: false,
    paths: 0,
    available: [],
    potPaths: []
  }));

  cleanData.forEach((d) => {
    d.conn.forEach((con) => {
      if (con !== END_NODE) {
        d.matconn.push(cleanData.find((cd) => cd.serv === con)!);
      } else {
        d.matconn.push({
          serv: END_NODE,
          conn: [],
          matconn: [],
          traversed: false,
          paths: 0,
          available: [],
          potPaths: []
        });
      }
    });
    nodeMap[d.serv] = d;
  });

  // console.log(nodeMap);

  // console.log(cleanData);

  //console.log({ nodeMap });
  const start = nodeMap[START_NODE]!;
  const finCount = recMap(start, 0, []);

  // console.log({ nodeMap });
  //const filteredChains = paths.filter((ch) =>
  //  VISIT_NODE.reduce((a, vn) => a && ch.includes(vn), true)
  //);
  //console.log(filteredChains.length);
  console.log(
    finCount.filter((c) => meetsReq(c.path)).reduce((a, c) => a + c.count, 0)
  );
  //console.log({ paths });
}

function recMap(
  node: Node,
  depth: number = 1,
  path: string[]
): { path: string[]; count: number }[] {
  // console.log(node);
  if (node.traversed) {
    return node.potPaths;
  }

  if (node.serv === END_NODE) {
    return [{ path: [node.serv], count: 1 }];
  }

  node.matconn.forEach((conn) => {
    const paths = recMap(conn, depth + 1, [...path, node.serv]);
    // console.log({ paths });

    paths.forEach((pa) => {
      const canonicalName = pa.path.join('');
      const existing = node.potPaths.find(
        (pp) => pp.path.join('') === canonicalName
      );

      // console.log(node.serv, canonicalName, existing);
      if (existing) {
        existing.count += pa.count;
      } else {
        node.potPaths.push(JSON.parse(JSON.stringify(pa)));
      }
      // console.log(`${node.serv} merge`, node.potPaths);
    });
  });
  node.traversed = true;
  if (VISIT_NODE.includes(node.serv))
    node.potPaths.forEach((pp) => pp.path.push(node.serv));
  // console.log(node.potPaths, node.serv);
  return node.potPaths;
}

function meetsReq(path: string[]) {
  return VISIT_NODE.reduce((a, vn) => a && path.includes(vn), true);
}

fs.readFile('./input', 'utf8', (err, data) => {
  if (!err) {
    procSolution(data.trim().split(/\n/g));
  }
});
