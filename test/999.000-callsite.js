import section from '../es-modules/distributed-systems/section-tests/3.0.0+/index.js';
import assert from 'assert';
import Callsite from '../Callsite.js';



section('Callsite', (section) => {
    section.test('Instantiating the class', async () => {
        new Callsite();
    });


    section.test('getStack', async () => {
        const callsite = new Callsite();
        const frames = callsite.getStack();

        assert.equal(frames.length, 1);
        //assert.equal(frames[0].name, 'section.test');
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
       // assert.equal(frames[0].name, 'section.test');
    });


    section.test('getStack using an existing error', async () => {
        const callsite = new Callsite();

        const a = () => new Error('test');
        const b = () => a();
        const c = () => b();
        const d = () => c();


        const err = d();
        const frames = callsite.getStack({ err });

        assert.equal(frames.length, 10);
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
        

        assert.equal(frames.length, 10);
        assert.equal(frames[0].name, 'a');
    });

    section.test('getStack using a custom built error object', async () => {
        const callsite = new Callsite();

        const err = {
            name: 'Error',
            message: "Failed to resolve vraiable 'SERVICE_REGISTRY_DB_PASSWORD' on the config key 'database.hosts.0.password'!",
            stack: `Error: Failed to resolve vraiable 'SERVICE_REGISTRY_DB_PASSWORD' on the config key 'database.hosts.0.password
    at RainbowConfig.replaceSecrets (/node_modules/@rainbow-industries/rainbow-config/npm/src/RainbowConfig.js:133:23)
    at RainbowConfig.replaceSecrets (/node_modules/@rainbow-industries/rainbow-config/npm/src/RainbowConfig.js:97:22)
    at RainbowConfig.replaceSecrets (/node_modules/@rainbow-industries/rainbow-config/npm/src/RainbowConfig.js:97:22)
    at RainbowConfig.replaceSecrets (/node_modules/@rainbow-industries/rainbow-config/npm/src/RainbowConfig.js:97:22)
    at RainbowConfig.replaceSecrets (/node_modules/@rainbow-industries/rainbow-config/npm/src/RainbowConfig.js:97:22)
    at RainbowConfig.load (/node_modules/@rainbow-industries/rainbow-config/npm/src/RainbowConfig.js:87:14)
    at async ServiceRegistry.loadConfig (/node_modules/@infect/rda-service/src/Service.js:317:9)
    at async ServiceRegistry.initialize (/node_modules/@infect/rda-service/src/Service.js:117:13)
    at async ServiceRegistry.load (/node_modules/@infect/rda-service-registry/src/Service.js:33:9)
    at async ChildProcess.startService (/src/ChildProcess.js:56:9)`,
          };

        const frames = callsite.getStack({ err });
        
        assert.equal(frames.length, 10);
        assert.equal(frames[0].name, 'RainbowConfig.replaceSecrets');
    });
});