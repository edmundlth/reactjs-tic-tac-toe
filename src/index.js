import React from "react";
import ReactDOM from 'react-dom';
import "./index.css";
import {arraysEqual, Board} from "./components";

if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.numRow = props.numRow;
        this.numCol = props.numCol;
        this.freshState = {
            history: [Array(this.numRow * this.numCol).fill(null)],
            xIsNext: true,
        };
        this.state = JSON.parse(JSON.stringify(this.freshState));  // deep copy
    }

    handleClick(i) {
        const history = this.state.history.slice();
        const squares = history.last().slice();
        if (this.getWinner() || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([squares]),
            xIsNext: !this.state.xIsNext,
        });
        // console.log(JSON.stringify(this.state));
    }

    getWinner() {
        if (this.checkWin('X')) {
            return 'X'
        } else if (this.checkWin('O')) {
            return 'O'
        } else {
            return null
        }
    }

    checkWin(symbol) {
        if (this._checkArray(this._getDiag(false), symbol) || this._checkArray(this._getDiag(true), symbol)) {
            return true
        }

        for (let i = 0; i < this.numRow; i++) {
            if (this._checkArray(this._getRow(i), symbol)) {
                return true
            }
        }

        for (let i = 0; i < this.numCol; i++) {
            if (this._checkArray(this._getCol(i), symbol)) {
                return true
            }
        }
        return false
    }

    _getRow(rowIndex) {
        let output = [];
        let cellIndex;
        for (let j = 0; j < this.numCol; j++) {
            cellIndex = rowIndex * this.numCol + j;
            output.push(this.state.history.last()[cellIndex]);
        }
        return output
    }

    _getCol(colIndex) {
        let output = [];
        for (let cellIndex = colIndex; cellIndex < this.numRow * this.numCol; cellIndex += this.numCol) {
            output.push(this.state.history.last()[cellIndex]);
        }
        return output
    }

    _getDiag(off=false) {
        let offset = off ? -1 : 1;
        let output = [];
        for (let i = off ? this.numCol - 1 : 0; i < this.numCol * this.numRow + offset; i += this.numCol + offset) {
            output.push(this.state.history.last()[i])
        }
        return output
    }

    _checkArray(array, symbol) {
        return arraysEqual(array, Array(array.length).fill(symbol))
    }

    undo() {
        if (this.state.history.length <= 1) {
            return
        }
        let history = this.state.history.slice();
        history.pop();
        this.setState({
            history: history,
            xIsNext: !this.state.xIsNext
        });
    }

    render() {
        let status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
        const winner = this.getWinner();
        if (winner != null) {
            status = `Winner: ${winner}`
        }
        return (
            <div className="game">
                <div className={"game-board"}>
                    <Board
                        numRow={this.numRow}
                        numCol={this.numCol}
                        boardState={this.state.history.last()}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>

                <div className={"game-info"}>
                    <div className={"status"}>{status}</div>

                    <button
                    className={"refesh-button"}
                    onClick={() => this.setState(JSON.parse(JSON.stringify(this.freshState)))}
                    >
                    Restart
                    </button>

                    <button
                        className={"undo-button"}
                        onClick={() => this.undo()}
                    >
                        Undo
                    </button>
                </div>
            </div>
        )
    }
}


class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {date: new Date()};
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {
        return (
            <p>
                Time: {this.state.date.toLocaleTimeString()}
            </p>
        )
    }
}
// ========================================

ReactDOM.render(
    (
        <div>
            <Clock/>
            <Game numRow={4} numCol={4}/>
        </div>
        ),
  document.getElementById('root')
);
