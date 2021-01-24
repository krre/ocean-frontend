<script lang="ts">
    import * as types from "types";

    export let name = "";
    export let action = () => {};
    export let pollVisible = true;
    export let type = types.ForumTopicType.Common;
    export let answerSelection = types.ForumPollAnswerSelection.One;
    export let answers: string[] = [];

    let other = true;

    $: buttonEnabled =
        type === types.ForumTopicType.Common ? name : name && answers.length;

    function beforeAction() {
        if (type == types.ForumTopicType.Poll) {
            const count = answers.length + (other ? 1 : 0);

            if (count < 2) {
                alert("Количество ответов в опросе должно быть не менее двух!");
                return;
            }

            for (let answer of answers) {
                if (!answer) {
                    alert("В опросе есть незаполненные ответы!");
                    return;
                }
            }

            if (other) {
                answers.push("Другое");
            }
        }

        action();
    }
</script>

<style>
    .form {
        display: grid;
        grid-gap: 0.8em;
    }

    .answer {
        width: min(50em, 100%);
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 0.6em;
    }
</style>

<div class="form">
    Название: <input type="text" bind:value={name} />

    {#if pollVisible}
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

            <label>
                <input type="checkbox" bind:checked={other} />
                Автоматически добавить вариант "Другое"</label
            >

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
    {/if}

    <div>
        <button on:click={beforeAction} disabled={!buttonEnabled}
            >Отправить</button
        >
    </div>
</div>
