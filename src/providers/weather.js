import React from 'react';
import axios from 'axios';

export function getWeather(key) {
    return axios.get("http://dataservice.accuweather.com/forecasts/v1/daily/1day/" + key + "?apikey=ZXOZGcoS5IfugAkl2bgkHdx9deTda3lG")
    .then(res => {return res.data});
}

export function getCity(lat, long) {
    return axios.get("http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=ZXOZGcoS5IfugAkl2bgkHdx9deTda3lG&q=" + lat + "," + long)
    .then(res => {return res.data});
}

export function getIcon(icon) {
    return axios.get("https://developer.accuweather.com/sites/default/files/" + icon + "-s.png")
    .then(res => {return res.data});
}
