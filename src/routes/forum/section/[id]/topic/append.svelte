<script lang="ts">
    import * as route from "route";
    import * as api from "api";
    import * as types from "types";
    import { goto, stores } from "@sapper/app";
    import Frame from "../../../../../components/Frame.svelte";
    import SessionHub from "../../../../../components/SessionHub.svelte";
    import MessageEditor from "../../../../../components/post/MessageEditor.svelte";

    const { page } = stores();
    const sectionId = +$page.params.id;
    const title = "Создать тему";

    let isAdmin = false;
    let name = "";

    let type = types.ForumTopicType.Common;
    let answerSelection = types.ForumPollAnswerSelection.One;
    let answers: string[] = [];
    let post = "";

    const action = async () => {
        if (type == types.ForumTopicType.Poll) {
            if (answers.length < 2) {
                alert("Количество ответов в опросе должно быть не менее двух!");
                return;
            }

            for (let answer of answers) {
                if (!answer) {
                    alert("В опросе есть незаполненные ответы!");
                    return;
                }
            }
        }

        const topicParams: api.Forum.Topic.Create.Request = {
            section_id: sectionId,
            name: name,
            type: type,
        };

        if (type === types.ForumTopicType.Poll) {
            topicParams.poll_answers = answers;
            topicParams.poll_answer_selection = answerSelection;
        }

        const result = await api.Forum.Topic.Create.exec(topicParams);

        const postParams: api.Forum.Post.Create.Request = {
            topic_id: result.id,
            post: post,
        };

        await api.Forum.Post.Create.exec(postParams);

        goto(route.Forum.Topic.Id(result.id));
    };
</script>

<style>
    .form {
        display: grid;
        gap: 0.8em;
    }

    .answer {
        width: min(50em, 100%);
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 0.6em;
    }
</style>

<SessionHub bind:isAdmin />

<Frame {title}>
    <div class="form">
        Название: <input type="text" bind:value={name} />

        <div>
            <label>
                <input
                    type="radio"
                    bind:group={type}
                    value={types.ForumTopicType.Common}
                />
                Обычная тема
            </label>

            <label>
                <input
                    type="radio"
                    bind:group={type}
                    value={types.ForumTopicType.Poll}
                />
                Опрос
            </label>
        </div>

        {#if type == types.ForumTopicType.Poll}
            <div>
                Укажите вопрос в названии темы и добавьте варианты ответа.
            </div>

            {#each answers as answer, i}
                <div class="answer">
                    <input bind:value={answer} />
                    <button
                        on:click={() => {
                            answers.splice(i, 1);
                            answers = answers;
                        }}>Удалить</button
                    >
                </div>
            {/each}

            <div>
                <button
                    on:click={() => {
                        answers.push("");
                        answers = answers;
                    }}>Добавить</button
                >
            </div>

            Сколько вариантов можно выбрать?

            <div>
                <label>
                    <input
                        type="radio"
                        bind:group={answerSelection}
                        value={types.ForumPollAnswerSelection.One}
                    />
                    Один
                </label>

                <label>
                    <input
                        type="radio"
                        bind:group={answerSelection}
                        value={types.ForumPollAnswerSelection.Several}
                    />
                    Несколько
                </label>
            </div>
        {/if}
    </div>
</Frame>

<MessageEditor
    bind:message={post}
    sendAction={action}
    sendButtonEnabled={name.length > 0 &&
        (type === types.ForumTopicType.Poll ? answers.length > 0 : true)}
/>
