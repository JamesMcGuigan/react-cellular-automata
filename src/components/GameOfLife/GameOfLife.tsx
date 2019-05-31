import * as React from 'react';
import Board from "./Board";
import Grid from "../Grid/Grid";


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

    public setShape(index: number, event: React.ChangeEvent<HTMLInputElement>): void {
        const shape = Array.from(this.state.shape)
            .splice(index, 1, parseInt(event.target.value, 10))
        ;
        this.setState({ shape });
    }

    public setRunning( isRunning: boolean ): void {
        if( isRunning === false ) {
            if( this.state.running ) {
                clearInterval(this.state.running);
            }
            this.setState({ running: undefined });
        }
        if( isRunning === true && !this.state.running ) {
            const running: NodeJS.Timeout = setInterval(this.nextInterval, this.state.speed);
            this.setState({ running });
        }
    }

    public nextInterval() {
        this.setState({
            board: this.state.board.nextIteration()
        });
    }

    public render(): React.ReactNode {
        return (
            <div className="GameOfLife">
                <h1>Conway's Game Of Life</h1>
                { this.renderControls() }
                <Grid data={this.state.board.data}/>
            </div>
        );
    }

    public renderControls(): React.ReactNode {
        return (
            <form className="controls">
                <div>
                    <label>Grid Size:</label>
                    <input type="number"
                           value={this.state.shape[0]}
                           onChange={ this.setShape.bind(this,0) }
                    />
                    x
                    <input type="number"
                           value={this.state.shape[1]}
                           onChange={ this.setShape.bind(this,1) }
                    />
                </div>
                <div>
                    <label>Iterations:</label>
                    <input type="number" value={this.state.iterations.length} readOnly />
                </div>
                <div>
                    {
                        this.state.running
                            ? <button onClick={this.setRunning.bind(this,false)}>Stop</button>
                            : <button onClick={this.setRunning.bind(this,true )}>Start</button>
                    }
                </div>
            </form>
        );
    }
}
