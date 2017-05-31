/*jslint browser: true */
/*globals ko, $ */

function ViewModel() {
    var self = this;
    this.line = ko.observable();
    this.line.subscribe(function () {
        console.log(self.line());
    });
}

ko.applyBindings(new ViewModel());
