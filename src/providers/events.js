import { API_ENDPOINT } from './config';
import React from 'react';
import axios from 'axios';

export function getEvents() {
    return axios.get('events')
        .then(res => res.data)
        .then(res => { return res; });
}

export function addEvents(credentials) {
    var body = {
        categoryId: credentials.categoryId,
        title: credentials.title,
        description: credentials.description,
        isPrivate: credentials.isPrivate,
        startAt: credentials.startAt,
        finishAt: credentials.finishAt,
        city: credentials.city,
        town: credentials.town,
        latitude: credentials.latitude,
        longitude: credentials.longitude
    };

    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    return axios.post('events', body, {headers: headers})
        .then(res => res.data)
        .then(res => { console.log(res); return res; });
}

export function getEvent(id) {
    return axios.get('events/' + id + '/details')
        .then(res => res.data)
        .then(res => { return res; });
}

export function getCategoryEvents(categoryId) {
    return axios.get('events/categoryevents/' + categoryId)
        .then(res => res.data)
        .then(res => { return res; });
}

export function getUserEvents(userId) {
    return axios.get('events/' + userId)
        .then(res => res.data)
        .then(res => { return res; });
}

export function deleteEvent(id) {
    return axios.delete('events/' + id)
        .then(res => res.data)
        .then(res => { return res; });
}

export function search(query) {
    return axios.get('events/search/' + query) 
    .then(res => res.data).then(res => {
        return res;
    })
}