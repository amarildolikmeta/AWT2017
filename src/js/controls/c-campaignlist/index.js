/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout'),
    Promise = require('bluebird');

function ViewModel(params) {
    var self = this;
    self._repository = params.context.repositories['campaigns'];
    self.context = params.context;
    self.loadError=ko.observable();
    if(!self._repository.getFlag()){
    self._repository.getCampaigns(self.context).then(function (result) {
               self._compute();
        }).catch(function (e) {
            if (e.textStatus) {
              self.loadError(e.textStatus);
            } else {
                self.loadError(e.message);
            }
        });
    self.select = function() {
        self.selected(this.id);
        self.output = this;
    };}
    self.status = ko.observable('');
    self.selected = ko.observable(undefined);
    self.items = ko.observableArray([]);
    self.detailsError=ko.observable();
    self.context.repositories["currentCampaign"].clear()
    self.trigger = function (id) {
        var data=this;
        self.context.repositories["currentCampaign"].setURL(this.id);
        self.context.repositories["getCampaignDetails"].getCampaignDetails(self.context
                  ).then(function (result) {
           
            self.context.repositories["currentCampaign"].setDetails(result,self.context);
            self.context.events[id](self.context, data);
        }).catch(function (e) {
            if (e.textStatus) {
              self.detailsError(e.textStatus);
            } else {
                self.detailsError(e.message);
            }
        });
       
    };
}

ViewModel.prototype.id = 'campaignlist';

ViewModel.prototype.fields = {
    'name': 1
    ,'status': 1
    ,'id': 1
};

ViewModel.prototype.waitForStatusChange = function () {
    return this._propagating ||
           this._computing ||
           this._initializing ||
           Promise.resolve();
};

ViewModel.prototype._compute = function() {
    if (this._propagating) {
        this._propagating.cancel();
    }
    if (this._computing) {
        this._computing.cancel();
    }
    var self = this;
    if(this.filters.status=="All")
        this.filters={};
    this._computing = this._repository.find(this.filters, this.fields).then(function (items) {
        self.selected(undefined);
        self.items(items);
        if (items.length) {
            self.selected(items[0].id);
            self.output = items[0];
        }
        self.status('computed');
        self._computing = undefined;
    });
};

ViewModel.prototype._allComputed = function() {
    if (!this.context.vms['executionstatelist'] || this.context.vms['executionstatelist'].status() !== 'computed') {
        return false;
    }
    return true;
};

ViewModel.prototype._firstNotReady = function() {
    if (!this.context.vms['executionstatelist']) {
        return Promise.reject();
    }
    if (this.context.vms['executionstatelist'].status() !== 'computed') {
        return this.context.vms['executionstatelist'].waitForStatusChange();
    }
    return Promise.resolve();
};

ViewModel.prototype._waitForDependencies = function() {
    if (this._allComputed()) {
        return Promise.resolve();
    } else {
        var self = this;
        return this._firstNotReady().then(function () {
            return self._waitForDependencies();
        });
    }
};

ViewModel.prototype._propagate = function() {
    if (this._propagating) {
        this._propagating.cancel();
    }
    if (this._computing) {
        this._computing.cancel();
    }
    var self = this;
    this._propagating = this._waitForDependencies().then(function () {
        self.status('ready');
        self._propagating = undefined;
        self._compute();
    });
};

ViewModel.prototype.init = function (options) {
    options = options || {};
    this.output = undefined;
    this.filters = options.input || {};
    this.status('clear');
    var self = this;
    this._initializing = new Promise(function (resolve) {
        setTimeout(function () {
            self._propagate();
            resolve();
            self._initializing = undefined;
        }, 1);
    });
};

exports.register = function () {
    ko.components.register('c-campaignlist', {
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
