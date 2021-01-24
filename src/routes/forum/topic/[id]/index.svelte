<script lang="ts">
    import * as route from "route";
    import * as api from "api";
    import * as consts from "consts";
    import * as types from "types";
    import type { PathPart } from "forum";
    import type { User, ForumTopicPoll } from "types";
    import { sessionUserName } from "utils";
    import { stores } from "@sapper/app";
    import Rectangle from "../../../../components/Rectangle.svelte";
    import FramePage from "../../../../components/forum/main/ForumFrame.svelte";
    import SessionHub from "../../../../components/SessionHub.svelte";
    import PostElement from "../../../../components/forum/post/PostElement.svelte";
    import Navigator from "../../../../components/forum/main/Navigator.svelte";
    import Pagination from "../../../../components/Pagination.svelte";
    import PostEditor from "../../../../components/post/PostEditor.svelte";

    const { page } = stores();
    const topicId = +$page.params.id;

    interface EditedPost extends api.Forum.Post.GetAll.Post {
        edit: boolean;
    }

    let topicName: string;
    let topicUserId: number;
    let isAdmin = false;
    let isAnonym = true;
    let user: User;
    let posts: EditedPost[] = [];
    let post: string;
    let postEditorRef: PostEditor;
    let pollSelectionType: types.ForumPollAnswerSelection;
    let poll: ForumTopicPoll[];
    let isVoted = false;
    let oneVote = -1;
    let severalVote: number[] = [];

    let pageNo = 1;
    let postCount = 0;

    const pageLimit = consts.Forum.Post.PageLimit;

    let categoryNav: PathPart;
    let sectionNav: PathPart;

    $: if (process.browser && $page.query) {
        pageNo = +$page.query.page || 1;
        load();
    }

    $: if (poll) {
        for (const answer of poll) {
            if (answer.voted) {
                isVoted = true;
                break;
            }
        }
    }

    async function load() {
        const params: api.Forum.Post.GetAll.Request = {
            topic_id: topicId,
            offset: (pageNo - 1) * pageLimit,
            limit: pageLimit,
        };

        const result = await api.Forum.Post.GetAll.exec(params);
        topicName = result.topic_name;
        topicUserId = result.topic_user_id;
        postCount = result.post_count;
        posts = result.posts as EditedPost[];
        poll = result.poll;
        pollSelectionType = result.poll_selection_type;

        categoryNav = {
            id: result.category_id,
            name: result.category_name,
        };

        sectionNav = {
            id: result.section_id,
            name: result.section_name,
        };
    }

    async function append() {
        const params: api.Forum.Post.Create.Request = {
            topic_id: topicId,
            post: post,
        };

        await api.Forum.Post.Create.exec(params);
        post = "";
        load();
    }

    function replyPost(row: number) {
        const post = posts[row];
        postEditorRef.appendReply(post.user_name, post.post);
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
        // editVote = false;
    }
</script>

<style>
    button {
        margin-top: 0.5em;
    }

    .poll {
        display: grid;
        grid-template-columns: max-content max-content max-content;
        gap: 0.5em;
    }

    .vote {
        display: block;
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
            {#if isAnonym || isVoted}
                <div class="poll">
                    {#each poll as answer}
                        <div>{answer.answer}:</div>
                        <div>{answer.count}</div>
                        <div>
                            {#if !isAnonym && answer.voted}
                                <i
                                    class="far fa-check-circle"
                                    style="color: green"
                                />
                            {/if}
                        </div>
                    {/each}
                </div>
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
        <PostElement
            row={i}
            {post}
            {topicUserId}
            on:removed={() => load()}
            on:reply={(event) => replyPost(event.detail.row)}
        />
    {/each}
</FramePage>

<Pagination
    count={postCount}
    limit={pageLimit}
    offset={pageNo}
    baseRoute={route.Forum.Topic.Id(topicId)}
/>

<Rectangle padding={false} solid={false}>
    <PostEditor bind:post bind:this={postEditorRef} />
    <div>Пользователь: {sessionUserName(user)}</div>
    <div><button on:click={append} disabled={!post}>Отправить</button></div>
</Rectangle>
