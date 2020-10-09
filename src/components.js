import React from "react";

export function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function Square(props) {
    return (
        <button
            className={"square"}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

export class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.boardState[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderRow(numCell, startVal) {
        let cells = [];
        for (let i = 0; i < numCell; i++) {
            cells.push(this.renderSquare(startVal + i));
        }
        return (
            <div className={"board-row"}>
                {cells}
            </div>
        )
    }

    renderBoard(numRow, numCol) {
        let rows = [];
        for (let i = 0; i < numRow * numCol; i += numCol) {
            rows.push(this.renderRow(numCol, i))
        }
        return (
            <div className={"game-board"}>{rows}</div>
        )
    }

    render() {
        return (
            <div>
                {this.renderBoard(this.props.numRow, this.props.numCol)}
            </div>
        )
    }
}