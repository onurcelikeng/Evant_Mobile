import { API_ENDPOINT } from './config';
import React from 'react';
import axios from 'axios';

export function getGameboard(type) {
    return axios.get('gameboard/' + type)
        .then(res => res.data)
        .then(res => { return res; });
}