<script>
    import * as consts from "consts.js";
    export let code;
    let selected;

    $: {
        code = selected ? selected.code : consts.UserAccount;
    }

    let modes = [
        {
            code: consts.UserAccount,
            name: "Пользователь"
        },
        {
            code: consts.ConspiratorAccount,
            name: "Конспиролог"
        }
    ];
</script>

Тип учётной записи:
<select bind:value={selected}>
    {#each modes as mode}
        <option value={mode}>{mode.name}</option>
    {/each}
</select>
