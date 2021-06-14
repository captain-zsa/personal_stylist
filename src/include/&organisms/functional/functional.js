import Vue from 'vue';
import Functional from './functional.vue';
import store from '~/js/store/index';

document.addEventListener('DOMContentLoaded', () => {
    /* eslint-disable no-new */
    new Vue({
        el         : '#vue-functional',
        delimiters : ['${', '}'],
        mixins     : [Functional],
        store,
    });
});
