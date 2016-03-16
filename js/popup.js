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
            default:
                getDataFromServer(tab, self);
        }
    };
    self.toWishlist = function (data) {
        //data.item
        return false;
    };
    self.toCart = function (data) {
        //data.item
        return false;
    };


    //open default tab
    self.goToTab('Item');
}

chrome.tabs.executeScript(null, {file: "js/content.js"});

ko.applyBindings(new ParserViewModel());