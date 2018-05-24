import React from 'react';
import axios from 'axios';

export function getWeather() {
    return axios.get('weathers')
    .then(res => res.data).then(res => {
        return res;
    });
}