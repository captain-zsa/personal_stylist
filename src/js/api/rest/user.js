import makeRequest from '../makeRequest';

export const getUser = (id) => {
    return makeRequest({
        url    : '/user-id.json',
        method : 'get',
        params : {
            id,
        },
    });
};

export const getUsers = () => {
    return makeRequest({
        url    : '/users.json',
        method : 'get',
    });
};
