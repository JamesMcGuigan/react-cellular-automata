import * as mathjs from 'mathjs';
import * as _ from 'lodash';

export interface IGameOfLifeStats {
    board:      number[][];
    hash:       string;
    iterations: number;
    period:     number;
    type:       'dead' | 'static' | 'oscillator' | 'spaceship' | 'random';
}

export interface IConfig {
    wrapping?: boolean;
}

export default
class GameOfLifeReducers {

    static getCellCoords( board: number[][], [x,y]: [number, number], config: IConfig = {} ): [number, number] {
        if( config && config.wrapping ) {
            // Modulo rounding with negative numbers requires adding length before modulo
            // (-1) % 10 == -1 | (-1 + 10) % 10 == 9
            const xr = (x + board.length    ) % board.length;
            const yr = (y + board[xr].length) % board[xr].length;
            return [xr, yr];
        } else {
            return [ x, y ];
        }
        
    }

    static getCell( board: number[][], [x,y]: [number, number], config: IConfig = {} ): number {
        const coords = this.getCellCoords(board, [x,y], config);
        try {
            return board[ coords[0] ][ coords[1] ] || 0;
        } catch( _exception ) {
            return 0;
        }
    }

    static setCell( board: number[][], [x,y]: [number, number], value: number, config: IConfig = {} ): number[][] {
        const coords = this.getCellCoords(board, [x,y], config);
        const nextBoard = board.map((row: number[], x: number) => row.map((cell: number, y: number) => {
            return ( x === coords[0] && y === coords[1] ) ? value : cell;
        }));
        return nextBoard;
    }

    static neighbourCount( board: number[][], [x,y]: [number, number], config: IConfig = {} ): number {
        let count = 0;
        for( let xi = x - 1; xi <= x + 1; xi++ ) {
            for( let yi = y - 1; yi <= y + 1; yi++ ) {
                if( xi === x && yi === y ) { continue; }
                const cell = this.getCell(board, [xi,yi], config);
                count += cell;
            }
        }
        return count;
    }
    
    static resizeBoard( board: number[][] | undefined, size: [number, number] ): number[][] {
        const nextBoard: number[][] = Array.from(Array(size[0]), (_row, x) =>
            Array.from(Array(size[1]), (_cell, y) => {
                if( !Array.isArray(board) ) { return 0; }
                try {
                    return board[ x ][ y ] || 0;
                } catch( _exception ) {
                    return 0;
                }
            })
        );
        return nextBoard;
    }
    
    static mapBoard( board: number[][], value: number | ((value: number, coords: [number,number]) => number) ): number[][] {
        return board.map((row: number[], x: number) => row.map((cell: number, y: number) => {
            if( value instanceof Function ) {
                return value(cell, [x,y]);
            } else {
                return +value || 0;
            }
        }));
    }
    
    static centerBoard( board: number[][], config: IConfig = {} ): number[][] {
        const size    = this.getBoardSize(board);
        const padding = { top: 0, bottom: 0, left: 0, right: 0 };
        
        for( let i = 0; i < size[0]; i++ ) {
            if( this.getRow(board, i).some((value) => !!value) ) { break; }
            padding.top++;
        }
        for( let i = size[0] - 1; i >= 0; i-- ) {
            if( this.getRow(board, i).some((value) => !!value) ) { break; }
            padding.bottom++;
        }
        for( let i = 0; i < size[1]; i++ ) {
            if( this.getColumn(board, i).some((value) => !!value) ) { break; }
            padding.left++;
        }
        for( let i = size[1] - 1; i >= 0; i-- ) {
            if( this.getColumn(board, i).some((value) => !!value) ) { break; }
            padding.right++;
        }

        const offset = [
            Math.floor( (padding.bottom - padding.top ) / 2 ),
            Math.floor( (padding.right  - padding.left) / 2 ),
        ];
        if( offset === [0,0] ) {
            return board;
        } else {
            return this.mapBoard(board, (_value: number, coords: [number,number]): number => {
                return this.getCell(board, [
                    coords[0] - offset[0],
                    coords[1] - offset[1],
                ], config);
            });
        }
        
    }
    
