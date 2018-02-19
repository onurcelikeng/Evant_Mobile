import axios from 'axios';

axios.defaults.baseURL = 'https://evantapp.azurewebsites.net/api/';
axios.defaults.validateStatus = function (status) { return status <= 500; };