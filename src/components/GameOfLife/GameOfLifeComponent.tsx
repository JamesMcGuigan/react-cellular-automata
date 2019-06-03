import * as React                      from 'react';
import Grid                            from "../Grid/Grid";
import './GameOfLifeComponent.less';
import GameOfLifeReducers, { IConfig } from "./GameOfLifeReducers";

// interface IProps = any;

interface IState {
    shape:      [number, number];
    board:      number[][];
    rule:       number;
    speed:      number;
    iterations: number;
    running:    NodeJS.Timeout | undefined;
    config:     IConfig;
}

export default
class GameOfLifeComponent extends React.Component<{}, IState> {

    public constructor(props: any) {
        super(props);
        const shape: [number, number] = [30,50];
        this.state = {
            shape:      shape,
            board:      GameOfLifeReducers.resizeBoard(undefined, shape),
            rule:       3,
            speed:      1000,
            iterations: 0,
            running:    undefined,
            config:     {
                wrapping: false
            },
        };
    }
    
    public componentDidMount(): void {
        this._setRunning(true);
    }
    
    public componentWillUnmount(): void {
        this._setRunning(false);
    }
    
    public render(): React.ReactNode {
        return (
            <div className="GameOfLife">
                <h1>Conway's Game Of Life</h1>
                { this._renderControls() }
                <Grid data={this.state.board}
                      key={this.state.board.toString()}
                      onClick={this._onCellClick.bind(this)}
                />
                { this._renderStatus()
                }
            </div>
        );
    }
    
    protected _renderControls(): React.ReactNode {
        return (
        <form className="controls" onSubmit={(event) => event.preventDefault()}>
            <div>
                <button onClick={() => this._mapBoard(0 )}>Clear</button>
                <button onClick={() => this._mapBoard(0.2 )}>Randomise</button>
                <button onClick={() => this._centerBoard()}>Center</button>
            </div>
            <div>
                <label>Grid Size:</label>
                <input type="number"
                       value={this.state.shape[0]}
                       pattern="^\d*$"
                       title="X size"
                       onChange={ (event) => this._setShape([event.target.value, this.state.shape[1]]) }
                />
                x
                <input type="number"
                       value={this.state.shape[1]}
                       pattern="^\d*$"
                       title="Y size"
                       onChange={ (event) => this._setShape([this.state.shape[0], event.target.value]) }
                />
            </div>
            <div>
                <label>Rule:</label>
                <select value={this.state.rule}
                        title="Live when: neighbours == (rule || rule - cell) Rule 3 is Conway's Game of Life"
                        onChange={ (event) => this._setRule(+event.target.value) }
                >
                    {
                        Array.from({ length: 8 + 1 },(_value, index) => (
                            <option value={index} key={index}>{index}</option>
                        ))
                    }
                </select>
            </div>
            <div>
                <label>Wrap:</label>
                <input type="checkbox"
                       checked={this.state.config.wrapping}
                       onChange={(event) => this.setState({ config: { wrapping: event.target.checked } })}
                />
                
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
    
    protected _renderStatus(): React.ReactNode {
        return (
            <div className="status">
                <div>
                    <label>Iterations:</label>
                    <span>{ this.state.iterations }</span>
                </div>
            </div>
        );
    }
    
    protected _debounceRunning( timeout: number = 1000): void {
        if( this.state.running ) {
            clearInterval(this.state.running);
            setTimeout(() => this._setRunning( !!this.state.running ), timeout);
        }
    }
    
    protected _setRunning( isRunning: boolean ): void {
        if( this.state.running ) { clearInterval(this.state.running); }
        
        if( isRunning ) {
            const running = setInterval(this._nextInterval.bind(this), this.state.speed);
            this.setState({ running: running });
        } else {
            this.setState({ running: undefined });
        }
    }
    
    protected _nextInterval() {
        const nextBoard  = GameOfLifeReducers.nextBoard(
            this.state.board,
            this.state.rule,
            this.state.config
        );
        
        // Only increment iterations counter if board actually changes
        if( this.state.board.toString() !== nextBoard.toString() ) {
            const iterations = this.state.iterations + 1;
            this.setState({
                board:      nextBoard,
                iterations: iterations,
            });
        }
    }
    
    protected _setShape( shape: [number|string, number|string] ): void {
        const _shape = shape.map((value) => +value) as [number, number];        // cast to number
        if( _shape.some((value) => isNaN(+value) || value === 0) ) { return; }  // reject invalid inputs
        
        this.setState({
            shape: _shape,
            board: GameOfLifeReducers.resizeBoard(this.state.board, _shape)
        });
    }
    
    protected _setRule( rule: number ): void {
        if( isNaN(+rule) ) { return; }
        
        this.setState({
          rule: +rule,
        });
    }

    protected _onCellClick( value: number, coords: [ number, number ]): void {
        const newValue  = value > 0.5 ? 0 : 1;  // invert value
        const nextBoard = GameOfLifeReducers.setCell(this.state.board, [ coords[0], coords[1] ], newValue);
        this.setState({
            board: nextBoard
        });
        this._debounceRunning();  // stop board for a second
    }
    
    protected _mapBoard( value: number ): void {
        const nextBoard = ( value === 0 || value === 1 )
            ? GameOfLifeReducers.mapBoard(this.state.board, value)
            : GameOfLifeReducers.mapBoard(this.state.board, () => Number(Math.random() < value))
        ;
        this.setState({
            iterations: 0,
            board:      nextBoard,
        });
        this._debounceRunning();  // stop board for a second
    }
    
    protected _centerBoard(): void {
        const nextBoard = GameOfLifeReducers.centerBoard(this.state.board);
        this.setState({
            board: nextBoard
        });
        this._debounceRunning();  // stop board for a second
    }
}
