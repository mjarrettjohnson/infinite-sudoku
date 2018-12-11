import React from 'react';
import './padding.css';

export function Padding(Component, props) {
  return (
    <div className="padding">
      <Component {...props} />
    </div>
  );
}
