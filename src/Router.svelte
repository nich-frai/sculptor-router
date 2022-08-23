<script lang="ts">
  import { match } from "path-to-regexp";

  import { getContext, onMount, setContext } from "svelte";
  import { writable } from "svelte/store";
  import { RouterController } from "./router.controller";
  import type { IRouterStorage } from "./storage/router_storage.type";

  export let name: string | undefined = undefined;
  export let root: boolean = false;
  export let path: string | undefined = undefined;
  export let storage: IRouterStorage | undefined = undefined;

  const visible = writable(false);
  const parentRouter = getContext<RouterController>("router");
  const hasParentRouter = parentRouter != null;
  const isRoot = root !== true ? !hasParentRouter : true;
  const controller = new RouterController({
    isRoot,
    name,
  });
  if (storage != null) {
    controller.setStorage(storage);
  }

  let routerRoot: HTMLDivElement;

  setContext("router", controller);

  function bindToParentRouter() {
    if (path == null) {
      console.warn(
        "[Router] A nested router was mounted whithout a path and will ALWAYS be visible",
      );
    }

    const normalizedPath = path ?? "/";
    const pathMatcher = match(
      normalizedPath.endsWith("/") ? normalizedPath + "(.*)" : normalizedPath + "/(.*)",
    ); // catch all subroutes! path-to-regexp

    parentRouter.addRoute({
      path: normalizedPath,
      matcher: pathMatcher,
      activate(state) {
				console.log('[Router] Parent sent: activate!');
        // toggle on "visibility"
        visible.update(() => true);
        // inherit state!
        controller.setInheritedState(state);
        // update its own routes visibility!
        controller.update();
      },
      deactivate() {
        visible.update(() => false);
      },
    });
  }

  // If its not it shall listen to its parent router "state changes" to enable/disable its visibility
  if (!isRoot && parentRouter != null) {
    bindToParentRouter();
  }

  onMount(() => {
    // if is a root router, it shall ALWAYS be visible
    if (isRoot) {
      visible.update(() => true);
    }

    controller.initialize(routerRoot);

    return controller.destroy.bind(controller);
  });
</script>

{#if $visible}
  <div class="router" bind:this={routerRoot} data-router-name={name}>
    <slot />
  </div>
{/if}
