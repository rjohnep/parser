(function () {
    'use strict';
    function live(eventType, elementId, cb) {
        document.addEventListener(eventType, function (event) {
            var el = event.target
                , found;

            while (el && !(found = el.classList.contains(elementId))) {
                el = el.parentElement;
            }

            if (found) {
                cb.call(el, event);
            }
        });
    }

    chrome.runtime.onMessage.addListener(function (msg, sender) {
        if (document.querySelector('.catalog-product-view')) {
            // First, validate the message's structure
            if ((msg.from === 'popup') && (msg.subject === 'parseProduct')) {
                // Enable the page-action for the requesting tab
                var result = {
                    'item': {
                        'url': document.querySelector("meta[property='og:url']") ?
                            document.querySelector("meta[property='og:url']").content :
                            window.location.href,
                        'title': document.querySelector("meta[property='og:title']") ?
                            document.querySelector("meta[property='og:title']").content :
                            document.querySelector(".product-name").innerText,
                        'price': document.querySelector("meta[itemprop='price']") ?
                            document.querySelector("meta[itemprop='price']").content :
                            document.querySelector(".price-box .price").innerText,
                        'src': document.querySelector("meta[property='og:image']") ?
                            document.querySelector("meta[property='og:image']").content :
                            document.querySelector("#image").src,
                        'qty': 1,
                        'color': 'undefined',
                        'size': 0
                    }
                };

                chrome.runtime.sendMessage({
                    item_model: result
                });
            }

            //cursor POINTER
            if (msg.pointer) {
                //cursor!logic
                var css = '.ewave_cart_calibrate_click .ewave_cart_calibrate_hover_state { background: rgba(0,101,255, .25)!important; opacity:.9; transition: background 200ms, opacity 200ms; } .ewave_cart_calibrate_click * {cursor: cell!important;}',
                    style = document.createElement('style');

                style.type = 'text/css';
                if (style.styleSheet) {
                    style.styleSheet.cssText = css;
                } else {
                    style.appendChild(document.createTextNode(css));
                }

                document.getElementsByTagName('body')[0].classList.add('ewave_cart_calibrate_click');
                document.getElementsByTagName('body')[0].appendChild(style);

                live('mousemove', 'ewave_cart_calibrate_click', function (evt) {
                    if (document.querySelector('.ewave_cart_calibrate_hover_state'))
                        document.querySelector('.ewave_cart_calibrate_hover_state').classList.remove('ewave_cart_calibrate_hover_state');

                    evt.target.classList.add('ewave_cart_calibrate_hover_state');
                });

                live('click', 'ewave_cart_calibrate_click', function (evt) {
                    document.querySelector('.ewave_cart_calibrate_click').classList.remove('ewave_cart_calibrate_click');
                });
            }


        } else {
            chrome.runtime.sendMessage({
                request_error: true
            });
        }
    });


    // var Grabber;
    //
    // Grabber = (function () {
    //     //private methods
    //     var _p = {
    //         price_constr: {
    //             range_re: /^(\s|to|\d|\.|\$|\-|,)+$/,
    //             bonus_re: /club|total|price|sale|now|brightred/i,
    //             stock_re: /soldout|currentlyunavailable|outofstock/i,
    //             tag_re: /^(h1|h2|h3|b|strong|sale)$/i,
    //             format_re: /((?:R?\$|USD|\&pound\;|\&\#163\;|\&\#xa3\;|\u00A3|\&yen\;|\uFFE5|\&\#165\;|\&\#xa5\;|\u00A5|eur|\&\#8364\;|\&\#x20ac\;)\s*\d[0-9\,\.]*)/gi,
    //         },
    //         /**
    //          * log
    //          * @param message
    //          * @param type
    //          * @returns {boolean}
    //          */
    //         logging: function (message, type) {
    //             type = typeof type !== 'undefined' ? type : 'min';
    //             console.log('Logging: ' + type + '::', message);
    //             return true;
    //         },
    //         /**
    //          *
    //          * @returns {TreeWalker}
    //          */
    //         getDOMTree: function () {
    //             return document.createTreeWalker(document, NodeFilter.SHOW_TEXT);
    //         }
    //     };
    //
    //     //public methods
    //     return {
    //         initialize: function () {
    //             this.page = _p.getDOMTree();
    //         },
    //         grabPrice: function () {
    //             var price_constr = _p.price_constr,
    //                 page = this.page,
    //                 filtered = {
    //                     price: []
    //                 };
    //
    //             while (page.nextNode()) {
    //                 var node = {};
    //                 node.current = page.currentNode;
    //                 node.text = node.current.data.trim();
    //
    //                 //price find
    //                 if (node.price_match = node.text.match(price_constr.format_re)) {
    //                     filtered.price.push({
    //                         "node": node.current,
    //                         "price": node.price_match[0]
    //                     });
    //                 }
    //
    //             }
    //             debugger;
    //         }
    //     };
    // }());
    //
    // Grabber.initialize();
    // Grabber.grabPrice();
}());




