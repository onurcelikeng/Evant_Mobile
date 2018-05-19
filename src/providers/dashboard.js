import { API_ENDPOINT } from './config';
import React from 'react';
import axios from 'axios';

export function getRanges(id) {
    return axios.get('dashboard/' + id + '/users')
        .then(res => res.data)
        .then(res => { return res; });
}

export function getCommentStatistics(id) {
    return axios.get('dashboard/' + id + '/comments')
        .then(res => res.data)
        .then(res => { return res; });
}

export function getDate(id) {
    return axios.get('dashboard/' + id + '/date')
        .then(res => res.data)
        .then(res => { return res; });
}

export function getAnnouncement(credentials) {
    var body = {
        eventId: credentials.eventId,
        message: credentials.message
    };

    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    return axios.post('dashboard/announcement', body, {headers: headers})
        .then(res => res.data)
        .then(res => { return res; });
}