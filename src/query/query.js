import AsyncStorage from "@react-native-async-storage/async-storage";

import {setUser} from "../store/actions/user/user";
import {setCars} from "../store/actions/cars/cars";
import {setToken} from "../store/actions/token/token";

import {domain} from "../constants/constants";

import store from "../store/state";

export function queryPost(path, queryData) {
    const state = store.getState()
    const tokens = state?.tokens;
    queryData.append("token", tokens.access_token)

    let newQuery = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", path);
        xhr.send(queryData);
        xhr.onload = () => resolve(xhr);
        xhr.onerror = () => reject(xhr);
    });

    return newQuery.then(
        result => {
            let resp = JSON.parse(result.response);
            if (result.status >= 200  && result.status < 300){
                return resp;
            } else {
                if(!resp.success){
                    if (resp?.error === 'The token is expired' || resp?.error === 'The access token is invalid') {
                        return refresh_token()
                            .then((refresh_result) => {
                                if (refresh_result){
                                    return queryPost(path, queryData)
                                }else{
                                    return false;
                                }
                            })
                    }else{
                        return resp;
                    }
                }
            }
        },
    )
        .catch(err => {return false;})
}

async function refresh_token() {
    const state = store.getState()
    const tokens = state?.tokens;

    let formData = new FormData();
    formData.append('refresh_token', tokens.refresh_token);

    // console.log("refresh_token fired")

    return await fetch(`${domain}/api/auth/refresh`, {
        body: formData,
        method: "POST"
    }).then(resp => {return resp.json()})
        .then(result=>{
            if (result?.success){
                store.dispatch(setToken({access_token: result.access_token, refresh_token: result.refresh_token}));
                return true;
            } else {
                if (result?.error === 'The token is expired' || result?.error === 'The refresh token is invalid' || result?.error === 'The refresh token is missing or empty') {
                    store.dispatch(setUser(null));
                    AsyncStorage.removeItem('tokens');
                }
                return false;
            }
        })
        .catch(() => {
            return false
        })
}

export function getUser(runAfter = false){
    const state = store.getState()
    const tokens = state?.tokens;

    if(tokens){
        queryPost(`${domain}/api/profile/me`, new FormData)
            .then((result)=>{
                new Promise((resolve, reject) => {
                    store.dispatch(setUser(result))
                    resolve()
                }).then(() => {
                    if(result){
                        runAfter && runAfter();
                    }
                }).catch((error) => {throw error;})
            })
    }
}

export function getCars(runAfter){
    const state = store.getState()
    const tokens = state?.tokens;

    if(tokens){
        queryPost(`${domain}/api/profile/auto/gets`, new FormData)
            .then((result) => {
                new Promise((resolve, reject) => {
                    store.dispatch(setCars(result))
                    resolve()
                }).then(() => {
                    if(result){
                        runAfter && runAfter();
                    }
                }).catch((error) => {throw error;})
            })
    }
}