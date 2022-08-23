import type { Writable } from "svelte/store";
import type { IRouterState } from "../router.controller";
import type { IRouterStorage } from "./router_storage.type";

export class HashStorage implements IRouterStorage {

	#store?: Writable<IRouterState>;

	#lastHashApplied: string | undefined = undefined;

	constructor(options?: IHashStorageOptions) {
		this.onHashChange = this.onHashChange.bind(this);
	}

	setRouterStateStore(store: Writable<IRouterState>): void {
		this.#store = store;
	}

	getRouterStateStore(): Writable<IRouterState> {
		if (this.#store == null) throw new Error("Trying to get the state store before initializing it!");
		return this.#store!;
	}

	/**
	 * Update Store
	 * ------------
	 * Updates the store using the current URL hash  
	 * The hash will be parsed as a pathname + querystring (excluding the hashbang "#/")  
	 * The pathname wil be used as the store path and the querystring as the store state
	 * 
	 * @example // current url: "#/example/path?param1=a&param2=b" 
	 * const state = { path : "example/path", state: { param1 : "a", param2 : "b"} }
	 */
	updateStore() {

		this.#lastHashApplied = window.location.hash;

		// load hash state
		const hashString = window.location.hash.trim().replace(/^#\//, '');

		const hasQueryString = hashString.indexOf('?') >= 0;
		const state = {};
		let path = hashString;

		// If hash string has query params, process it!
		if (hasQueryString) {
			let qs = path.substring(path.indexOf('?'));
			path = path.substring(0, - (qs.length - 1));
			console.debug('Hash Router:', hashString, path, qs);
		}

		console.debug('Hash Router: new state!', hashString, path, state);

		// finally update the store
		this.getRouterStateStore().update(() => ({ path, state }));
	}

	/**
	 * Update Storage
	 * --------------
	 * Changes the hash based on the current router state  
	 * The path will be used as a string after "#/" and the state will be serialized to a querystring using URLSearchParams
	 * 
	 * @example // current state : { path : "example/path", state: { param1 : "a", param2 : "b"} }
	 * const newHash = "#/example/path?param1=a&param2=b"
	 */
	updateStorage(): void {

	}

	/**
	 * On hash change event check if path + state is the same,
	 * if they are, ignore
	 * @param ev 
	 */
	onHashChange(ev: HashChangeEvent) {
		const newHash = window.location.hash;
		if (this.#lastHashApplied === newHash) {
			console.debug('Hash Storage: Hash already applied, noop');
			return;
		}
		this.updateStore();
	}

	initialize(): void {
		this.updateStore();

		// bind to event
		window.addEventListener('hashchange', this.onHashChange);
	}

	destroy(): void {
		window.removeEventListener('hashchange', this.onHashChange);
	}

}

export interface IHashStorageOptions {

}