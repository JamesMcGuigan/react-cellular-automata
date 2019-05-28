// DOCS: https://js.tensorflow.org/api/latest/#Tensors

import * as React from 'react';
import * as tf from '@tensorflow/tfjs';

interface IGridProps {
    shape: [number] | [number, number];
    data?: tf.Tensor | tf.TensorLike;
}

interface IGridState {
    data: tf.Tensor;
}

export default class Grid extends React.Component<IGridProps, IGridState> {

    public constructor(props: any) {
        super(props);

        this.state = {
            data: this.castToTensor(props.data)
        };
    }

    castToTensor( data: tf.Tensor | tf.TensorLike ): tf.Tensor {
        // return tf.slice(data, 0, this.props.shape);
        //
        if( data instanceof tf.Tensor ) {
            return data.slice(0, this.props.shape);
        } else if( data ) {
            // return tf.tensor(data, this.props.shape);
            return tf.slice(data, 0, this.props.shape);
        } else {
            return tf.truncatedNormal(this.props.shape);
            // return tf.zeros(this.props.shape);
        }
    }

    public render(): React.ReactNode {
        return (
            <div className="grid">
                { this.renderRows( this.state.data ) }
            </div>
        );
    }

    public renderRows( data: tf.Tensor ): React.ReactNode {
        let rows = null;
        switch( this.props.shape.length ) {
            case 1:
                rows = this.renderRow( data.as1D().arraySync(), 0);
                break;
            case 2:
                rows = data.as2D(...this.props.shape).arraySync()
                    .map((cells, index) => this.renderRow(cells, index))
                ;
                break;
            default:
                console.error('render(): invalid this.props.shape: ', this.props.shape);
                break;
        }
        return rows;
    }

    public renderRow( cells: Array<number>, index: number ): React.ReactNode {
        return (
            <div className="row" key={index}>
                { cells.map((cell, index) => this.renderCell(cell, index)) }
            </div>
        );
    }

    public renderCell( value: number, index: number ): React.ReactNode {
        console.log('Grid.tsx:74:renderCell', 'this.props.shape', this.props.shape);

        return (
            <div className="cell"
                 style={{
                     display:    'inline-block',
                     width:      (100 / (this.props.shape[0] + 1)) + '%',
                     height:     '100%',
                     background: 'black',
                     opacity:    value
                 }}
                 key={index}
            >
                { value }
            </div>
        );
    }

}
