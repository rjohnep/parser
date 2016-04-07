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
        if(msg.pointer) {
            //cursor!logic
            var css = '.ewave_cart_calibrate_click .ewave_cart_calibrate_hover_state { background: rgba(0,101,255, .25)!important; opacity:.9; transition: background 200ms, opacity 200ms; } .ewave_cart_calibrate_click * {cursor: cell!important;}',
                style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            document.getElementsByTagName('body')[0].classList.add('ewave_cart_calibrate_click');
            document.getElementsByTagName('body')[0].appendChild(style);

            live('mousemove', 'ewave_cart_calibrate_click', function(evt) {
                if (document.querySelector('.ewave_cart_calibrate_hover_state'))
                    document.querySelector('.ewave_cart_calibrate_hover_state').classList.remove('ewave_cart_calibrate_hover_state');

                evt.target.classList.add('ewave_cart_calibrate_hover_state');
            });

            function live (eventType, elementId, cb) {
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

            live('click', 'ewave_cart_calibrate_click', function(evt) {
                document.querySelector('.ewave_cart_calibrate_click').classList.remove('ewave_cart_calibrate_click');
            });
        }


    } else {
        chrome.runtime.sendMessage({
            request_error: true
        });
    }
});


