import * as _ from 'lodash';

export interface IGameOfLifeStats {
    board:      number[][];
    hash:       string;
    iterations: number;
    period:     number;
    type:       'dead' | 'static' | 'oscillator' | 'glider' | 'random';
    sum:        number;
    size:       [number, number];
}

export interface IConfig {
    wrapping?: boolean;
}

export default
class GameOfLifeReducers {

    static getCellCoords( board: number[][], [x,y]: [number, number], config: IConfig = {} ): [number, number] {
        // OPTIMIZATION: function was 20% of runtime in profiler
        // Modulo rounding with negative numbers requires adding length before modulo
        // (-1) % 10 == -1 | (-1 + 10) % 10 == 9
        let xr = x;
        let yr = y;
        if( config.wrapping ) {
            if(      xr <  0                ) { xr += board.length;     }
            else if( xr >= board.length     ) { xr -= board.length;     }
            if(      yr <  0                ) { yr += board[xr].length; }
            else if( yr >= board[xr].length ) { yr -= board[xr].length; }
        }
        return [xr, yr];
    }

    static getCell( board: number[][], [x,y]: [number, number], config: IConfig = {} ): number {
        // OPTIMIZATION: function was 20% of runtime in profiler
        const coords = config.wrapping
                       ? this.getCellCoords(board, [x, y], config)
                       : [ x, y ]
        ;
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
        if( value instanceof Function ) {
            return board.map((row: number[], x: number) => row.map((cell: number, y: number) => {
                return value(cell, [x, y]);
            }));
        } else {
            return board.map((row: number[], _x: number) => row.map((_cell: number, _y: number) => {
                return +value || 0;  // Cast to Number()
            }));
        }
    }

    static getBoardPadding( board: number[][] ) {
        const size    = this.getBoardSize(board);
        const padding = { top: 0, bottom: 0, left: 0, right: 0 };

        for( let i = 0; i < size[0]; i++ ) {
            if( this.getRow(board, i).some((value) => !!value) ) { break; }
            padding.top++;
        }
        for( let i = size[0] - 1; i >= padding.top; i-- ) {
            if( this.getRow(board, i).some((value) => !!value) ) { break; }
            padding.bottom++;
        }
        for( let i = 0; i < size[1]; i++ ) {
            if( this.getColumn(board, i).some((value) => !!value) ) { break; }
            padding.left++;
        }
        for( let i = size[1] - 1; i >= padding.left; i-- ) {
            if( this.getColumn(board, i).some((value) => !!value) ) { break; }
            padding.right++;
        }
        return padding;
    }

    static centerBoard( board: number[][], config: IConfig = {} ): number[][] {
        const padding = this.getBoardPadding(board);

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

    static shrinkBoard( board: number[][], config: IConfig = {} ): number[][] {
        const size    = this.getBoardSize(board);
        const padding = this.getBoardPadding(board);

        size[0] = size[0] - padding.top   - padding.bottom;
        size[1] = size[1] - padding.right - padding.left;

        const nextBoard: number[][] = Array.from(Array(size[0]), (_row, x) =>
            Array.from(Array(size[1]), (_cell, y) => {
                return this.getCell(board, [
                    x + padding.top,
                    y + padding.left,
                ], config);
            })
        );
        return nextBoard;
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
        const Y = X ? Math.max( ...board.map((row) => row.length) ) : 0;
        return [X,Y];
    }


    static hash( board: number[][] ): string {
        // Bitwise sum of rows, joined as string
        return board.map((row) => row.reduce((hash, n) => hash << 1 | n, 0) ).join(':');
    }


    static getBoardStats(board: number[][], rule = 3, size: [number, number] = [20,20], maxIterations = 400 ): IGameOfLifeStats {
        if( size === undefined ) { size = [20,20]; }

        const firstBoard  = this.shrinkBoard(board);
        let   nextBoard   = this.centerBoard(this.resizeBoard(firstBoard, size));
        const firstHash   = this.hash(nextBoard);
        let   history: Array<string> = [ firstHash ];

        const stats = {
            board: firstBoard,
            hash:  this.hash(firstBoard),
            sum:   _(firstBoard).flattenDeep().sum(),
            size:  this.getBoardSize(firstBoard),
        };

        while( history.length <= maxIterations ) {
            const lastBoard = nextBoard;
            const lastHash  = this.hash(lastBoard);
            nextBoard       = this.nextBoard(nextBoard, rule, { wrapping: true });
            const nextHash  = this.hash(nextBoard);
            history = [ ...history, this.hash(nextBoard) ];

            // Any pattern that eventually returns to the empty board is dead
            if( this.isEmpty(nextBoard) ) {
                return {
                    ...stats,
                    iterations: history.length,
                    period:     0,
                    type:       'dead',
                };
            }

            // If the next iteration is the same as the last, it is a static board
            if( nextHash === lastHash ) {
                return {
                    ...stats,
                    iterations: history.length,
                    period:     1,
                    type:       'static',
                };
            }
            
            const repeatIndex = history.indexOf( nextHash );
            if( repeatIndex !== -1 && repeatIndex !== history.length - 1 ) {
                const period = history.length - 1 - repeatIndex;
                if( nextHash === firstHash && period >= Math.max(...size) ) {
                    return {
                        ...stats,
                        iterations: history.length,
                        period:     Infinity,
                        type:       'glider',
                    };
                } else {
                    return {
                        ...stats,
                        iterations: history.length,
                        period:     period,
                        type:       'oscillator',
                    };
                }
            }
        }

        // If we get to the end of maxIterations without repeating, then assume random
        return {
            ...stats,
            iterations: history.length,
            period:     Infinity,
            type:       'random',
        };
    }

    static generateShape(shapeNumber: number, size: [number, number]): number[][] {
        const binary      = shapeNumber.toString(2);
        const array       = binary.split('').map(Number);
        const board       = _.chunk( array, size[1] );   // BUGFIX: chunk by size[1] for a: size[0] x size[1] array
        const resizeBoard = this.resizeBoard(board, size);
        const centerBoard = this.centerBoard(resizeBoard);
        return centerBoard;
    }

    static generateShapeStats(rule = 3, size: [number, number]) {
        const bitsize = Math.min( 2 ** (size[0] * size[1]), Number.MAX_SAFE_INTEGER );
        const boards  = _(0).range(bitsize)
            .map((n)       => this.generateShape(n, size) )
            .map((board)   => this.shrinkBoard(board) )
            .keyBy((board) => board.toString())  // deduplicate translations
            .value()
        ;
        const boardStats = _(boards)
            .map((board) => this.getBoardStats(board, rule) )
            .keyBy((board) => _(board).pick(['sum', 'period', 'iterations']).values().join(':'))  // deduplicate rotation and mirroring
            .value()
        ;
        const groupedStats = _(boardStats)
            .sortBy(['iterations']).reverse()
            .groupBy('type')
            .mapValues((type) => _(type)
                .groupBy('period')
                // .mapValues((period) => _.take(period, 100))
                .value()
            )
            .value()
        ;
        return groupedStats;
        // return boards;
    }

}
