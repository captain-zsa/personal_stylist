<template>
    <button
        type="button"
        class="btn"
    >
        <slot>{{ text }}</slot>
    </button>
</template>

<script>
export default {
    props : {
        text : {
            type    : String,
            default : '',
        },
    },
};
</script>
