import React from 'react';
import axios from 'axios';

export function getFollowings() {
    return axios.get('friendoperations/followings')
    .then(res => res.data).then(friends => {
        return friends;
    });
}

export function getFollowers() {
    return axios.get('friendoperations/followers')
    .then(res => res.data).then(friends => {
        return friends;
    });
}

export function isFollowing(id) {
    return axios.get('friendoperations/' + id)
    .then(res => res.data).then(isFollowing => {
        return isFollowing;
    });
}

export function follow(id) {
    return axios.post('friendoperations/' + id)
    .then(res => res.data).then(follow => {
        return follow;
    })
}

export function unfollow(id) {
    return axios.delete('friendoperations/' + id)
    .then(res => res.data).then(unfollow => {
        return unfollow;
    })
}