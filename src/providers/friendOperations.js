import React from 'react';
import axios from 'axios';

export function getFollowings() {
    return axios.get('friendoperations/followings')
    .then(res => res.data).then(friends => {
        console.log(friends)
        return friends;
    });
}

export function getFollowers() {
    return axios.get('friendoperations/followers')
    .then(res => res.data).then(friends => {
        console.log(friends)
        return friends;
    });
}