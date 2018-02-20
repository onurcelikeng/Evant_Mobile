import React from 'react';
import axios from 'axios';

export function getUserSettings() {
    return axios.get('settings/')
    .then(res => res.data).then(settings => {
        return settings;
    });
}

export function updateUserSettings(credentials) {
    var body = {
        isCommentNotif: credentials.isCommentNotif,
        isEventNewComerNotif: credentials.isEventNewComerNotif,
        isEventUpdateNotif: credentials.isEventUpdateNotif,
        isFriendshipNotif: credentials.isFriendshipNotif,
        language: credentials.language,
        theme: credentials.theme,
        userSettingId: credentials.userSettingId
    };
    console.log(credentials);

    var headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

    return axios.put('settings/', body, {headers: headers})
    .then(res => res.data).then(setting => {
        console.log(setting);
        return setting;
    })
}
