import React from 'react';
import axios from 'axios';

export function getUserInfo(userId) {
    return axios.get('users/' + userId)
    .then(res => res.data).then(user => {
        return user;
    });
}

export function getUsers() {
    return axios.get('users')
    .then(res => res.data).then(users => {
        return users;
    });
}