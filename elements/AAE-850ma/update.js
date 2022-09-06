function(instance, properties, context) {
    window.appState = window.appState || {};
    const appState = window.appState;
	const name = properties.name;
    function state(value){
        const isAFunction = typeof value === 'function';
        const dom = instance.canvas[0];
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
}