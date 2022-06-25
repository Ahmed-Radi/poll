<script>
    // import { onMount, onDestroy } from 'svelte';
    import { fade, scale } from 'svelte/transition';
    import { flip } from 'svelte/animate'
    import PollStore from '../store/PollStore';
    import PollDetails from './pollDetails.svelte';
    // export let polls = []

    // const unsub = PollStore.subscribe(data => polls = data)
    // onMount(() => {
    //     // get data from DB
    //     return console.log('onMount')
    // })
    // onDestroy(() => {
    //     console.log('onDestroy')
    //     unsub()
    // })

</script>
<section class="poll-list">
    {#each $PollStore as poll (poll.id)}
        <div in:fade out:scale|local animate:flip={{duration: 500}}>
            <PollDetails {poll} />
        </div>
    {/each}
</section>
<style>
    .poll-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 20px;
    }
</style>