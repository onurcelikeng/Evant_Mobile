import React from 'react';
import axios from 'axios';

export function getFAQ(id) {
    return axios.get('faqs/' + id)
    .then(res => res.data).then(res => {
        return res;
    });
}

export function addFAQ(credentials) {
    var body = {
        eventId: credentials.eventId,
        question: credentials.question,
        answer: credentials.answer
    };

    console.log(body);

    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    return axios.post('faqs', body, {headers: headers})
    .then(res => res.data).then(res => {
        return res;
    });
}

export function deleteFAQ(id) {
    return axios.delete('faqs/' + id)
    .then(res => res.data).then(res => {
        return res;
    });
}