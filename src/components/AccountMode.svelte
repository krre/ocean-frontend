<script lang="ts">
    import * as consts from "consts";
    export let code: string;
    export let initCode = consts.Account.User;
    let selected;

    $: {
        code = selected ? selected.code : consts.Account.User;
    }

    let modes = [
        {
            code: consts.Account.User,
            name: consts.Account.ModeNames[consts.Account.User],
            current: initCode === consts.Account.User,
        },
        {
            code: consts.Account.Conspirator,
            name: consts.Account.ModeNames[consts.Account.Conspirator],
            current: initCode === consts.Account.Conspirator,
        },
    ];
</script>

Тип учётной записи:
<select bind:value={selected}>
    {#each modes as mode}
        <option value={mode} selected={mode.current}>{mode.name}</option>
    {/each}
</select>
