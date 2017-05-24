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
    self.fullname=ko.observable("");
    self.password=ko.observable("");
    self.confirm=ko.observable("");
    self.master=ko.observable(false);
    self.usernameError=ko.observable();
    self.fullnameError=ko.observable();
    self.passwordError=ko.observable();
    self.confirmError=ko.observable();
    self.registerError=ko.observable();
    self.result=ko.observable("");
    self.username.subscribe(function(){
        self.usernameError(undefined);
        self.result("");
        self.registerError(undefined);
    });
    self.fullname.subscribe(function(){
        self.fullnameError(undefined);
        self.result("");
        self.registerError(undefined);
    });
    self.password.subscribe(function(){
        self.passwordError(undefined);
        self.result("");
        self.registerError(undefined);
    });
    self.confirm.subscribe(function(){
        self.confirmError(undefined);
        self.result("");
        self.registerError(undefined);
    });
    self.trigger = function (id) {
        
        var e=false;
        if(self.username()==="")
        {
            self.usernameError("Username can't be empty");
            e=true;
        }
         if(self.fullname()==="")
        {
            self.fullnameError("Fullname can't be empty");
            e=true;
        }
         if(self.password()==="")
        {
            self.passwordError("Insert a password");
            e=true;
        }
        if(self.password()!=self.confirm())
        {
            self.confirmError("Passwords don't match!");
            e=true;
        }
        if(!e)
            {
                var type;
                if(self.master())
                    type="master";
                else
                    type="worker"
              self.output = {
                 'fullname': self.fullname(),
                 'username': self.username(),
                 'password': self.password(),
                 'type': type
                 };
              
              self.context.repositories["register"].register(self.context,
                  self.output).then(function (result) {
            self.result("User Registered");
        }).catch(function (e) {
            if (e.textStatus) {
              self.registerError(e.textStatus);
            } else {
                self.registerError(e.message);
            }
        });
              }
       
        //
    };
}

ViewModel.prototype.id = 'registeruserfrom';

ViewModel.prototype.waitForStatusChange = function () {
    return this._initializing ||
           Promise.resolve();
};

ViewModel.prototype._compute = function () {
    
    this.output = {
        'ConfirmPassword': this.input['ConfirmPassword'],
        'Fullname': this.input['Fullname'],
        'Password': this.input['Password'],
        'TypeAccount': this.input['TypeAccount'],
        'Username': this.input['Username'],
    }
    var self = this,
        fields = {
            'ConfirmPassword': ko.observable(this.input['ConfirmPassword']),
            'Fullname': ko.observable(this.input['Fullname']),
            'Password': ko.observable(this.input['Password']),
            'TypeAccount': ko.observable(this.input['TypeAccount']),
            'Username': ko.observable(this.input['Username']),
        },
        errors = {
            'ConfirmPassword': ko.observable(this.input['ConfirmPassword-error']),
            'Fullname': ko.observable(this.input['Fullname-error']),
            'Password': ko.observable(this.input['Password-error']),
            'TypeAccount': ko.observable(this.input['TypeAccount-error']),
            'Username': ko.observable(this.input['Username-error']),
        };
    fields['ConfirmPassword'].subscribe(function (value) {
        self.output['ConfirmPassword'] = value;
        self.errors()['ConfirmPassword'](undefined);
    });
    fields['Fullname'].subscribe(function (value) {
        self.output['Fullname'] = value;
        self.errors()['Fullname'](undefined);
    });
    fields['Password'].subscribe(function (value) {
        self.output['Password'] = value;
        self.errors()['Password'](undefined);
    });
    fields['TypeAccount'].subscribe(function (value) {
        self.output['TypeAccount'] = value;
        self.errors()['TypeAccount'](undefined);
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
    ko.components.register('c-registeruserfrom', {
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
