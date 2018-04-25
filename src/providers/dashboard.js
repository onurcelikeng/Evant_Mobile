import { API_ENDPOINT } from './config';
import React from 'react';
import axios from 'axios';

export function getRanges(id) {
    return axios.get('dashboard/' + id + '/users')
        .then(res => res.data)
        .then(res => { return res; });
}