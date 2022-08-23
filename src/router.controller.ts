import type { MatchFunction } from "path-to-regexp";
import { writable, type Writable } from "svelte/store";
import type { IRouterStorage } from "./storage/router_storage.type";

export class RouterController {

	#isRoot : boolean;
	#name? : string;
	#routerRootEl?: HTMLDivElement;
	#inheritedState? : IRouterState;
	#storage?: IRouterStorage;
	#state : Writable<IRouterState> = writable({ path : "", state : {}});
	#unsubFromState : (() => void);
	#routes : IRoute[] = [];
	#initialized : boolean = false;

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

		this.#unsubFromState = this.#state.subscribe((state) => {
			// everytime the state updates, apply it, activating/deactivating the routes
			this.applyState(state);
		});
	}

	navigate(to : string, state? : Record<string, unknown>) {
		// update state
		this.#state.update(() => ({ path : to, state : state ?? {}}));
		// update storage, if not null
		this.#storage?.updateStorage();
	}

	initialize(el : HTMLDivElement) {
		this.#initialized = true;
		this.#routerRootEl = el;
		if(this.#storage != null) this.#storage.initialize();
	}

	destroy() {
		this.#unsubFromState();
		if(this.#storage != null) this.#storage.destroy();
	}

	addRoute(route : IRoute) {
		this.#routes.push(route);
		// TODO: check if there's a current state and update the route visibility if it matches!
		if(this.#initialized) {
			this.getState().subscribe((currentState) => {
				this.applyState(currentState, route);
			})();
		}
	}

	setInheritedState(state : IRouterState) {
		console.debug('[RouterController] Added inherited state!', state);
		this.#inheritedState =state;
	}

	getState() {
		return { subscribe : this.#state.subscribe };
	}

	private applyState(state : IRouterState, ...to : IRoute[]) {
		const routes = to.length === 0 ? this.#routes : to;
		const url = state.path.startsWith('/') ? state.path : '/' + state.path;
		routes.forEach((route) => {
			const isItAMatch = route.matcher(url);
			console.debug('[RouteController] Should activate?', state.path, route.path, isItAMatch);
			if(isItAMatch === false) {
				// it was not a match, deactivate
				route.deactivate();
				return; 
			}

			const urlParams = isItAMatch.params;
			route.activate({
				path : state.path,
				state : state.state,
				urlParams : urlParams as any
			})

		});
	}

	setStorage(storage : IRouterStorage) {
		this.#storage = storage;
		this.#storage.setRouterStateStore(this.#state);
	}

	update() {

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