import React from 'react';
import axios from 'axios';

export function getCategories() {
    return axios.get('categories')
    .then(res => res.data).then(categories => {
        return categories;
    });
}