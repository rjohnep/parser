/**
 * Public code
 */
(function () {
    'use strict';

    var app;

    /**
     * Inner tools
     * @type {{sendRequest}}
     */
    app = (function () {
        //private zone
        var _app = {
            /**
             * Convert object to request params string (GET)
             * @param obj
             * @returns {string}
             */
            convertData: function (obj) {
                return Object.keys(obj).map(function (key) {
                    return key + '=' + obj[key];
                }).join('&');
            }
        };

        //public methods
        return {
            /**
             * log
             * @param message
             * @param type
             * @returns {boolean}
             */
            logging: function (message, type) {
                type = typeof type !== 'undefined' ? type : 'min';
                console.log('Logging: ' + type + '::', message);
                return true;
            },
            /**
             * request progress loader
             * @param obj
             */
            requestProgress: function (obj) {
                if (obj === 1) {
                    document.getElementById('progress-value').style.width = 0;
                    document.getElementById('progress-value').style.left = 0;
                }

                document.getElementById('progress-value').style.width = obj * 25 + '%';
                if (obj === 4)
                    setTimeout(function(){ document.getElementById('progress-value').style.left = '100%' }, 1000);
            },
            /**
             * AJAX without jquery
             * @param obj
             */
            sendRequest: function (obj) {
                var xhttp,
                    $this = this,
                    request = {
                        async: true,
                        method: "GET",
                        data: null
                    };

                if (xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")) {
                    //request options
                    request = _.extend(request, obj);

                    //request data/params
                    request.data = request.data ? _app.convertData(request.data) : '';

                    xhttp.onreadystatechange = function () {
                        //срусо request progress
                        $this.requestProgress(xhttp.readyState);

                        if (xhttp.readyState == 4 && xhttp.status == 200) {
                            request.success(JSON.parse(xhttp.responseText));
                            return true;
                        } else {
                            console.log(xhttp.statusText);
                        }

                        //error message xhttp.status
                        return false;
                    };

                    xhttp.open(
                        request.method,
                        request.url + '?' + request.data,
                        request.async
                    );
                    xhttp.send();
                }
            }
        };
    }());

    function ParserViewModel() {
        function parsePage(self) {
            //got to content js, parse page
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function (tabs) {
                // ...and send a request for the DOM info...
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {from: 'popup', subject: 'parseProduct'}
                );
            });

            //answeк from content js, return item model
            chrome.runtime.onMessage.addListener(
                function(request, sender, sendResponse){
                    //self.temp = request.item_model;
                    if (request.request_error) {
                        self.chosenTabData(Object.defineProperty({}, 'error', { __proto__:null, value: appData.constructor['error']}));
                        appData.clickState = false;
                        return false;
                    }

                    self.chosenTabData(request.item_model);
                    console.timeEnd("concatenation");
                    appData.clickState = false;
                }
            );
        }

        function getCart() {
            app.sendRequest(
                {
                    url: "http://dev3.madebyewave.com/unicart/index.php/unicart/index/getCart",
                    cache: true,
                    dataType: 'json',
                    success: function (msg) {
                        self.chosenTabData(msg);
                        console.timeEnd("concatenation");
                        appData.clickState = false;
                    },
                    error: function (obj) {
                        alert(2);
                    }
                }
            );

            // $.ajax({
            //         method: "POST",
            //         url: "http://dev3.madebyewave.com/unicart/index.php/unicart/index/getCart",
            //         cache: true,
            //         dataType: 'json'
            //     })
            //     .done(function (msg) {
            //         debugger;
            //         self.chosenTabData(msg);
            //         console.timeEnd("concatenation");
            //         appData.clickState = false;
            //     });
        }

        function getDataFromServer(tab, self) {
            $.ajax({
                    method: "POST",
                    url: "http://dev3.madebyewave.com/mail.php",
                    cache: true,
                    data: {tab: tab},
                    dataType: 'json'
                })
                .done(function (msg) {
                    self.chosenTabData(msg);
                    console.timeEnd("concatenation");
                    appData.clickState = false;
                });
        }

        // Data
        var self = this, appData= {};
        appData.constructor = {
            'item': {
                'title': null,
                'price': null,
                'size': null,
                'color': null,
                'qty': null,
                'src': null
            },
            'cart': [
                {
                    'id': null,
                    'title': null,
                    'qty': null,
                    'price': null
                }
            ],
            'promotions': [
                {
                    'id': null,
                    'title': null,
                    'description': null,
                    'state': null
                }
            ],
            'error': {
                message: 'or it is not Magento, or is not a product page'
            },
            'success': {
                message: 'product added to cart'
            }
        };
        appData.clickState = false;

        self.tabs = ['Item', 'Cart', 'Promotions'];
        self.categories = [
            {name: 'on Sale', value: '0'},
            {name: 'HOT', value: '1'},
            {name: 'Other', value: '2'},
            {name: 'Wear', value: '3'}
        ];
        self.chosenTabId = ko.observable();
        self.chosenTabData = ko.observable();
        self.selectedCategory = ko.observable();

        // Behaviours
        self.goToTab = function (tab) {
            if (appData.clickState) return false;

            appData.clickState = true;
            console.time("concatenation");
            self.chosenTabId(tab);

            tab = tab.toLowerCase();

            //reset view {optic speed}
            self.chosenTabData(Object.defineProperty({}, tab, { __proto__:null, value: appData.constructor[tab]}));

            switch (tab) {
                case "item":
                    parsePage(self);
                    break;
                case "cart":
                    getCart();
                    break;
                default:
                    getDataFromServer(tab, self);
            }
        };
        self.toWishlist = function (data) {
            //data.item
            //alert('added to wishlist');
            return false;
        };
        self.toCart = function (data) {
            //data.item
            if (data) {
                if (data.item) {
                    $.ajax({
                            method: "POST",
                            url: "http://dev3.madebyewave.com/unicart/index.php/unicart/index/addUrl",
                            cache: true,
                            data: data.item
                        })
                        .done(function (msg) {
                            if (msg.error) {
                                self.chosenTabData(Object.defineProperty({}, 'error', {
                                    __proto__: null,
                                    value: appData.constructor['error']
                                }));
                                return false;
                            }

                            self.chosenTabData(Object.defineProperty({}, 'success', {
                                __proto__: null,
                                value: appData.constructor['success']
                            }));
                        });
                }
            }

            return false;
        };


        //open default tab
        self.goToTab('Item');
    }

    chrome.tabs.executeScript(null, {file: "js/content.js"});

    ko.applyBindings(new ParserViewModel());
}());