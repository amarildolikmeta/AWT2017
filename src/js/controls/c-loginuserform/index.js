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
    self.username=ko.observable("");
    self.password=ko.observable("");
    self.loginError=ko.observable();
    self.usernameError=ko.observable();
    self.passwordError=ko.observable();
    self.username.subscribe(function(){
        self.usernameError(undefined);
        self.loginError(undefined);
    });
    self.password.subscribe(function(){
        self.passwordError(undefined);
        self.loginError(undefined);
    });
    self.trigger = function (id) {
        var e=false;
        if(self.username()==="")
        {
            self.usernameError("Username can't be empty");
            e=true;
        }
         if(self.password().length<8)
        {
            self.passwordError("Password must be at least 8 characters");
            e=true;
        }
        if(!e)
        {
            self.output={
                'Username': self.username(),
                'Password': self.password()
            }
            var packet={
                'username': self.username(),
                'password': self.password()
            }
            self.context.repositories["log-in"].log_in(self.context, 
                packet).then(function (result) {
            self.context.repositories["token"]=result;
            //Get Credentials and save in repository
            self.context.events[id](self.context,self.output);
        }).catch(function (e) {
            if (e.textStatus) {
              self.loginError(e.textStatus);
            } else {
                self.loginError(e.message);
            }
        });
        }
    };
}

ViewModel.prototype.id = 'loginuserform';

ViewModel.prototype.waitForStatusChange = function () {
    return this._initializing ||
           Promise.resolve();
};

ViewModel.prototype._compute = function () {
    this.output = {
        'Password': this.input['Password'],
        'Username': this.input['Username'],
    }
    var self = this,
        fields = {
            'Password': ko.observable(this.input['Password']),
            'Username': ko.observable(this.input['Username']),
        },
        errors = {
            'Password': ko.observable(this.input['Password-error']),
            'Username': ko.observable(this.input['Username-error']),
        };
    fields['Password'].subscribe(function (value) {
        self.output['Password'] = value;
        self.errors()['Password'](undefined);
    });
    fields['Username'].subscribe(function (value) {
        self.output['Username'] = value;
        self.errors()['Username'](undefined);
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
    ko.components.register('c-loginuserform', {
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
