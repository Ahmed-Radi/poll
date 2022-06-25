<script>
    import Button from '../shared/Button.svelte';
    import Card from '../shared/Card.svelte';
    import pollStore from '../store/PollStore';
    import { tweened } from 'svelte/motion';

    export let poll;
    $: totalVotes = poll.votesA + poll.votesB
    $: precentA = Math.floor(100 / totalVotes * poll.votesA) || 0
    $: precentB = Math.floor(100 / totalVotes * poll.votesB) || 0

    // tweened precentages

    const tweenedA = tweened(0)
    const tweenedB = tweened(0)

    $: tweenedA.set(precentA)
    $: tweenedB.set(precentB)

    const handleVote = (option, id) => {
        pollStore.update((currentPolls) => {
            let pollsCopy = [...currentPolls];
            let upVoted = pollsCopy.find(poll => poll.id === id);
            option === 'a' ? upVoted.votesA++ : upVoted.votesB++;
            return pollsCopy
        })
    }

    const handleDeletePoll = (id) => {
        pollStore.update(currentPolls => {
            return currentPolls.filter(poll => poll.id !== id)
        })
    }

</script>
<Card>
    <section>
        <h3 class="header">{poll.question}</h3>
        <p class="total-votes">Total votes: {totalVotes}</p>
        <div class="answer" on:click={() => handleVote('a', poll.id)}>
            <div class="precent precent-a" style="width: {$tweenedA}%"></div>
            <span class="vote-number">{poll.answerA} ({poll.votesA})</span>
        </div>
        <div class="answer" on:click={() => handleVote('b', poll.id)}>
            <div class="precent precent-b" style="width: {$tweenedB}%"></div>
            <span class="vote-number">{poll.answerB} ({poll.votesB})</span>
        </div>
        <div class="delete">
            <Button flat="true" on:click={() => handleDeletePoll(poll.id)}>Delete</Button>
        </div>
    </section>
</Card>

<style>
    .header {
        margin: 0 auto;
        color: #555;
    }
    .total-votes {
        margin-top: 6px;
        font-size: 14px;
        color: #aaa;
        margin-bottom: 30px;
    }
    .answer {
        background: #fafafa;
        cursor: pointer;
        margin: 10px auto;
        position: relative;
    }
    .answer:hover {
        opacity: 0.6;
    }
    .vote-number {
        display: inline-block;
        padding: 10px 20px;
    }
    .precent {
        height: 100%;
        box-sizing: border-box;
        position: absolute;
    }
    .precent-a {
        border-left: 4px solid #45c496;
        background-color: rgba(69, 196, 150, 0.2);
    }
    .precent-b {
        border-left: 4px solid #d91b42;
        background-color: rgba(217, 27, 66, 0.2);
    }
    .delete {
        margin-top: 30px;;
        text-align: center;
    }
</style>