function ParserViewModel() {
    // Data
    var self = this;
    self.tabs = ['Item', 'Cart', 'Promotions'];
    self.categories = [
        { name: 'on Sale', value: '0'},
        { name: 'HOT', value: '1'},
        { name: 'Other', value: '2'},
        { name: 'Wear', value: '3'}
    ];
    self.chosenTabId = ko.observable();
    self.chosenTabData = ko.observable();
    self.selectedCategory = ko.observable();

    // Behaviours
    self.goToTab = function (tab) {
        self.chosenTabId(tab);

        $.ajax({
                method: "POST",
                url: "http://dev3.madebyewave.com/mail.php",
                data: {tab: tab},
                dataType: 'json'
            })
            .done(function (msg) {
                //debugger;
                self.chosenTabData({
                    item: {
                        title: 'AGENT BLACK GLOVE',
                        price: '199',
                        size: '37',
                        qty: '2',
                        src: 'http://www.sandler.com.au/media/catalog/product/cache/1/image/1800x/966f5e480dc04e44279dd569854e5263/s/a/sandler_agent_blackglove_1.jpg'
                    }
                });
                //self.chosenTabData(msg);
            });
    };

    //open default tab
    self.goToTab('Item');
}

ko.applyBindings(new ParserViewModel());
