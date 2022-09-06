
function(properties, context) {
    const fun = new Function("state",properties.code);
    const state = window.appState;
    fun.call(this,state);
}
