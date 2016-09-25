import { bootstrap, ApplicationOptions, ApplicationInstance } from '@alterior/core';
import * as supertest from 'supertest';
import { Provider } from '@angular/core';
import * as express from 'express';

/**
 * Represents an application under test
 */
export class TestApplicationInstance extends ApplicationInstance {
	constructor() {
		super();
		let testApp : TestApplicationInstance = null;

	}

	bind(app, express : express.Application, port : number) {
		super.bind(app, express, port);
		this.supertest = supertest(express);
	}

	private supertest : supertest.SuperTest<supertest.Test>;
	
	get given(): supertest.SuperTest<supertest.Test> {
		return this.supertest;
	}

	public get(url : string) { return this.supertest.get(url); }
	public post(url : string)  { return this.supertest.post(url); }
	public del(url : string)  { return this.supertest.del(url); }
	public delete(url : string)  { return this.supertest.del(url); }
	public put(url : string)  { return this.supertest.put(url); }
	public patch(url : string)  { return this.supertest.patch(url); }
	public options(url : string)  { return this.supertest.options(url); }
}

let mochaIt = global['it'];
let targetApplicationClass = null;

export function teststrap(appClass : Function) {
	targetApplicationClass = appClass;
}

export function it(story : string, callback : (app : TestApplicationInstance) => (Promise<any> | void));
export function it(story : string, providers : Provider[], callback : (app : TestApplicationInstance) => (Promise<any> | void));
export function it(story : string, param2, param3?) {

	// Resolve our real parameters

	let providers : Provider[] = param3 === undefined ? [] : param2;
	let callback : (app: ApplicationInstance) => Promise<any> = param3 === undefined ? param2 : param3;
	
	// Let's test

	let appClass = targetApplicationClass;

	mochaIt(story, done => {
		testboot(appClass).then(app => {
			try {
				let test = callback(app);

				if (test === undefined) {
					done();
					return;
				}

				if (test['end']) {
					test['end']((err, res) => {
						if (err)
							done(err);
						else
							done();
					});
				} else {
					test.then(() => done())
						.catch(e => done(e));
				}
			} catch (e) {
				done(e);
			}
		});
	});
}

/**
 * Provide a fully-booted test version of your application
 */
export function testboot(appClass, providers? : Provider[], options? : ApplicationOptions): Promise<TestApplicationInstance> {

	let defaultOptions = {
		port: 10001,
		silent: true,
		autostart: false
	};
	let finalOptions = {};
	providers = providers || [];

	// Fill our final options

	for (let key in defaultOptions)
		finalOptions[key] = defaultOptions[key];

	for (let key in options)
		finalOptions[key] = options[key];

	providers.push({provide: ApplicationInstance, useClass: TestApplicationInstance});

	return <Promise<TestApplicationInstance>> 
		bootstrap(appClass, providers, finalOptions);
}