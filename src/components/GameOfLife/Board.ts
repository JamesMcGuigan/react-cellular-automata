import * as math from 'mathjs';
import * as _ from 'lodash';
import Cell from "./Cell";

export default
class Board {
    shape: Array<number>;
    data:  Array<Array<number>>;

    constructor(data?: Array<Array<number>>, shape?: number[] ) {
        if( data && !shape ) {
            this.data  = data;
            this.shape = math.size( data );
        } else {
            this.shape = shape || [10, 10];
            this.data  = data  || math.zeros(this.shape);
        }
    }

    setCell(value: number, [indexX, indexY]: [number, number]): void {
        _.set(this.data, [indexX, indexY], value);
    }

    setBoard(data: Array<Array<number>>): void {
        this.data  = data;
        this.shape = math.size( data );
    }

    nextIteration(): Board {
        return new Board( this.nextData() );
    }

    nextData(): Array<Array<number>> {
        const nextData = this.data.map((row, x) => row.map((value, y) => {
            const neighbours = this.getCellNeighbours(x, y, this.shape );
            return this.rule( value, neighbours );
        }));
        return nextData;
    }

    getCellNeighbours(x: number, y: number, size: number[]): number[] {
        const neighbours: Array<Cell> = [];
        for( let xi = x - 1; xi <= x + 1; xi++ ) {
            for( let yi = y - 1; yi <= y + 1; yi++ ) {
                if( xi === x && yi === y ) { continue; }
                const xr = (xi + size[0]) % size[0];
                const yr = (yi + size[1]) % size[1];

                const cell = _.get( this.data, [ xr, yr ]);
                neighbours.push( cell );
            }
        }
        return neighbours;
    }

    // DOCS: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
    // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
    // Any live cell with two or three live neighbours lives on to the next generation.
    // Any live cell with more than three live neighbours dies, as if by overpopulation.
    // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
    rule( value: Cell, neighbours: number[] ): Cell {
        const neighboursSum = math.sum(neighbours);

        if( value === Cell.Live ) {
            if( [2,3].includes( neighboursSum ) ) { return Cell.Live; }
            // if( neighboursSum <= 2           ) { return Cell.Dead; }
            // if( neighboursSum > 3            ) { return Cell.Dead; }
        } else if( value === Cell.Dead ) {
            if( neighboursSum === 3             ) { return Cell.Live; }
            // else                               { return Cell.Dead; }
        }
        return Cell.Dead;
    }

}
