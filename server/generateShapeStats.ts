import * as fs            from "fs";
import * as yargs         from 'yargs';
import GameOfLifeReducers from "../src/components/GameOfLife/GameOfLifeReducers";

const argv = yargs
    .number('rule').default('rule', 3)
    .number('x').default('x', 2)
    .number('y').default('y', 2)
    .boolean('verbose').alias('v', 'verbose')
    .boolean('save')
    .argv
;
const shape: [number, number] = [ argv.x, argv.y ];

const stats = GameOfLifeReducers.generateShapeStats(argv.rule, shape);

const filename = `pages/data/generateShapeStats.${argv.x}x${argv.y}.rule-${argv.rule}.json`;
const json = JSON.stringify(stats, null, '\t')
    .replace(/\[(\s*\d+,?)*\s*]/mg, (...args) => {
        return args[0].replace(/\s+/mg, ' '); // print numeric arrays on a single line
    })
;
fs.writeFileSync(filename, json);

if( argv.verbose || !argv.save ) {
    console.info(json);
}
if( argv.save ) {
    console.info(`wrote: ${filename}.json`);
}

