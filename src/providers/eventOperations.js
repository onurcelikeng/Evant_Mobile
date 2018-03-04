import React from 'react';
import axios from 'axios';

export function followers(id) {
    return axios.get('eventoperations/' + id)
    .then(res => res.data).then(res => {
        return res;
    });
}

export function joinEvent(id) {
    return axios.post('eventoperations/' + id)
    .then(res => res.data).then(res => {
        return res;
    });
}

export function leaveEvent(id) {
    console.log(id);
    return axios.delete('eventoperations/' + id)
    .then(res => res.data).then(res => {
        return res;
    });
}

export function joinStatus(id) {
    return axios.get('eventoperations/' + id + '/status')
    .then(res => res.data).then(res => {
        return res;
    });
}