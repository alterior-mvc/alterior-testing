# Alterior 2.x Testing

**NOTE: This library has been discontinued alongside the release of 
Alterior 3.0. It is still available for any developers still using Alterior 2.x but it should not be used in new projects. For an idiomatic alternative, please see [`razmin`](https://github.com/rezonant/razmin) and the [`teststrap()`](https://github.com/alterior-mvc/alterior/blob/master/packages/web-server/README.md#testing) function included in [`@alterior/web-server`](https://github.com/alterior-mvc/alterior/blob/master/packages/web-server/README.md)**

Provides a thin shim above [`mocha`](https://mochajs.org/) and [`supertest`](https://github.com/visionmedia/supertest) that simplifies testing apps using [`alterior`](https://github.com/alterior-mvc/alterior).
Tries to remain familiar to existing mocha users while reducing boilerplate and making testing more natural.   

```typescript
import { teststrap, it } from 'teststrap';
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