/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-env worker,serviceworker */
(global => {
    'use strict';

    const MISSING_IMAGE = 'images/missing.png';

    importScripts('js/sw-toolbox.js');
    importScripts('js/localforage.min.js');

    let saveReport = function (object) {
        localforage.getItem('reports').then(function (value, err) {
            if (err) {
                console.log(err);
            }
            value = value || [];
            value.push(object);
            localforage.setItem('reports', value).then(function (error) {
                console.log(error);
            })
        })
    }

    self.addEventListener('sync', function (event) {
        if (event.tag == 'sync-reports') {
            localforage.getItem('reports').then(function (values, err) {
                if (err)
                    console.log(err);
                values = values || [];
                values.forEach(function (data) {
                    if (data.url) {
                        fetch(data.url, {
                            method: 'POST',
                            headers: data.headers,
                            body: JSON.stringify(data.report)
                        }).then(function (data) {

                        }).catch((error) => {
                            if (error) saveReport(data);
                        })
                    }
                });
                localforage.setItem('reports', []);
            })
        }
    })

    function reportHandler(request, values, options) {
        let clone = request.clone();
        request.json().then(function (data) {
            return global.toolbox.networkOnly(clone, values, options).catch((error) => {
                if (error)
                    saveReport({
                        url: request.url,
                        report: data,
                        headers: {
                            'authorization': request.headers.get('authorization'),
                            'Content-Type': request.headers.get('Content-Type')
                        }
                    });
            });
        })
    }

    global.toolbox.router.post(/https:\/\/efle3r\.colloqi\.com\/api\/messages/, reportHandler, {
        origin: 'http://efl.colloqi.com'
    });

    function dataHandler(request, values, options) {
        return global.toolbox.networkFirst(request, values, options).catch(() => {
            return global.caches.match(MISSING_IMAGE);
        });
    }

    // Since they might change, but freshness isn't of the utmost importance,
    // the 'fastest' strategy can be used.
    global.toolbox.router.get(/https:\/\/efle3r\.colloqi\.com\/api\/.*/, dataHandler, {
        cache: {
            name: 'data-cache',
            maxEntries: 50
        },
        networkTimeoutSeconds: 2
    });

/*
    global.toolbox.precache(['/views/index.jade', '/images/cqilogo.png', '/bundle.js', '/sw-toolbox-config.js', '/js/register-service-worker.js']);

    function imageHandler(request, values, options) {
        return global.toolbox.cacheFirst(request, values, options).catch(() => {
            return global.caches.match(MISSING_IMAGE);
        });
    }

    // Static images are served from a subdomain of cloudfront.net.
    global.toolbox.router.get('/(.*)', imageHandler, {
        cache: {
            name: 'image-cache',
            maxEntries: 50
        }
    });
*/

})(self);
