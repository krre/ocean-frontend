<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    let message;

    function confirm() {
        dispatch("confirm");
    }

    function cancel() {
        dispatch("cancel");
    }
</script>

<button on:click={confirm}>Подтвердить удаление</button>
<button on:click={cancel}>Отменить</button>
