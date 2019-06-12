import GameOfLifeReducers from "../src/components/GameOfLife/GameOfLifeReducers";
import * as fs from "fs";
import { argv } from 'yargs';

const rule = !Number.isNaN(argv.rule) ? Number(argv.rule) : 3;
const size = !Number.isNaN(argv.size) ? Number(argv.size) : 4;
const shape: [number, number] = [ size, size ];

const stats = GameOfLifeReducers.generateShapeStats(rule, shape);

const filename = `pages/data/generateShapeStats.size-${size}.rule-${rule}.json`;
const json = JSON.stringify(stats, null, '\t')
    .replace(/\[\s*(\d+),\s*(\d),\s*(\d)\s*]/mg,         '[ $1, $2, $3 ]')
    .replace(/\[\s*(\d+),\s*(\d),\s*(\d),\s*(\d)\s*]/mg, '[ $1, $2, $3, $4 ]')
;
fs.writeFileSync(filename, json);
console.info(`wrote: ${filename}.json`);
