<script lang="ts">
  import { getContext, onMount, setContext } from "svelte";
  import { RouterController } from "./router_controller";

	export let name : string | undefined = undefined;
	export let root : boolean = false;

	let hasParentRouter = getContext('router') != null;	
	let isRoot = root !== true 
		? hasParentRouter 
			? false : true 
		: true;
  
	let routerRoot: HTMLDivElement;
  
	const controller = new RouterController({
		isRoot,
		name
	});

  setContext("router", controller);

  onMount(() => {
    controller.initialize(routerRoot);
    return controller.destroy;
  });

</script>

<div class="router" bind:this={routerRoot} data-router-name={name} >
	<slot></slot>
</div>
