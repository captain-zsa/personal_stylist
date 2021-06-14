<template>
    <div class="calculator">
        <p>Введите что нибудь:</p>
        <input
            v-model="count"
            type="text"
        >
        <br>
        <br>
        <p>{{ count }}</p>
        <br>
        <br>
        <button @click="getUsers">
            Нажми чтобы получить пользователей
        </button>
        <ul>
            <li
                v-for="user in users"
                :key="user.id"
            >
                {{ user.name }} - {{ user.surname }}
            </li>
        </ul>
    </div>
</template>

<script>
import { user } from '~/js/api';

export default {
    data : () => ({
        count : '',
        users : [],
    }),

    methods : {
        async getUsers() {
            try {
                const response = await user.getUsers();

                this.users = response.data;
            }
            catch (err) {
                alert('Произошла ошибка при загрузке данных');
            }
        },
    },
};
</script>

<style lang="scss">
.calculator {
    margin: 20px;
    padding: 20px;
    border: 3px solid gray;
}
</style>
