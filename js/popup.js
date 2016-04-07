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
            progress_element: document.getElementById('progress-value'),
            /**
             * Convert object to request params string (GET)
             * @param obj
             * @returns {string}
             */
            convertData: function (obj) {
                return Object.keys(obj).map(function (key) {
                    return key + '=' + encodeURIComponent(obj[key]);
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
                //start
                if (obj === 1){
                    _app.progress_element.classList.add('active');
                }

                _app.progress_element.style.width = obj * 25 + '%';

                //final
                if (obj === 4){
                    setTimeout(function(){
                        _app.progress_element.style.left = '100%';
                        _app.progress_element.classList.remove('active');
                    }, 300);
                    setTimeout(function(){
                        _app.progress_element.style = {left: 0, width: 0};
                    }, 600);
                }
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
                        data: null,
                        error: function (data) {
                            $this.logging('request is bad', 'REQUEST_ERROR');
                        }
                    };

                if (xhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")) {
                    //request options
                    request = _.extend(request, obj);

                    //request data/params
                    request.data = request.data ? _app.convertData(request.data) : '';

                    xhttp.addEventListener("error", request.error);

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
                    error: function () {
                        app.logging('request is bad, can\'t get cart', 'REQUEST_ERROR');
                        appData.clickState = false;
                    }
                }
            );
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
            'error': {
                message: 'or it is not Magento, or is not a product page'
            },
            'success': {
                message: 'product added to cart'
            }
        };
        appData.clickState = false;

        self.tabs = ['Item', 'Cart'];
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
                    alert('WHAT?!')
            }
        };
        self.toWishlist = function (data) {
            //data.item
            //alert('added to wishlist');
            return false;
        };
        self.addProduct = function (data) {
            var form_data = {};

            if (data) {
                //serialize form data
                _.map(data.elements, function (element) {
                    if (element.name)
                        form_data[element.name] =  element.value;
                });
                form_data['src'] = document.getElementById('product_image').src;

                app.sendRequest(
                    {
                        url: "http://dev3.madebyewave.com/unicart/index.php/unicart/index/addUrl",
                        cache: true,
                        data: form_data,
                        dataType: 'json',
                        success: function (msg) {
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
                        },
                        error: function () {
                            app.logging('request is bad, can\'t add product to cart', 'REQUEST_ERROR');
                            appData.clickState = false;
                        }
                    }
                );
            }

            return false;
        };


        //open default tab
        self.goToTab('Item');
    }

    chrome.tabs.executeScript(null, {file: "js/content.js"});

    ko.applyBindings(new ParserViewModel());
}());