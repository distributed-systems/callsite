import StackTrace from '../es-modules/distributed-systems/stack-trace/x/StackTrace.js';



export default class Callsite { 



    /**
     * Constructs the object.
     */
    constructor() {
        this.stackTrace = new StackTrace();
    }




    /**
    * returns structured stack frames
    *
    * @returns {array} stack
    */
    getStack({
        slice = 0,
        limit = 1,
        err,
        fn = this.getStack,
    } = {}) {
        const originalFunction = Error.prepareStackTrace;
        const originalLimit = Error.stackTraceLimit;
        const dontCapture = !!err;

        Error.stackTraceLimit = limit;
        Error.prepareStackTrace = (originalFunction, stack) => stack;

        err = err || new Error();

        // capture from a certain offset
        if (!dontCapture) Error.captureStackTrace(err, fn);

        // get structured frames
        const frames = this.stackTrace.getStack(err); 

        // revert
        Error.prepareStackTrace = originalFunction;
        Error.stackTraceLimit = originalLimit;
        
        // return the raw stack
        return frames.slice(slice);
    }
};
