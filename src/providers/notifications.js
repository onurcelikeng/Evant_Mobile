import React from 'react';
import axios from 'axios';

export function getNotifications() {
    return axios.get('notifications')
    .then(res => res.data).then(res => {
        return res;
    });
}

export function readNotifications() {
    return axios.put('notifications')
    .then(res => res.data).then(res => {
        return res;
    });
}

export function deleteNotification(id) {
    return axios.delete('notifications/' + id)
    .then(res => res.data).then(res => {
        return res;
    });
}