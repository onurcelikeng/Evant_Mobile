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

export function getTimeline() {
    return axios.get('account/timeline')
    .then(res => res.data).then(timeline => {
        return timeline;
    });
}

export function deactivateAccount() {
    return axios.get('account/deactive')
    .then(res => res.data)
    .then(res => { return res; });
}

export function switchToBusiness() {
    return axios.get('account/switch')
    .then(res => res.data)
    .then(res => { return res; });
}

export function photo(credentials) {
    var photo = {
        uri: credentials.uri,
        type: 'image/jpeg',
        name: 'photo.jpg'
    };

    var form = new FormData();
    form.append("File", photo);

    var headers = {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json'
    }

    return axios.post('account/photo', form, {headers: headers})
    .then(res => res.data)
    .then(token => { return token; });
}