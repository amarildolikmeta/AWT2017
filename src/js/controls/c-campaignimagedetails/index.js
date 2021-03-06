/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout'),
    Promise = require('bluebird');

function ViewModel(params) {
    var self = this;
    self._repository = params.context.repositories['images'];
    self.context = params.context;
    self.status = ko.observable('');
    self.item = ko.observable(undefined);
    self.Error=ko.observable();
    self.trigger = function (id) {
        self.context.events[id](self.context, self.item());
    };
}

ViewModel.prototype.id = 'campaignimagedetails';

ViewModel.prototype.fields = {
     'rejected': 1
    ,'accepted': 1
};

ViewModel.prototype.waitForStatusChange = function () {
    return this._computing ||
           this._initializing ||
           Promise.resolve();
};


ViewModel.prototype._compute = function() {
    if (this._computing) {
        this._computing.cancel();
    }
    var self = this;
    this._computing = function(){console.log("")};
    /*this._repository.getImageStatistics(self.context,this.filters.id, this.fields).then(function (item) {
        self.output = item;
        self.item(item.selection);
        self.status('computed');
        self._computing = undefined;
    }).catch(function (e) {
            if (e.textStatus) {
               self.Error(e.textStatus);
            } else {
                 self.Error(e.message);
            }
        });*/
};


ViewModel.prototype.init = function (options) {
    options = options || {};
    this.output = undefined;
    this.filters = options.input || {};
    this.status('ready');
    var self = this;
    this._initializing = new Promise(function (resolve) {
        setTimeout(function () {
            //self._compute();
            resolve();
            self._initializing = undefined;
        }, 1);
    });
};

exports.register = function () {
    ko.components.register('c-campaignimagedetails', {
        viewModel: {
            createViewModel: function (params, componentInfo) {
                var vm = new ViewModel(params);
                params.context.vms[vm.id] = vm;
                ko.utils.domNodeDisposal.addDisposeCallback(componentInfo.element, function () { delete params.context.vms[vm.id]; });
                return vm;
            }
        },
        template: require('./index.html'),
        synchronous: true
    });
};
