<script>
    import PollStore from '../store/PollStore';
    import { createEventDispatcher } from 'svelte'
    let dispatch = createEventDispatcher()
    import Button from '../shared/Button.svelte'
    let fields = {question: '', answerA: '', answerB: ''}
    let errors = {question: '', answerA: '', answerB: ''}
    let valid = false;

    const submitHandler = () => {
        valid = true;
        if(fields.question.trim().length < 5) {
            valid = false
            errors.question = 'Question must be at least 5 characters longs'
        } else {
            errors.question = ''
        }

        if(fields.answerA.trim().length < 1) {
            valid = false
            errors.answerA = "Answer A can't be empty"
        } else {
            errors.answerA = ''
        }

        if(fields.answerB.trim().length < 1) {
            valid = false
            errors.answerB = "Answer B can't be empty"
        } else {
            errors.answerB = ''
        }

        // add poll
        if (valid) {
            let poll = {...fields, votesA: 0, votesB: 0, id: Math.random()}
            PollStore.update((currentPolls) => {
                return [poll, ...currentPolls]
            })
            dispatch('addPoll')
        }
    }
</script>
<form on:submit|preventDefault={submitHandler}>
    <div class="form-field">
        <label for="question">Question</label>
        <input type="text" id="question" placeholder="Question" bind:value={fields.question} />
        <div class="error">{errors.question}</div>
    </div>
    <div class="form-field">
        <label for="answer-a">Answer A:</label>
        <input type="text" id="answer-a" placeholder="Answer A" bind:value={fields.answerA} />
        <div class="error">{errors.answerA}</div>
    </div>
    <div class="form-field">
        <label for="anwser-b">Answer B:</label>
        <input type="text" id="anwser-b" placeholder="Answer B" bind:value={fields.answerB} />
        <div class="error">{errors.answerB}</div>
    </div>
    <Button type="secondary" flat={true}>Add poll</Button>
</form>
<style>
    form {
        width: 400px;
        margin: 0 auto;
        text-align: center;
    }
    .form-field {
        margin-bottom: 0.8rem;
    }
    .form-field input {
        width: 100%;
        border-radius: 0.3rem;
    }
    .form-field > label {
        margin-bottom: 0.8rem;
        text-align: left;
    }
    .error {
        font-weight: 600;
        font-size: 12px;
        color: #d91b42;
    }
</style>