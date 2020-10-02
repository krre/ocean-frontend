<script lang="ts">
    import * as consts from "consts";
    export let code: string;
    export let initCode = consts.UserAccount;
    let selected;

    $: {
        code = selected ? selected.code : consts.UserAccount;
    }

    let modes = [
        {
            code: consts.UserAccount,
            name: consts.AccountModeNames[consts.UserAccount],
            current: initCode === consts.UserAccount
        },
        {
            code: consts.ConspiratorAccount,
            name: consts.AccountModeNames[consts.ConspiratorAccount],
            current: initCode === consts.ConspiratorAccount
        }
    ];
</script>

Тип учётной записи:
<select bind:value={selected}>
    {#each modes as mode}
        <option value={mode} selected={mode.current}>{mode.name}</option>
    {/each}
</select>
