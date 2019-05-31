import Cell from './Cell';

export interface IRule {
    [Cell.Live]: {
        0: Cell;
        1: Cell;
        2: Cell;
        3: Cell;
        4: Cell;
        5: Cell;
        6: Cell;
        7: Cell;
        8: Cell;
    };
    [Cell.Dead]: {
        0: Cell;
        1: Cell;
        2: Cell;
        3: Cell;
        4: Cell;
        5: Cell;
        6: Cell;
        7: Cell;
        8: Cell;
    };
}
