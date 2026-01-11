<script lang="ts">
    import { onMount } from "svelte";
    import type { ScreenSize } from "$lib/types";

    export let size: ScreenSize;

    let mql: MediaQueryList;
    let mqlListener: (this: MediaQueryList, ev: MediaQueryListEvent) => any;
    let matches = false;

    onMount(() => {
        addNewListener(size);
        matches = matchMaxWidth(size).matches;

        return () => {
            removeActiveListener();
        };
    });

    function matchMaxWidth(size: ScreenSize): MediaQueryList {
        return window.matchMedia(`(max-width: ${size}px)`);
    }

    function addNewListener(size: ScreenSize) {
        mql = matchMaxWidth(size);

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
