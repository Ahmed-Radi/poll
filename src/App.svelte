<script>
    import Header from './components/Header.svelte'
    import Footer from './components/Footer.svelte'
    import CreatePollForm from './components/CreatePollForm.svelte';
    import PollsList from './components/PollsList.svelte';
    import Tabs from './shared/tabs.svelte';

    // Tabs
    const items = ['Create Polls', 'Add New Poll'];
    let activeItem = 'Create Polls';

    const tabChange = (e) => {
        activeItem = e.detail
    }

    const handleAddPoll = () => {
        activeItem = 'Create Polls';
    }
</script>

<Header />
<main>
	<Tabs {activeItem} {items} on:tabChange={tabChange}/>
    {#if activeItem === 'Create Polls'}
        <PollsList />
    {:else if activeItem === 'Add New Poll'}
        <CreatePollForm on:addPoll={handleAddPoll} />
    {/if}
</main>
<Footer />

<style>
	main {
		max-width: 960px;
		margin: 40px auto;
	}
	@media (min-width: 640px) {
		/* main {
			max-width: none;
		} */
	}
</style>