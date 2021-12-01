import * as config from '@splunk/splunk-utils/config';
import { createRESTURL } from '@splunk/splunk-utils/url';
import { handleError, handleResponse } from '@splunk/splunk-utils/fetch';

function updateKVEntry(collection, key, data, defaultErrorMsg) {
    const url = createRESTURL(
        //`storage/collections/data/${collection}/${encodeURIComponent(key)}`, { app: config.app, sharing: 'app' }
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
            if (response.ok) {
                handleResponse(200)
            } else {
                handleError(defaultErrorMsg)
            }

        })
        .catch(handleError(defaultErrorMsg))
        .catch((err) => err instanceof Object ? defaultErrorMsg : err); // handleError sometimes returns an Object
}

function SearchKVStore(collection, key, defaultErrorMsg) {
    const url = createRESTURL(
           `storage/collections/data/${collection}/${encodeURIComponent(key)}`, { app: config.app, sharing: 'app' }
    );
    return fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-Splunk-Form-Key': config.CSRFToken,
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            if (response.ok) {
                handleResponse(200)
            } else {
                handleError(defaultErrorMsg)
            }

        })
        .catch(handleError(defaultErrorMsg))
        .catch((err) => err instanceof Object ? defaultErrorMsg : err); // handleError sometimes returns an Object
}

export { updateKVEntry,SearchKVStore };
