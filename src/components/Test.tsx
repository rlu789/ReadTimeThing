import * as React from "react";
// import {
//     BrowserRouter as Router,
//     Route,
//     Link,
//     RouteComponentProps
//   } from "react-router-dom";

interface TestProps {

}
interface TestState {
}

export class Test extends React.Component<TestProps, TestState> {
    constructor(props: TestProps) {
        super(props);
        console.log(this.props)
    }
    render() {
        return (
            <div>test</div>
        );
    }
}