<script lang="ts">
    import { onMount } from "svelte";
    import type { ScreenSize } from "types";

    export let size: ScreenSize;

    let mql: MediaQueryList;
    let mqlListener: (this: MediaQueryList, ev: MediaQueryListEvent) => any;
    let wasMounted = false;
    let matches = false;

    onMount(() => {
        wasMounted = true;
        return () => {
            removeActiveListener();
        };
    });

    $: {
        if (wasMounted) {
            removeActiveListener();
            addNewListener(size);
        }
    }

    function addNewListener(size: ScreenSize) {
        mql = window.matchMedia(`(max-width: ${size}px)`);

        mqlListener = (e) => {
            matches = e.matches;
        };

        mql.addEventListener("change", mqlListener);
    }

    function removeActiveListener() {
        if (mql && mqlListener) {
            mql.removeEventListener("change", mqlListener);
        }
    }
</script>

<slot {matches} />
