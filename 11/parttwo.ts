import * as fs from 'fs';

type Node = {
  serv: string;
  conn: string[];
  matconn: Node[];
  traversed: boolean;
  potPaths: { path: string[]; count: number }[];
};

let cleanData: Node[] = [];

const nodeMap: { [key: string]: Node } = {};

const START_NODE = 'svr';
const END_NODE = 'out';
const VISIT_NODE = ['dac', 'fft'];

let pathCount = 0;

const nodeCache = new Map<string, string[][]>();

function procSolution(data: string[]) {
  cleanData = data.map((row, index) => ({
    serv: row.split(/:/g)[0]!.trim(),
    conn: row.split(/:/g)[1]!.trim().split(/\s/g),
    matconn: [],
    traversed: false,
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
          potPaths: []
        });
      }
    });
    nodeMap[d.serv] = d;
  });

  const start = nodeMap[START_NODE]!;
  const finCount = recMap(start, 0, []);
  console.log(
    finCount.filter((c) => meetsReq(c.path)).reduce((a, c) => a + c.count, 0)
  );
}

function recMap(
  node: Node,
  depth: number = 1,
  path: string[]
): { path: string[]; count: number }[] {
  if (node.traversed) {
    return node.potPaths;
  }

  if (node.serv === END_NODE) {
    return [{ path: [node.serv], count: 1 }];
  }

  node.matconn.forEach((conn) => {
    const paths = recMap(conn, depth + 1, [...path, node.serv]);

    paths.forEach((pa) => {
      const canonicalName = pa.path.join('');
      const existing = node.potPaths.find(
        (pp) => pp.path.join('') === canonicalName
      );

      if (existing) {
        existing.count += pa.count;
      } else {
        node.potPaths.push(JSON.parse(JSON.stringify(pa)));
        // FUCK YOU JAVASCRIPT! Spent ~5hr here figuring out why it's merging different paths, only to figure out later that it is not copying but linking the objects here, so when new node is pushed into the path, it updates all the potentials paths in all the nodes that were copied here...
      }
    });
  });
  node.traversed = true;
  if (VISIT_NODE.includes(node.serv))
    node.potPaths.forEach((pp) => pp.path.push(node.serv));
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
