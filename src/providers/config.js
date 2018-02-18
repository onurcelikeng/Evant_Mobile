import axios from 'axios';

export const API_ENDPOINT = 'https://evantapp.azurewebsites.net/api/'
axios.defaults.baseURL = 'https://evantapp.azurewebsites.net/api/';
axios.defaults.validateStatus = function (status) { return status <= 500; };