/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout'),
    Promise = require('bluebird');
var self ;
function ViewModel(params) {
    self = this;
    self._repository = params.context.repositories['workers'];
    self.context = params.context;
    self.status = ko.observable('');
    self.loadError=ko.observable();
    self.taskError=ko.observable();
   

    self.selected = ko.observable(undefined);
    self.items = ko.observableArray([]);

    self.select = function() {
        self.selected(this.id);
        self.output = this;
    };

    self.trigger = function (id) {
        self.taskError(undefined);
        self.context.events[id](self.taskError,self.context, this);
    };
}

ViewModel.prototype.id = 'campaignworkeslist';

ViewModel.prototype.fields = {
    id: 1
    ,'fullname': 1
    ,'annotator': 1
    ,'selector': 1
    ,'type':1
    ,'selectionAction':1
    ,'annotationAction':1
};

ViewModel.prototype.waitForStatusChange = function () {
    return this._propagating ||
           this._computing ||
           this._initializing ||
           Promise.resolve();
};

ViewModel.prototype._compute = function() {
     self._repository.getWorkers(self.context).then(function (result) {
            if (self._propagating) {
        self._propagating.cancel();
    }
    if (self._computing) {
        self._computing.cancel();
    }

    
    self._computing = self._repository.find(self.filters, self.fields).then(function (items) {
        self.selected(undefined);
       
        self.items(items);
        if (items.length) {
            self.selected(items[0].id);
            self.output = items[0];
        }
        self.status('computed');
        self._computing = undefined;
    });
        }).catch(function (e) {
            if (e.textStatus) {
              self.loadError(e.textStatus);
            } else {
                self.loadError(e.message);
            }
        });
    
};

ViewModel.prototype._allComputed = function() {
    if (!this.context.vms['tasktypelist'] || this.context.vms['tasktypelist'].status() !== 'computed') {
        return false;
    }
    return true;
};

ViewModel.prototype._firstNotReady = function() {
    if (!this.context.vms['tasktypelist']) {
        return Promise.reject();
    }
    if (this.context.vms['tasktypelist'].status() !== 'computed') {
        return this.context.vms['tasktypelist'].waitForStatusChange();
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
        self.filters['type'] = self.filters['type'] || (
            self.context.vms['tasktypelist'].output &&
            self.context.vms['tasktypelist'].output['type']);
        if(self.filters['type']=="All")
            self.filters={};
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
    ko.components.register('c-campaignworkeslist', {
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
