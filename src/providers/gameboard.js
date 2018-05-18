import { API_ENDPOINT } from './config';
import React from 'react';
import axios from 'axios';

export function getGameboard() {
    return axios.get('gameboard')
        .then(res => res.data)
        .then(res => { return res; });
}