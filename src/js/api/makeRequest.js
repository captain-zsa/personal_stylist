import axios from 'axios';
import { baseURL } from './config';

export default ({
    url,
    method = 'get',
    params = {},
    data = {},
    headers = {},
    ...properties
}) => {
    return axios({
        baseURL,
        url,
        method,
        params,
        data,
        headers,
        ...properties,
    });
};
