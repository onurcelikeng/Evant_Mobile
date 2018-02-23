import { API_ENDPOINT } from './config';
import React from 'react';
import axios from 'axios';

export function getComments(eventId) {
    return axios.get('comments/' + eventId)
        .then(res => res.data)
        .then(res => { console.log(res); return res; });
}

export function addComment(credentials) {
    var body = {
        eventId: credentials.eventId,
        content: credentials.content
    };

    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    return axios.post('comments', body, {headers: headers})
        .then(res => res.data)
        .then(res => { return res; })
        .catch(error => console.log(error));
}

export function deleteComment(commentId) {
    return axios.delete('comments/' + commentId)
        .then(res => res.data)
        .then(res => { console.log(res); return res; });
}