export class RouterController {

	#isRoot : boolean;
	#name? : string;
	#routerRootEl?: HTMLDivElement;

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
}

export interface TRouterControllerOptions {
	isRoot?: boolean;
	name?: string;
}

export interface IRouterState {
	path : string;
	state : Record<string, unknown>;
}