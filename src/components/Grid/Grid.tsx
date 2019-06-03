// DOCS: https://js.tensorflow.org/api/latest/#Tensors

import * as React                                from 'react';
import { isArrayArrayOfNumber, isArrayOfNumber } from "../../../types/functions";
import './Grid.less';

interface IProps {
    data:     Array<number> | Array<Array<number>>;
    onClick?: (value: number, [indexX, indexY]: [number, number]) => void;
}

interface IState {
    data: Array<Array<number>>;
}

export default class Grid extends React.Component<IProps, IState> {

    public constructor(props: any) {
        super(props);

        this.state = {
            data: isArrayOfNumber(this.props.data) ? [ this.props.data ] : this.props.data
        };
    }

    public render(): React.ReactNode {
        return (
            <React.Fragment>
                <div className="Grid">
                    { this.renderRows( this.state.data ) }
                </div>
            </React.Fragment>
        );
    }

    public renderRows( row: IProps['data'], indexX: number = 0 ): React.ReactNode {
        if( isArrayArrayOfNumber(row) ) {
            return row.map((value, index) => this.renderRows(value, index));
        }
        return (
            <div className="row" key={indexX}>
                { row.map((value, indexY) => (
                    <div className="cell"
                         style={{ background: this.renderRGB(value) }}
                         key={indexY}
                         title={String(value)}
                         onClick={() => this.props.onClick && this.props.onClick(value, [indexX, indexY])}
                    />
                ))}
            </div>
        );
    }

    public renderRGB( grayscale: number ): string {
        const rgb = 255 - Math.round( Math.abs(grayscale) * 255 );
        return `rgb(${rgb},${rgb},${rgb})`;
    }

}
