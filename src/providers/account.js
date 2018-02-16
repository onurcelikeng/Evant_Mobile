import { API_ENDPOINT } from './config';
import React from 'react';
import axios from 'axios';

export function login(credentials) {
    var body = {
        email: credentials.email,
        password: credentials.password
    };

    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    return axios.post('account/token', body, {headers: headers})
        .then(res => res.data)
        .then(token => { return token; });
}

export function register(credentials) {
    var body = {
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        email: credentials.email,
        password: credentials.password
    };

    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    return axios.post('account/register', body, {headers: headers})
        .then(res => res.data)
        .then(res => { return res; });
}

export function all(loginCredentials, registerCredentials) {
    axios.all([login(loginCredentials), register(registerCredentials)])
    .then(axios.spread(function (acct, perms) {
        // Both requests are now complete
    }));
}