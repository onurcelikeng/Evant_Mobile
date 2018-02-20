import React from 'react';
import axios from 'axios';

export function getFollowings(id) {
    return axios.get('friendoperations/followings/' + id)
    .then(res => res.data).then(friends => {
        return friends;
    });
}

export function getFollowers(id) {
    return axios.get('friendoperations/followers/' + id)
    .then(res => res.data).then(friends => {
        return friends;
    });
}

export function isFollowing(friendId) {
    return axios.get('friendoperations/' + friendId)
    .then(res => res.data).then(isFollowing => {
        return isFollowing;
    });
}

export function follow(friendId) {
    return axios.post('friendoperations/' + friendId)
    .then(res => res.data).then(follow => {
        return follow;
    })
}

export function unfollow(friendId) {
    return axios.delete('friendoperations/' + friendId)
    .then(res => res.data).then(unfollow => {
        return unfollow;
    })
}