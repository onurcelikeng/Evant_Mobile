import { AsyncStorage } from 'react-native';
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

export function getMe() {
    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
    
    return axios.get('account/me', {headers: headers})
    .then(res => res.data)
    .then(res => { return res; });
}