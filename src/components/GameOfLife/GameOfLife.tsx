import * as React from 'react';
import Board      from "./Board";
import Grid       from "../Grid/Grid";


// interface IProps = any;

interface IState {
    shape:      number[];
    board:      Board;
    iterations: Board[];
    speed:      number;
    running:    NodeJS.Timeout | undefined;
}

export default
class GameOfLife extends React.Component<{}, IState> {

    public constructor(props: any) {
        super(props);
        const shape      = [10,10];
        const board      = new Board(undefined, shape);
        const iterations = [];
        const speed      = 1000;
        const running    = undefined;

        this.state = { shape, board, iterations, speed, running };
    }

    protected _setShape( index: number, event: React.ChangeEvent<HTMLInputElement>): void {
        const shape = Array.from(this.state.shape)
            .splice(index, 1, parseInt(event.target.value, 10))
        ;
        this.setState({ shape });
    }

    protected _setRunning( isRunning: boolean ): void {
        if( isRunning === false ) {
            if( this.state.running ) {
                clearInterval(this.state.running);
            }
            this.setState({ running: undefined });
        }
        if( isRunning === true && !this.state.running ) {
            const running = setInterval(() => this._nextInterval(), this.state.speed);
            this.setState({ running: running });
        }
    }

    protected _nextInterval() {
        const nextBoard = this.state.board.nextIteration();
        this.setState({
            board:      nextBoard,
            iterations: [ ...this.state.iterations, this.state.board ]
        });
}

    protected _onClick( value: number, [indexX, indexY]: [number, number]): void {
        const newValue = value > 0.5 ? 0 : 1;  // invert value
        this.state.board.setCell(newValue, [indexX, indexY]);
        this.forceUpdate();  // board.setCell() doesn't trigger rerender
    }

    public render(): React.ReactNode {
        return (
            <div className="GameOfLife">
                <h1>Conway's Game Of Life</h1>
                { this._renderControls() }
                <Grid data={this.state.board.data}
                      key={this.state.board.data.toString()}
                      onClick={this._onClick.bind(this)}
                />
            </div>
        );
    }

    protected _renderControls(): React.ReactNode {
        return (
            <form className="controls" onSubmit={(event) => event.preventDefault()}>
                <div>
                    <label>Grid Size:</label>
                    <input type="number"
                           value={this.state.shape[0]}
                           onChange={ this._setShape.bind(this, 0) }
                    />
                    x
                    <input type="number"
                           value={this.state.shape[1]}
                           onChange={ this._setShape.bind(this, 1) }
                    />
                </div>
                <div>
                    <label>Iterations:</label>
                    <input type="number" value={this.state.iterations.length} readOnly />
                </div>
                <div>
                    {
                        this.state.running
                            ? <button onClick={() => this._setRunning(false)}>Stop</button>
                            : <button onClick={() => this._setRunning(true )}>Start</button>
                    }
                </div>
            </form>
        );
    }
}
