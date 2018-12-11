import React, { Component } from 'react';
import './cell.css';

export function Cell(props) {
  const poss = '[' + props.cell.poss.join(', ') + ']';
  return (
    <div className={'col cell ' + getClassName(props)}>
      {props.cell.value || ''}
    </div>
  );
}

function getClassName(props) {
  if (props.cell.changed) return 'updated';
  if (props.cell.value) return 'filled ';
  return 'default';
}
