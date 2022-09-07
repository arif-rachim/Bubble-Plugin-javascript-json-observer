function(instance, properties, context) {
    window.appState = window.appState || {};
    const appState = window.appState;
	const name = properties.name;
    const initFunction = properties.initialization;
    function state(value){
        const isAFunction = typeof value === 'function';
        const dom = instance.canvas;
        const bubbleInstance = dom.bubble_data.bubble_instance;
        const states = bubbleInstance._states;
        const statesKeys = Object.keys(states).filter(key => key.indexOf('custom.') === 0);
        const oldValue = statesKeys.reduce((result,stateKey) => {
            const cleanKey = stateKey.substring('custom.'.length,stateKey.length - 1);
            result[cleanKey] = states[stateKey]();
            return result;
        },{});
        let newValue = value;
        if(isAFunction){
            newValue = value(oldValue);
        }
        state.current = newValue;
        Object.keys(newValue).forEach(key => {
            const eventKey = 'custom.'+key.toLowerCase().split(' ').join('_')+'_';
            if(eventKey in states){
                states[eventKey].call(this,newValue[key])
            }
        })
        instance.triggerEvent('change');
    }
    state.current = null;
    if(name){
        appState[name] = state;
    }
    if(initFunction){
        const fun = new Function(initFunction);
        const result = fun.call();
        // due to some weird bug in bubble, this has to be invoked using timeout
        setTimeout(() => {
            state(result);            
        },1);
    }
}