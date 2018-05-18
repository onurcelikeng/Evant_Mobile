import React from 'react';
import axios from 'axios';

export function getUserInfo(userId) {
    return axios.get('users/' + userId)
    .then(res => res.data).then(user => {
        return user;
    });
}

export function getTimeline(userId) {
    return axios.get('users/timeline/' + userId)
    .then(res => res.data).then(timeline => {
        return timeline;
    });
}

export function search(query) {
    return axios.get('users/search/' + query) 
    .then(res => res.data).then(res => {
        return res;
    })
}