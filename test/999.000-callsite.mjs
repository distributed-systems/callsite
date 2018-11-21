import section from '../es-modules/distributed-systems/section-tests/1.0.0+/index.mjs';
import assert from 'assert';
import Callsite from '../index.mjs';



section('Callsite', (section) => {
    section.test('Instantiating the class', async () => {
        new Callsite();
    });


    section.test('getStack', async () => {
        const callsite = new Callsite();
        const frames = callsite.getStack();

        assert.equal(frames.length, 1);
        assert.equal(frames[0].name, 'section.test');
    });



    section.test('getStack with a custom frame', async() => {
        const callsite = new Callsite();

        const x = () => {
            return callsite.getStack({
                fn: x
            });
        };

        const y = () => x();
        const frames = y();

        assert.equal(frames.length, 1);
        assert.equal(frames[0].name, 'y');
    });


    section.test('getStack, slice', async() => {
        const callsite = new Callsite();

        const x = () => {
            return callsite.getStack({
                slice: 1
            });
        };

        const y = () => x();
        const frames = y();

        assert.equal(frames.length, 0);
    });


    section.test('getStack, limit', async() => {
        const callsite = new Callsite();
        const frames = callsite.getStack({ limit: 1 });

        assert.equal(frames.length, 1);
        assert.equal(frames[0].name, 'section.test');
    });


    section.test('getStack using an existing error', async () => {
        const callsite = new Callsite();

        const a = () => new Error('test');
        const b = () => a();
        const c = () => b();
        const d = () => c();


        const err = d();
        const frames = callsite.getStack({ err });

        assert.equal(frames.length, 8);
        assert.equal(frames[0].name, 'a');
    });


    section.test('getStack using an existing error and previously accessed stack property', async () => {
        const callsite = new Callsite();

        const a = () => new Error('test');
        const b = () => a();
        const c = () => b();
        const d = () => c();

        const err = d();
        const stringifyStack = err.stack;
        const frames = callsite.getStack({ err });
        

        assert.equal(frames.length, 8);
        assert.equal(frames[0].name, 'a');
    });
});