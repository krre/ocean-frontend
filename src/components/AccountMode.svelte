<script>
    import * as consts from "consts.js";
    export let code;
    export let initCode = consts.UserAccount;
    let selected;

    $: {
        code = selected ? selected.code : consts.UserAccount;
    }

    let modes = [
        {
            code: consts.UserAccount,
            name: "Пользователь",
            current: initCode === consts.UserAccount ? "true" : ""
        },
        {
            code: consts.ConspiratorAccount,
            name: "Конспиролог",
            current: initCode === consts.ConspiratorAccount ? "true" : ""
        }
    ];
</script>

Тип учётной записи:
<select bind:value={selected}>
    {#each modes as mode}
        <option value={mode} selected={mode.current}>{mode.name}</option>
    {/each}
</select>
