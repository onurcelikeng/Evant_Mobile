import React from 'react';
import axios from 'axios';

export function getNotifications() {
    return axios.get('notifications')
    .then(res => res.data).then(res => {
        return res;
    });
}

export function readNotifications() {
    return axios.post('eventoperations')
    .then(res => res.data).then(res => {
        return res;
    });
}