<script context="module" lang="ts">
    import * as api from "api";
    import type { Session, Page } from "types";

    export async function preload(page: Page, _session: Session) {
        const { id } = page.params;
        const params: api.Forum.Topic.GetOne.Request = {
            id: +id,
        };

        const result = await api.Forum.Topic.GetOne.exec(params);
        const name = result.name;
        const sectionId = result.section_id;
        const userId = result.user_id;

        return { id, sectionId, name, userId };
    }
</script>

<script lang="ts">
    import { goto } from "@sapper/app";
    import type { User } from "types";
    import * as route from "route";
    import Frame from "../../../../components/Frame.svelte";
    import SessionHub from "../../../../components/SessionHub.svelte";

    const title = "Редактировать тему";

    export let id: number;
    export let sectionId: number;
    export let name: string;
    export let userId: number;

    let isAdmin = false;
    let isAnonym = true;
    let user: User;

    $: editable = isAdmin || (user && user.id === userId && !isAnonym);

    const action = async () => {
        const params: api.Forum.Topic.Update.Request = {
            id: +id,
            name: name,
        };

        await api.Forum.Topic.Update.exec(params);
        goto(route.Forum.Section.Id(sectionId));
    };
</script>

<style>
    .form {
        display: grid;
        gap: 0.8em;
    }
</style>

<SessionHub bind:isAdmin bind:isAnonym bind:user />

<Frame {title}>
    {#if !editable}
        Доступ запрещён
    {:else}
        <div class="form">
            Название: <input type="text" bind:value={name} />

            <div>
                <button on:click={action} disabled={!name}>Отправить</button>
            </div>
        </div>
    {/if}
</Frame>
