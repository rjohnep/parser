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
                    'color': 'undefined'
                }
            };

            chrome.runtime.sendMessage({
                item_model: result
            });
        }

    } else {
        chrome.runtime.sendMessage({
            request_error: true
        });
    }
});



