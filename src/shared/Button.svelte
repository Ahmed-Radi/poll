<script>
    export let type = "primary";
    export let flat = false;
    export let inverse = false;
</script>
<button class={type} class:flat={flat} class:inverse={inverse} on:click>
    <slot></slot>
</button>
<style>
    button {
        border: 0;
        cursor: pointer;
        border-radius: 6px;
        padding: 8px 12px;
        font-weight: bold;
        box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.3);
    }
    .primary {
        color: #fff;
        background: #d91b42;
    }
    .secondry {
        color: #fff;
        background: #45c496;
    }
    .flat {
        box-shadow: none;
    }
    .primary.inverse {
        background: #fff;
        color: #d91b42;
        border: 1px solid #d91b42;
    }
    .secondry.inverse {
        background-color: #fff;
        color: #45c496;
        border: 1px solid #45c496;
    }
</style>