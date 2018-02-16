import { API_ENDPOINT } from './config';
import React from 'react';
import axios from 'axios';

export function login(credentials) {
    var body = {
        email: credentials.email,
        password: credentials.password
    };

    //const token = 'Bearer '.concat(this.state.token);
    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        //'Authorization': token
    }

    return axios.post('account/token/', body, {headers: headers})
        .then(res => res.data)
        .then(token => {
            return token;
        });
}