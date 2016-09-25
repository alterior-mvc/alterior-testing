= Alterior Testing

Provides a thin shim above [`mocha`](https://mochajs.org/) and [`supertest`](https://github.com/visionmedia/supertest) that simplifies testing apps using [`alterior`](https://github.com/alterior-mvc/alterior).
Tries to remain familiar to existing mocha users while reducing boilerplate and making testing more natural.   

```typescript
import { teststrap } from 'teststrap';
import { App } from './app.ts';

teststrap(App);

describe("/people", () => {
	it("should produce a list of people", 
		app => app.get('/people')
			.expect(200, <any>[])
	);

	it("should allow you to add a person", 
		app => app.put('/people')
			.send({id: 123, name: 'Santa'})
			.expect(201)
	);

	it("should show you a person after they have been added", 
		app => Promise.resolve()
			.then(() => app.put('/people').send({id: 123, name: 'Santa'})
				.expect(201, <any>[])
			)
			.then(() => app.get('/people')
				.expect(200, <any>[{ id: 123, name: 'Santa' }])
			)
	);
});
```