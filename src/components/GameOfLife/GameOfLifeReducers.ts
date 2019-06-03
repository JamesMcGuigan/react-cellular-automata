export interface IConfig {
    wrapping?: boolean;
}

export default
class GameOfLifeReducers {
    static next( board: number[][] ): number[][] {
        return board;
    }
    
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

}
