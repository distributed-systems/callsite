# Callsite

Get structured callsite information

If you just need structured stack-frames, please use the [Stack-Trace](https://github.com/distributed-systems/stack-trace) library


ESM:
```javascript
import Callsite from 'es-modules/distributed-systems/callsite/2.0.0+/index.mjs';
```


NPM:
```javascript
import Callsite from '@distributed-systems/callsite';

```


### API

**Stack Frame format returned from the library**
```javascript
[{
    name: 'new Cls',
    source: 'stack-trace/test/200.000-stack-parser.mjs',
    line: 52,
    column: 27 
}]
```

**Get Callsite Info**
```javascript
const cs = new Callsite();

// get callsite info
const callsite info = cs.getStack(); 

```


**Get Callsite Info, more frames**
```javascript
const cs = new Callsite();

// get callsite info
const callsite info = cs.getStack({
    limit: 100,
}); 

```


**Get Callsite Info, from a custom error**
```javascript
const cs = new Callsite();
const err = new Error('my custom error');

// get callsite info
const callsite info = cs.getStack({
    limit: 100,
    err,
});

```