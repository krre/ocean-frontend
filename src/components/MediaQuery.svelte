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
        const query = `(max-width: ${size}px)`;
        mql = window.matchMedia(query);
        mqlListener = (v) => (matches = v.matches);
        mql.addListener(mqlListener);
        matches = mql.matches;
    }

    function removeActiveListener() {
        if (mql && mqlListener) {
            mql.removeListener(mqlListener);
        }
    }
</script>

<slot {matches} />
