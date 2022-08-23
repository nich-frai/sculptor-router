<script lang="ts">
  import { getContext, onMount } from "svelte";
  import type { IRouteActivationParams, RouterController } from "./router.controller";
  import { writable } from "svelte/store";
	import { match } from 'path-to-regexp';

  export let path: string;

	const pathMatcher = match(path);

  const visibile = writable(false);
  const router = getContext<RouterController>("router");
	let state : IRouteActivationParams | undefined;

  onMount(() => {
		router.addRoute({
			path : path.startsWith('/') ? path : '/' + path,
			matcher : pathMatcher,
			activate(activationState) {
				visibile.update(() => true);
				state = activationState;
			},
			deactivate() {
				visibile.update(() => false);
				state  = undefined;
			}
		});

	});
</script>

{#if visibile}
  <div class="route">
    <slot {...state}/>
  </div>
{/if}

<style>
  .route {
    display: contents;
  }
</style>
