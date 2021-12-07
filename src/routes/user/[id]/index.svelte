<script context="module" lang="ts">
    import * as api from "api";
    import type { Session, Page } from "types";

    export async function preload(page: Page, _session: Session) {
        const params: api.User.GetOne.Request = {
            id: +page.params.id,
        };

        const user = await api.User.GetOne.exec(params);
        return { user };
    }
</script>

<script lang="ts">
    import * as consts from "consts";
    import { formatDateTime } from "utils";
    import Frame from "../../../components/Frame.svelte";

    export let user: api.User.GetOne.Response;

    function openUrl() {
        const params = new URLSearchParams();
        params.append("user", user.id.toString());
        return "?" + params.toString();
    }
</script>

<style>
    .blocked {
        color: red;
        margin-top: 0;
    }

    .grid {
        display: grid;
        grid-template-columns: max-content auto;
        gap: 0.5em;
    }
</style>

<Frame title="Пользователь">
    {#if user.blocked}
        <h3 class="blocked">Акканут заблокирован!</h3>
    {/if}

    <div class="grid">
        <div>ИД:</div>
        <div>{user.id}</div>
        <div>Имя:</div>
        <div>{user.name}</div>
        <div>Пол:</div>
        <div>{consts.Genders[user.gender]}</div>
        <div>Дата регистрации:</div>
        <div>{formatDateTime(user.create_ts)}</div>
        <div>Тип аккаунта:</div>
        <div>{consts.Account.ModeNames[user.code]}</div>
        <div>Мандел:</div>
        <div>
            {user.mandela_count}
            <a href={openUrl()}>Показать</a>
        </div>
        <div>Комментариев:</div>
        <div>{user.comment_count}</div>
        <div>Тем на форуме:</div>
        <div>{user.forum_topic_count}</div>
        <div>Постов на форуме:</div>
        <div>{user.forum_post_count}</div>
        <div>Получено лайков:</div>
        <div>{user.like_count}</div>
        <div>Получено дизлайков:</div>
        <div>{user.dislike_count}</div>
    </div>
</Frame>
