import React from 'react';
import { Row } from '../row/row';

export const Board = props => {
  return (
    <div className="h-100">
      {props.rows.map((row, i) => {
        return <Row key={'row-' + i} row={row} />;
      })}
    </div>
  );
};
