<script lang="ts">
  import { match } from "path-to-regexp";

  import { getContext, onMount, setContext } from "svelte";
  import { RouterController } from "./router.controller";

  export let name: string | undefined = undefined;
  export let root: boolean = false;
  export let path: string | undefined = undefined;

  const parentRouter = getContext<RouterController>("router");
  const hasParentRouter = parentRouter != null;
  const isRoot = root !== true ? (hasParentRouter ? false : true) : true;
  const controller = new RouterController({
    isRoot,
    name,
  });

  let routerRoot: HTMLDivElement;

  setContext("router", controller);

  onMount(() => {
    // if its not a root router assign itself as a "route" in parent container
    if (!isRoot && parentRouter != null) {

      if (path == null) {
        console.warn("[Router] A nested router was mounted whithout a path and will ALWAYS be visible");
      }

      let normalizedPath = path ?? "/";
      const pathMatcher = match(
        normalizedPath.endsWith("/") ? normalizedPath + "(.*)" : normalizedPath + "/(.*)",
      ); // catch all subroutes!

      parentRouter.addRoute({
        path: normalizedPath,
        matcher: pathMatcher,
        activate(state) {
          // TODO: activate router logic
        },
        deactivate() {
          // TODO: deactivate router logic
        },
      });
    }

    controller.initialize(routerRoot);
    return controller.destroy;
  });
</script>

<div class="router" bind:this={routerRoot} data-router-name={name}>
  <slot />
</div>
