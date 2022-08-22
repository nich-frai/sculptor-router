import type { MatchFunction } from "path-to-regexp";

export class RouterController {

	#isRoot : boolean;
	#name? : string;
	#routerRootEl?: HTMLDivElement;

	#routes : IRoute[] = [];

	get isRoot() {
		return this.#isRoot;
	}

	get isNamed() {
		return this.#name != null;
	}

	get name() {
		return this.#name;
	}

	constructor(options? : TRouterControllerOptions) {
		this.#isRoot = options?.isRoot ?? false;
		this.#name = options?.name;
	}

	initialize(el : HTMLDivElement) {
		this.#routerRootEl = el;
	}

	destroy() {
		
	}

	addRoute(route : IRoute) {
		this.#routes.push(route);
		// TODO: check if there's a current state and update the route visibility if it matches!
	}
}

export interface TRouterControllerOptions {
	isRoot?: boolean;
	name?: string;
}

export interface IRouterState {
	path : string;
	state : Record<string, unknown>;
}

export interface IRouteActivationParams {
	path : string;
	state : Record<string, unknown>;
	urlParams : Record<string, string>;
}

export interface IRoute {
	path : string;
	matcher : MatchFunction;
	activate(state : IRouteActivationParams) : void;
	deactivate() : void;
}