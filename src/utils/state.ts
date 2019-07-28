class StateManager {
    private state: {[key: string]: any} = {};

    constructor() { }

    public set<T>(key: string, val: T){
        this.state[key] = val;
    }

    public get<T>(key: string){
        return <T>this.state[key];
    }
}

var stateManager = new StateManager();
export default stateManager;