import * as fs from 'fs';

function procSolution(data: string[]) {
  console.log('test');
}

fs.readFile('./input', 'utf8', (err, data) => {
  if (!err) {
    procSolution(data.trim().split(/\n/g));
  }
});
