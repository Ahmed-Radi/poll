import { writable } from 'svelte/store';

const pollStore = writable([{
    id: 1,
    question: 'Ahmed Radi',
    answerA: 'N',
    answerB: 'Y',
    votesA: 10,
    votesB: 1,
}])

export default pollStore;