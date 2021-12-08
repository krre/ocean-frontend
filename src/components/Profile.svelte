<script lang="ts">
    import * as consts from "consts";
    import type * as api from "api";
    import { formatDateTime } from "utils";

    export let user: api.User.GetOne.Response;

    function openUrl() {
        const params = new URLSearchParams();
        params.append("user", user.id.toString());
        return "?" + params.toString();
    }
</script>

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
