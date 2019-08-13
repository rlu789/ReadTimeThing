import * as React from "react";
import $ = require('jquery');

interface ChessProps {
}
interface ChessState {
}

export class Chess extends React.Component<ChessProps, ChessState> {
    constructor(props: ChessProps) {
        super(props);
    }

    render() {
        return (
            <div className="container">
                nice
            </div>
        );
    }
}