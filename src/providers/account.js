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
    return axios.get('account/me')
    .then(res => res.data)
    .then(res => { return res; });
}

export function changePassword(credentials) {
    var body = {
        oldPassword: credentials.oldPassword,
        newPassword: credentials.newPassword,
        reNewPassword: credentials.newPasswordRepeat
    };

    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    return axios.put('account/password', body, {headers: headers})
    .then(res => res.data)
    .then(token => { return token; });
}

export function profileEdit(credentials) {
    var body = {
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        email: credentials.email
    };

    console.log(body);

    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    return axios.post('account/profile', body, {headers: headers})
    .then(res => res.data)
    .then(token => { return token; });
}

export function deactivateAccount() {
    return axios.get('account/deactive')
    .then(res => res.data)
    .then(res => { return res; });
}

export function photo(credentials) {
    var body = {
        folder: "",
        file: {
            contentType: credentials.contentType,
            contentDisposition: credentials.contentDisposition,
            headers: credentials.headers,
            length: credentials.length,
            name: credentials.name,
            fileName: credentials.fileName
          }
    };

    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    return axios.post('account/photo', body, {headers: headers})
    .then(res => res.data)
    .then(token => { return token; });
}