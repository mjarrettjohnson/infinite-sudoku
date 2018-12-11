import React, { Component } from 'react';
import { interval, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Board } from '../board/board';
import { Padding } from '../padding/padding';
import '../../App.css';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {
  init,
  fillBoard,
  convertCellsToRows,
  isFinished
} from '../../solver/solver';

export class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      solver: init(),
      isRunning: true,
      isCompleted: false,
      destroyed: new Subject()
    };
    this.startSolving();
  }

  componentDidUnmount() {
    this.state.destroyed.next();
    this.state.destroyed.complete();
  }

  reset() {
    this.setState(
      { isComplete: false, solver: init(), destroyed: new Subject() },
      this.startSolving
    );
  }

  loadBoard() {
    this.setState({ rows: fillBoard(this.state.rows) });
  }

  startSolving() {
    const subscription = interval(100)
      .pipe(
        takeUntil(this.state.destroyed),
        filter(() => this.state.isRunning)
      )
      .subscribe(() => {
        const update = this.state.solver.next().value;

        if (isFinished(update)) {
          this.setState({ rows: convertCellsToRows(update) }, () => {
            subscription.unsubscribe();
            setTimeout(() => this.reset(), 1000);
          });
        } else {
          this.setState({ rows: convertCellsToRows(update) });
        }
      });
  }
  step() {
    const update = this.state.solver.next().value;

    if (this.state.isComplete) {
      return this.reset();
    }

    let isComplete = false;
    if (isFinished(update)) {
      this.state.destroyed.next();
      isComplete = true;
    }

    this.setState({ isComplete, rows: convertCellsToRows(update) });
  }

  pause() {
    this.setState({ ...this.state, isRunning: false });
  }

  resume() {
    this.setState({ ...this.state, isRunning: true });
  }
  getButton() {
    return this.state.isRunning ? (
      <button className="btn" onClick={() => this.pause()}>
        Pause
      </button>
    ) : (
      <button className="btn" onClick={() => this.resume()}>
        Resume
      </button>
    );
  }

  getStepper() {
    return this.state.isRunning ? (
      ''
    ) : (
      <button className="btn" onClick={() => this.step()}>
        Step
      </button>
    );
  }

  render() {
    if (!this.state.rows.length)
      return (
        <div className="col">
          <h1 className="display-1">No Board</h1>
          {/* <div className="row justify-content-center">
            <div className="col-2">
              <button className="btn" onClick={() => this.step()}>
                start
              </button>
            </div>
          </div> */}
        </div>
      );
    return (
      <div className="col">
        {Padding(Board, { rows: this.state.rows })}
        <div className="row justify-content-center">
          <div className="col-3">
            {/* {this.getButton()}
            {this.getStepper()} */}
          </div>
        </div>
      </div>
    );
  }
}
