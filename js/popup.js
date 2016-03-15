function WebmailViewModel() {
    // Data
    var self = this;
    self.tabs = ['Item', 'Cart', 'Promotions'];
    self.chosenTabId = ko.observable();
    self.chosenTabData = ko.observable();

    // Behaviours
    self.goToTab = function(tab) {
        self.chosenTabId(tab);
        var mails = {
            "mails": [{
                "id": 44,
                "from": "Vance \u003csigne64@wilderness.xyz\u003e",
                "to": "steve@example.com",
                "date": "May 4, 2011",
                "subject": "@@ Meet new friends online @@",
                "folder": "Spam"
            }, {
                "id": 45,
                "from": "aiko.ossmith@cake-cannon.xyz",
                "to": "steve@example.com",
                "date": "May 16, 2011",
                "subject": "Samuel\u0027s n0se is perfect - fix yours t0day",
                "folder": "Spam"
            }, {
                "id": 46,
                "from": "Anne \u003cbrenda.fube@space-father.xyz\u003e",
                "to": "steve@example.com",
                "date": "May 4, 2011",
                "subject": "you\u0027re meds order #Y555764626",
                "folder": "Spam"
            }, {
                "id": 47,
                "from": "baker.tometo7@road-plantation.xyz",
                "to": "steve@example.com",
                "date": "Apr 29, 2011",
                "subject": "Does ZZX excuse the trail?",
                "folder": "Spam"
            }, {
                "id": 48,
                "from": "brennan.linexetresson@sleet57.xyz",
                "to": "steve@example.com",
                "date": "May 6, 2011",
                "subject": "FREE iPAD 2 GUARANTEED",
                "folder": "Spam"
            }, {
                "id": 49,
                "from": "Charlotte \u003ckasimir@wrenchmarble4.xyz\u003e",
                "to": "steve@example.com",
                "date": "May 7, 2011",
                "subject": "no other product can help",
                "folder": "Spam"
            }, {
                "id": 50,
                "from": "Deanna Wridaypa \u003cluke.pytocooson@mitten.xyz\u003e",
                "to": "steve@example.com",
                "date": "May 1, 2011",
                "subject": "!!Winner!! Place first 1000USD bet free",
                "folder": "Spam"
            }, {
                "id": 51,
                "from": "Hamilton Yueehi \u003cjameson.yuhapa@income-family.xyz\u003e",
                "to": "steve@example.com",
                "date": "May 10, 2011",
                "subject": "2 unread message(s): Hello Taylor",
                "folder": "Spam"
            }, {
                "id": 52,
                "from": "hasad.lineeesson1@camp-stew.xyz",
                "to": "steve@example.com",
                "date": "May 20, 2011",
                "subject": "March United Bank Inc",
                "folder": "Spam"
            }, {
                "id": 53,
                "from": "HGLF \u003canastasia7@tree-hook.xyz\u003e",
                "to": "steve@example.com",
                "date": "May 4, 2011",
                "subject": "YouPharmacy5 special offer: 80% off this week only",
                "folder": "Spam"
            }, {
                "id": 54,
                "from": "Isabella Hasmith \u003clinda.tocoovaford@bedroomcactus6.xyz\u003e",
                "to": "steve@example.com",
                "date": "Apr 27, 2011",
                "subject": "Ticket confirmation #484993598",
                "folder": "Spam"
            }, {
                "id": 55,
                "from": "jackson.passon@frogbreakfast.xyz",
                "to": "steve@example.com",
                "date": "May 7, 2011",
                "subject": "УДВОЕНИЕ СКОРОСТИ ЧТЕНИЯ ЗА 3 ЧАСА",
                "folder": "Spam"
            }, {
                "id": 56,
                "from": "leandra@advice.xyz",
                "to": "steve@example.com",
                "date": "May 7, 2011",
                "subject": "Stunning replica watches",
                "folder": "Spam"
            }, {
                "id": 57,
                "from": "russell.drison@cannoncoast1.xyz",
                "to": "steve@example.com",
                "date": "May 26, 2011",
                "subject": "RE: Hi Murphy...",
                "folder": "Spam"
            }, {
                "id": 58,
                "from": "william.boam@throat-horn.xyz",
                "to": "steve@example.com",
                "date": "May 16, 2011",
                "subject": "An exclusive offer from your bank",
                "folder": "Spam"
            }, {
                "id": 59,
                "from": "zephania.va@crookvolcano55.xyz",
                "to": "steve@example.com",
                "date": "May 5, 2011",
                "subject": "Днепропетровск",
                "folder": "Spam"
            }, {
                "id": 60,
                "from": "ZK \u003cjoshua@sun-money.xyz\u003e",
                "to": "steve@example.com",
                "date": "May 12, 2011",
                "subject": "Somebody invited you to join eReaders Community",
                "folder": "Spam"
            }]
        };
        //self.mails = mails;
        self.chosenTabData(mails);
        //$.ajax({
        //        method: "POST",
        //        url: "mail.php",
        //        data: {name: "John", location: "Boston"},
        //        dataType: 'json'
        //    })
        //    .done(function (msg) {
        //        debugger;
        //    })
        //    .always(function (msg) {
        //        debugger;
        //    });
        //$.get('/mail.php', { tab: tab }, self.chosenTabData);
    };

    self.goToTab('Item');
}

ko.applyBindings(new WebmailViewModel());
