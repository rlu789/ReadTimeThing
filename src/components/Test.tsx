import * as React from "react";

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