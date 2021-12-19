<script context="module" lang="ts">
    import * as api from "api";
    import type { Session, Page } from "types";

    const PAGE_LIMIT = consts.Forum.Post.PageLimit;

    export async function preload(page: Page, _session: Session) {
        const topicId = +page.params.id;
        const pageNo = +page.query.page || 1;
        const getAllResponse = await load(topicId, pageNo);
        return { getAllResponse, pageNo, topicId };
    }

    async function load(
        topicId: number,
        pageNo: number
    ): Promise<api.Forum.Post.GetAll.Response> {
        const params: api.Forum.Post.GetAll.Request = {
            topic_id: topicId,
            offset: (pageNo - 1) * PAGE_LIMIT,
            limit: PAGE_LIMIT,
        };

        return await api.Forum.Post.GetAll.exec(params);
    }
</script>

<script lang="ts">
    import * as route from "route";
    import * as consts from "consts";
    import * as types from "types";
    import type { PathPart } from "forum";
    import { isAnonymAllowed, userUrl } from "utils";
    import type { User, ForumTopicPoll } from "types";
    import FramePage from "../../../../components/forum/main/ForumFrame.svelte";
    import SessionHub from "../../../../components/SessionHub.svelte";
    import PostElement from "../../../../components/forum/post/PostElement.svelte";
    import Navigator from "../../../../components/forum/main/Navigator.svelte";
    import Pagination from "../../../../components/Pagination.svelte";
    import MessageEditor from "../../../../components/post/MessageEditor.svelte";
    import Check from "../../../../components/Check.svelte";

    interface EditedPost extends api.Forum.Post.GetAll.Post {
        edit: boolean;
    }

    export let getAllResponse: api.Forum.Post.GetAll.Response;
    export let topicId = 0;
    export let pageNo = 1;

    let topicName: string;
    let isAdmin = false;
    let isAnonym = true;
    let user: User;
    let posts: EditedPost[] = [];
    let post = "";
    let messageEditorRef: MessageEditor;
    let pollSelectionType: types.ForumPollAnswerSelection;
    let poll: ForumTopicPoll[];
    let isVoted = false;
    let oneVote = -1;
    let severalVote: number[] = [];
    let editVote = false;
    let voteUserVisible = false;
    let voteUsers: api.Forum.Topic.GetVoteUsers.Response[];

    let postCount = 0;

    let categoryNav: PathPart;
    let sectionNav: PathPart;

    $: {
        topicName = getAllResponse.topic_name;
        postCount = getAllResponse.post_count;
        posts = getAllResponse.posts as EditedPost[];
        poll = getAllResponse.poll;
        pollSelectionType = getAllResponse.poll_selection_type;

        categoryNav = {
            id: getAllResponse.category_id,
            name: getAllResponse.category_name,
        };

        sectionNav = {
            id: getAllResponse.section_id,
            name: getAllResponse.section_name,
        };
    }

    $: if (poll) {
        for (const answer of poll) {
            if (answer.voted) {
                isVoted = true;
                break;
            }
        }
    }

    async function reload() {
        getAllResponse = await load(topicId, pageNo);
    }

    async function append() {
        const params: api.Forum.Post.Create.Request = {
            topic_id: topicId,
            post: post,
        };

        await api.Forum.Post.Create.exec(params);
        reload();
    }

    function replyPost(row: number) {
        const post = posts[row];
        messageEditorRef.appendReply(post.user_name, post.post);
    }

    async function castVote() {
        let votes: number[] = [];

        if (pollSelectionType === types.ForumPollAnswerSelection.One) {
            votes.push(oneVote);
        } else {
            votes = severalVote;
        }

        const params: api.Forum.Topic.Vote.Request = {
            id: topicId,
            votes: votes,
        };

        const result = await api.Forum.Topic.Vote.exec(params);
        poll = result.poll;
        editVote = false;
    }

    async function getVoteUsers() {
        if (!voteUserVisible) {
            const params: api.Forum.Topic.GetVoteUsers.Request = {
                id: topicId,
            };

            voteUsers = await api.Forum.Topic.GetVoteUsers.exec(params);
            console.log(voteUsers);
        }

        voteUserVisible = !voteUserVisible;
    }

    function voteUsersForAnswer(answerId: number): string {
        let result = "";

        for (const voteUser of voteUsers) {
            if (voteUser.answer_id !== answerId) continue;
            result += userUrl(voteUser.name, voteUser.id) + ", ";
        }

        if (result) {
            result = result.slice(0, result.length - 2);
        }

        return result;
    }
</script>

<style>
    button {
        margin-top: 0.5em;
    }

    .poll {
        display: grid;
        grid-template-columns: auto auto auto 1fr;
        gap: 0.5em;
    }

    .vote {
        display: block;
    }

    .buttons {
        display: flex;
        gap: 0.5em;
    }
</style>

<SessionHub bind:user bind:isAdmin bind:isAnonym />
<Navigator category={categoryNav} section={sectionNav} />

<FramePage
    title={topicName}
    showPoll={poll && poll.length > 0}
    showContent={posts.length > 0}
>
    <div slot="poll">
        {#if poll}
            {#if (isAnonym || isVoted) && !editVote}
                <div class="poll">
                    {#each poll as answer}
                        <div>{answer.answer}:</div>
                        <div>{answer.count}</div>
                        <div>
                            {#if !isAnonym && answer.voted}
                                <Check />
                            {/if}

                            {#if voteUserVisible}
                                {@html voteUsersForAnswer(answer.id)}
                            {/if}
                        </div>
                        <div />
                    {/each}
                </div>

                {#if !isAnonym}
                    <div class="buttons">
                        <button on:click={() => (editVote = true)}
                            >Изменить выбор</button
                        >

                        {#if isAdmin}
                            <button on:click={getVoteUsers}
                                >{voteUserVisible
                                    ? "Скрыть"
                                    : "Показать"}</button
                            >
                        {/if}
                    </div>
                {:else}
                    <br />
                    Голосовать могут только зарегистрированные пользователи.
                {/if}
            {:else}
                {#each poll as answer}
                    {#if pollSelectionType === types.ForumPollAnswerSelection.One}
                        <label class="vote">
                            <input
                                type="radio"
                                bind:group={oneVote}
                                value={answer.id}
                            />
                            {answer.answer}
                        </label>
                    {:else}
                        <label class="vote">
                            <input
                                type="checkbox"
                                bind:group={severalVote}
                                value={answer.id}
                            />
                            {answer.answer}
                        </label>
                    {/if}
                {/each}

                <div style="margin: 0.5em" />

                <button
                    on:click={castVote}
                    disabled={pollSelectionType ==
                    types.ForumPollAnswerSelection.One
                        ? oneVote < 0
                        : severalVote.length == 0}>Выбрать</button
                >
            {/if}
        {/if}
    </div>

    {#each posts as post, i}
        <div id={post.id.toString()} />
        <PostElement
            id={post.id}
            row={i}
            baseUrl={route.Forum.Topic.Id(topicId)}
            {pageNo}
            {post}
            on:removed={() => reload()}
            on:reply={(event) => replyPost(event.detail.row)}
        />
    {/each}
</FramePage>

<Pagination
    count={postCount}
    limit={PAGE_LIMIT}
    offset={pageNo}
    baseRoute={route.Forum.Topic.Id(topicId)}
/>

{#if user !== undefined || isAnonymAllowed()}
    <MessageEditor
        bind:this={messageEditorRef}
        bind:message={post}
        sendAction={() => append()}
    />
{/if}
