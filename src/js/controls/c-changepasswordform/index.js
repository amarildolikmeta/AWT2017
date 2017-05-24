/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout'),
    Promise = require('bluebird');

function ViewModel(params) {
    var self = this;
    self.context = params.context;
    self.status = ko.observable('');
    self.fields = ko.observable({});
    self.errors = ko.observable({});
    self.newPass=ko.observable("");
    self.newPassError=ko.observable();
    self.repeatPass=ko.observable("");
    self.repeatPassError=ko.observable();
    self.changeError=ko.observable();
    self.newPass.subscribe(function(){
        self.newPassError(undefined);
        self.changeError(undefined);
    });
    self.repeatPass.subscribe(function(){
        self.repeatPassError(undefined);
        self.changeError(undefined);
    });
    self.trigger = function (id) {
        var e=false;
        if(self.newPass().length<8)
        {
            self.newPassError("Password must be at least 8 characters long");
            e=true;
        }
         if(self.newPass()!=self.repeatPass())
        {
            self.repeatPassError("Passwords don't match");
            e=true;
        }
        if(!e)
            {
                var packet={
                    "password":self.newPass(),
                };
                self.context.repositories["modifyUser"].modify(self.context,
        packet).then(function (result) {
          self.context.events[id](self.context, self.output);
        }).catch(function (e) {
            if (e.textStatus) {
              self.modifyError(e.textStatus);
            } else {
                self.modifyError(e.message);
            }
        });
               
            }
    };
}

ViewModel.prototype.id = 'changepasswordform';

ViewModel.prototype.waitForStatusChange = function () {
    return this._initializing ||
           Promise.resolve();
};

ViewModel.prototype._compute = function () {
    this.output = {
        'New Password': this.input['New Password'],
        'Repeat Password': this.input['Repeat Password'],
        'Old Password': this.input['Old Password'],
    }
    var self = this,
        fields = {
            'New Password': ko.observable(this.input['New Password']),
            'Repeat Password': ko.observable(this.input['Repeat Password']),
            'Old Password': ko.observable(this.input['Old Password']),
        },
        errors = {
            'New Password': ko.observable(this.input['New Password-error']),
            'Repeat Password': ko.observable(this.input['Repeat Password-error']),
             'Old Password': ko.observable(this.input['Old Password-error']),
        };
    fields['New Password'].subscribe(function (value) {
        self.output['New Password'] = value;
        self.errors()['New Password'](undefined);
    });
    fields['Repeat Password'].subscribe(function (value) {
        self.output['Repeat Password'] = value;
        self.errors()['Repeat Password'](undefined);
    });
    fields['Old Password'].subscribe(function (value) {
        self.output['Old Password'] = value;
        self.errors()['Old Password'](undefined);
    });
    this.fields(fields);
    this.errors(errors);
    this.status('computed');
};


ViewModel.prototype.init = function (options) {
    options = options || {};
    this.output = undefined;
    this.fields({});
    this.errors({});
    this.input = options.input || {};
    this.status('ready');
    var self = this;
    this._initializing = new Promise(function (resolve) {
        setTimeout(function () {
            self._compute();
            resolve();
            self._initializing = undefined;
        }, 1);
    });
};

exports.register = function () {
    ko.components.register('c-changepasswordform', {
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
