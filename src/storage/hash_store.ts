import type { Writable } from "svelte/store";
import type { IRouterState } from "../router.controller";
import type { IRouterStorage } from "./router_storage.type";

export class HashStorage implements IRouterStorage {

	#store?: Writable<IRouterState>;
	
	#listenToHashEvents : boolean = false;

	constructor(options? : IHashStorageOptions) {}

	setRouterStateStore(store: Writable<IRouterState>): void {
		this.#store = store;
	}

	getRouterStateStore(): Writable<IRouterState> {
		if(this.#store == null) throw new Error("Trying to get the state store before initializing it!");
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

}

export interface IHashStorageOptions {

}