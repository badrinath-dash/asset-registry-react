import { useState } from 'react';
import * as config from '@splunk/splunk-utils/config';
import { createRESTURL } from '@splunk/splunk-utils/url';
import { handleError, handleResponse } from '@splunk/splunk-utils/fetch';


function insertKVStore(collection, data, defaultErrorMsg) {
    const url = createRESTURL(
        `storage/collections/data/${collection}/`, { app: config.app, sharing: 'app' }
    );
    return fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-Splunk-Form-Key': config.CSRFToken,
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                handleResponse(200);
            } else {
                handleError(defaultErrorMsg);
            }
            return response;
        })
        .catch(handleError(defaultErrorMsg))
        .catch((err) => (err instanceof Object ? defaultErrorMsg : err)); // handleError sometimes returns an Object
}

function updateKVStore(collection, key, data, defaultErrorMsg) {
    const url = createRESTURL(
        `storage/collections/data/${collection}/${encodeURIComponent(key)}`, { app: config.app, sharing: 'app' }
    );
    return fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-Splunk-Form-Key': config.CSRFToken,
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                handleResponse(200);
            } else {
                handleError(defaultErrorMsg);
            }
            return response;
        })
        .catch(handleError(defaultErrorMsg))
        .catch((err) => (err instanceof Object ? defaultErrorMsg : err)); // handleError sometimes returns an Object
}

function searchKVStore(collection, key, defaultErrorMsg) {
    let url = [];
    if (key.length === 0){
        url = createRESTURL(`storage/collections/data/${collection}`, { app: config.app, sharing: 'app' });
    }
    else{
        url = (createRESTURL(`storage/collections/data/${collection}/${encodeURIComponent(key)}`, { app: config.app, sharing: 'app' }));
    }

    return fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-Splunk-Form-Key': config.CSRFToken,
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
                handleResponse(200);
            } else {
                handleError(defaultErrorMsg);
            }
            return response;
        })
        .then((data) => {
            return data;
        })
        .catch(handleError(defaultErrorMsg))
        .catch((err) => (err instanceof Object ? defaultErrorMsg : err)); // handleError sometimes returns an Object
}


export { updateKVStore, searchKVStore, insertKVStore };