    // DOCS: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
    // - Any live cell with fewer than two  live neighbours dies, as if by underpopulation.
    // - Any live cell with two or three    live neighbours lives on to the next generation.
    // - Any live cell with more than three live neighbours dies, as if by overpopulation.
    // - Any dead cell with exactly three   live neighbours becomes a live cell, as if by reproduction.
    //
    // Rule 3: Live + [2,3] || Dead + [3] == Live
    static nextBoard( board: number[][], rule: number = 3, config: IConfig ): number[][] {
        const nextBoard = board.map((row: number[], x: number) => row.map((cell: number, y: number) => {
            const neighbourCount = this.neighbourCount(board, [x,y], config);
            if( rule === neighbourCount || rule - cell === neighbourCount ) {
                return 1;
            } else {
                return 0;
            }
        }));
        return nextBoard;
    }

    static isEmpty( board: number[][] ): boolean {
        return board.every((row) =>
            row.every((cell) => cell === 0)
        );
    }
    
    static getRow( board: number[][], rowNumber: number ): number[] {
        return board[rowNumber];
    }
    static getColumn( board: number[][], colNumber: number ): number[] {
        return board.map((row) => row[colNumber]);
    }
    
    static getBoardSize( board: number[][] ): [number, number] {
        const X = board.length;
        const Y = Math.max( ...board.map((row) => row.length) );
        return [X,Y];
    }


    static hash( board: number[][] ): string {
        // Bitwise sum of rows, joined as string
        return board.map((row) => row.reduce((hash, n) => hash << 1 | n, 0) ).join(',');
    }

    // TODO: untested
    static getBoardStats(board: number[][], rule = 3, size?: [number, number], maxIterations = 100 ): IGameOfLifeStats {
        if( size === undefined ) {
            size = mathjs.size(board).map((n) => n * 5) as [number, number];  // test on board 10x as large as original
        }

        const firstBoard  = this.centerBoard(board);
        const firstHash   = this.hash(firstBoard);
        let nextBoard     = this.centerBoard(this.resizeBoard(firstBoard, size));
        let nextHash      = this.hash(nextBoard);
        let history: Array<string> = [ nextHash ];

        for( let iterations = 0; iterations <= maxIterations; iterations++ ) {
            const lastBoard = nextBoard;
            const lastHash  = this.hash(lastBoard);
            nextBoard       = this.nextBoard(nextBoard, rule, { wrapping: true });
            nextHash        = this.hash(nextBoard);
            history = [ ...history, this.hash(nextBoard) ];

            // Any pattern that eventually returns to the empty board is dead
            if( this.isEmpty(nextBoard) ) {
                return {
                    board:      firstBoard,
                    hash:       firstHash,
                    iterations: history.length,
                    period:     0,
                    type:       'dead',
                };
            }

            // If the next iteration is the same as the last, it is a static board
            if( nextHash === lastHash ) {
                return {
                    board:      firstBoard,
                    hash:       firstHash,
                    iterations: history.length,
                    period:     1,
                    type:       'static',
                };
            }
            
            const repeatIndex = history.indexOf( nextHash );
            if( repeatIndex !== -1 && repeatIndex !== history.length - 1 ) {
                return {
                    board:      firstBoard,
                    hash:       firstHash,
                    iterations: history.length,
                    period:     history.length - 1 - repeatIndex,
                    type:       'oscillator',
                };
            }
        }

        // If we get to the end of maxIterations without repeating, then assume random
        return {
            board:      firstBoard,
            hash:       firstHash,
            iterations: history.length,
            period:     0,
            type:       'random',
        };
    }

    static generateShape(shapeNumber: number, size: [number, number]): number[][] {
        const binary      = shapeNumber.toString(2);
        const array       = binary.split('').map(Number);
        const board       = _.chunk( array, size[0] );
        const centerBoard = this.centerBoard(this.resizeBoard(board, size));
        return centerBoard;
    }

    static generateShapeStats(rule = 3, size: [number, number]) {
        const bitsize = Math.min( 2 ** (size[0] * size[1]), Number.MAX_SAFE_INTEGER );
        const boards  = _(0).range(bitsize)
            .map((n) => this.generateShape(n, size) )
            .keyBy((board) => this.hash(board))
            .values()
            .value()
        ;
        const boardStats = _(boards)
            .map((board) => this.getBoardStats(board, rule) )
            .value()
        ;

        const groupedStats = _(boardStats)
            .sortBy(['period', 'iterations'])
            .reverse()
            .groupBy('type')
            .value()
        ;
        return groupedStats;
    }

}
