import { API_ENDPOINT } from './config';
import React from 'react';
import axios from 'axios';

export function switchToBusiness(type) {
    console.log(type);
    var body = {
        BusinessType: type
    };

    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    return axios.post('business', body, {headers: headers})
        .then(res => res.data)
        .then(res => { console.log(res); return res; })
        .catch(error => console.log(error));
}

export function cancelBusiness() {
    return axios.delete('business')
        .then(res => res.data)
        .then(res => { console.log(res); return res; });
}