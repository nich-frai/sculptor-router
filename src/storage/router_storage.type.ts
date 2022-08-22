import type { IRouterState } from '../router.controller';
import type { Writable } from 'svelte/store';

export interface IRouterStorage {

	setRouterStateStore(store : Writable<IRouterState>) : void;
	getRouterStateStore() : Writable<IRouterState>;
	
	updateStore() : void;
	updateStorage() : void;

}