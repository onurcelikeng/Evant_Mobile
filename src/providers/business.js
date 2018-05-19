import { API_ENDPOINT } from './config';
import React from 'react';
import axios from 'axios';

export function switchToBusiness(type, payment) {
    console.log(type);
    var body = {
        businessType: type,
        payment: payment
    };

    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    console.log(body);

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

export function getBusiness() {
    return axios.get('business')
        .then(res => res.data)
        .then(res => { console.log(res); return res; });
}