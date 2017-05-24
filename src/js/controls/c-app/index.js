/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout');

function ViewModel(params) {
    var self = this;
    self.context = params.context;
    self.logOutError=ko.observable();
    self.init = function (options) {
        options = options || {};
        self.children.forEach(function (child){
            if (child === options.mask) {
                return;
            }
            self.context.vms[child].init(options);
        });
    };

    self.trigger = function (id) {
        self.context.repositories["logOut"].logOut(self.context).then(function (res) {
                self.logOutError(undefined);
                self.context.events[id](self.context);
                }).catch(function (e) {
            if (e.textStatus) {
              self.logOutError(e.textStatus);
            } else {
                self.logOutError(e.message);
            }
        });
        
    };
}

ViewModel.prototype.id = 'app';
ViewModel.prototype.children = [
    'appcontainer' // App Container
];

exports.register = function () {
    ko.components.register('c-app', {
        viewModel: {
            createViewModel: function (params, componentInfo) {
                var vm = new ViewModel(params);
                params.context.vms[vm.id] = vm;
                params.context.runningActionsByContainer[vm.id] = [];
                ko.utils.domNodeDisposal.addDisposeCallback(componentInfo.element, function () {
                    params.context.runningActionsByContainer[vm.id].forEach(function (promise) {
                        promise.cancel();
                    })
                    delete params.context.runningActionsByContainer[vm.id];
                    delete params.context.vms[vm.id];
                });
                return vm;
            }
        },
        template: require('./index.html'),
        synchronous: true
    });
};
