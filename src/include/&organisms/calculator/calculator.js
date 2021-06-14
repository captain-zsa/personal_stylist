import Vue from 'vue';
import Calculator from './calculator.vue';

document.addEventListener('DOMContentLoaded', () => {
    /* eslint-disable no-new */
    new Vue({
        el     : '#vue-component',
        render : h => h(Calculator),
    });
});
