import { Cell } from '../cell/cell';
import React from 'react';
import './row.css';

export function Row(props) {
  const cells = props.row.map(cell => {
    return <Cell key={'cell' + cell.x + cell.y} cell={cell} />;
  });

  return <div className="row align-items-center">{cells}</div>;
}
