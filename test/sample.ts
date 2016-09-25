import { AppOptions, Controller, Get, Put, Delete, Response } from '@alterior/core';
import { teststrap, it } from '../lib/teststrap';
import * as bodyParser from 'body-parser';

@Controller()
class SampleController {
	@Get('/simple')
	simpleGet() {
		return {
			success: true,
			message: "Simple GET is a win"
		};
	}
}

interface FooItem {
	id: string;
	name: string;
}

@Controller()
class PeopleController {

	private store = [];

	@Get('/people')
	getAll() {
		return this.store;
	}

	@Put('/people')
	create(body : FooItem) {
		this.store.push(body);
		return Response.created(`/people/${body.id}`, body);
	}

	@Put('/people/:id')
	update(id : string, body : FooItem) {
		this.store = this.store.map(x =>  x.id == id ? body : x);
		return body;
	}

	@Delete('/people/:id')
	delete(id : string, body : FooItem) {
		this.store = this.store.filter(x =>  x.id != id);
		return { message: "Deleted" };
	}
}

@AppOptions({
	middleware: [bodyParser.json()]
})
class App { 
}

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