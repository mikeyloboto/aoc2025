import * as fs from 'fs';

type Present = {
  num: number;
  shape: string[];
  area?: number;
};

type Req = {
  size: { x: number; y: number };
  area?: number;
  req: number[];
};

function procSolution(data: string) {
  const cdata = data.split(/\n\n/g);

  const rdata = cdata.splice(-1);

  const presents: Present[] = cdata.map((pr) => {
    const num = +pr.split(/:/g)[0]!;
    const shape = pr.split(/:/)[1]!.trim().split(/\n/g)!;
    return { num, shape } as Present;
  });

  const requirements: Req[] = rdata[0]!.split(/\n/g).map((req) => {
    const size = req.split(/:\s/g)[0];

    return {
      size: { x: +size!.split('x')[0]!, y: +size!.split('x')[1]! },
      req: req.split(/:\s/g)[1]!.split(/\s/g).map(Number)
    } as Req;
  });

  requirements.forEach((req) => {
    req.area = req.size.x * req.size.y;
  });

  presents.forEach((pr) => {
    pr.area = pr.shape.join('').matchAll(/#/g).toArray().length;
  });

  // console.log(presents);
  // console.log(requirements);

  let fitting = 0;

  // Everything before is a preparation while overthinking

  // And this is the actual solution
  requirements.forEach((req) => {
    let occArea = 0;
    for (let i = 0; i < req.req.length; i++) {
      occArea += req.req[i]! * presents[i]!.area!;
    }
    if (occArea <= req.area!) {
      fitting++;
    }
  });

  console.log({ fitting });
}

fs.readFile('./input', 'utf8', (err, data) => {
  if (!err) {
    procSolution(data.trim());
  }
});
