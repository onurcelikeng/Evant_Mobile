import { API_ENDPOINT } from './config';
import React from 'react';
import axios from 'axios';

export function addUserDevice() {
    var body = {
        deviceId: credentials.deviceId,
        playerId: "",
        brand: credentials.brand,
        model: credentials.model,
        os: credentials.os
    };

    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    return axios.post('devices', body, {headers: headers})
        .then(res => res.data)
        .then(res => { console.log(res); return res; });
}

export function logout(deviceId) {
    return axios.get('devices/' + deviceId)
        .then(res => res.data)
        .then(res => { console.log(res); return res; });
}