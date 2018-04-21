import React from 'react';
import axios from 'axios';

export function getSearchHistories() {
    return axios.get('histories')
    .then(res => res.data).then(res => {
        return res;
    });
}

export function deleteAllSearchHistories() {
    return axios.delete('histories')
    .then(res => res.data).then(res => {
        return res;
    });
}

export function deleteSearchHistory(id) {
    return axios.delete('histories/' + id)
    .then(res => res.data).then(res => {
        return res;
    });
}

export function addSearchHistory(searchedItem) {
    return axios.post('histories/' + searchedItem)
    .then(res => res.data).then(res => {
        return res;
    });
}