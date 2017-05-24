/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout'),
    Promise = require('bluebird');
var self;
function ViewModel(params) {
    self = this;
    self.context = params.context;
    self.status = ko.observable('');
    self.fields = ko.observable({});
    self.errors = ko.observable({});
    self.success=ko.observable();
    self.uploadError=ko.observable();
    self.image=ko.observable();
    self.trigger = function (id) {
        self.context.events[id](self.context, self.output);
    };
    self.uploadImage=function(file)
    {
       self.success(undefined);
       self.uploadError(undefined);
       self.context.repositories["images"].upload(self.context,file).then(function (result) {
               self.success("Image Uploaded. Upload another one");
        }).catch(function (e) {
            if (e.textStatus) {
              self.uploadError(e.textStatus);
            } else {
                self.uploadError(e.message);
            }
        });
    };
}

ViewModel.prototype.id = 'imageuploadform';

ViewModel.prototype.waitForStatusChange = function () {
    return this._initializing ||
           Promise.resolve();
};

ViewModel.prototype._compute = function () {
    this.output = {
        'image': this.input['image'],
    }
    var self = this,
        fields = {
            'image': ko.observable(this.input['image']),
        },
        errors = {
            'image': ko.observable(this.input['image-error']),
        };
    fields['image'].subscribe(function (value) {
        self.output['image'] = value;
        self.errors()['image'](undefined);
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
    ko.components.register('c-imageuploadform', {
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
