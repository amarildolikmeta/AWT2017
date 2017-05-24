/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout'),
    Promise = require('bluebird');

function ViewModel(params) {
    var self = this;
    self.context = params.context;
    self.campaign=self.context.repositories["currentCampaign"].campaign;
    self.status = ko.observable('');
    self.fields = ko.observable({});
    self.errors = ko.observable({});
    self.name=ko.observable(self.campaign["name"]);
    self.selectionReplica=ko.observable(self.campaign["selection_replica"]);
    self.threshold=ko.observable(self.campaign["threshold"]);
    self.annotationReplica=ko.observable(self.campaign["annotation_replica"]);
    self.annotationSize=ko.observable(self.campaign["annotation_size"]);
    self.nameError=ko.observable();
    self.modifyError=ko.observable();
    self.name.subscribe(function(){
        self.nameError(undefined);
        self.modifyError(undefined);
    });
    self.trigger = function (id) {
        if(self.name()==="")
        {
            self.nameError("Name can't be empty");
        }
        else
        {
            var packet={
                "name": self.name(),
                "selection_replica": parseInt(self.selectionReplica()),
                "threshold": parseInt(self.threshold()),
                "annotation_replica": parseInt(self.annotationReplica()),
                "annotation_size": parseInt(self.annotationSize())
            };
            self.context.repositories["createCampaign"].create(self.context,
                  packet,"PUT").then(function (result) {
                self.context.repositories["currentCampaign"].setDetails(packet);
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

ViewModel.prototype.id = 'modifycampaignform';

ViewModel.prototype.waitForStatusChange = function () {
    return this._initializing ||
           Promise.resolve();
};

ViewModel.prototype._compute = function () {
    this.output = {
        'Name': this.input['Name'],
        'annotation_replica': this.input['annotation_replica'],
        'annotation_size': this.input['annotation_size'],
        'selection_replica': this.input['selection_replica'],
        'threshold': this.input['threshold'],
    }
    var self = this,
        fields = {
            'Name': ko.observable(this.input['Name']),
            'annotation_replica': ko.observable(this.input['annotation_replica']),
            'annotation_size': ko.observable(this.input['annotation_size']),
            'selection_replica': ko.observable(this.input['selection_replica']),
            'threshold': ko.observable(this.input['threshold']),
        },
        errors = {
            'Name': ko.observable(this.input['Name-error']),
            'annotation_replica': ko.observable(this.input['annotation_replica-error']),
            'annotation_size': ko.observable(this.input['annotation_size-error']),
            'selection_replica': ko.observable(this.input['selection_replica-error']),
            'threshold': ko.observable(this.input['threshold-error']),
        };
    fields['Name'].subscribe(function (value) {
        self.output['Name'] = value;
        self.errors()['Name'](undefined);
    });
    fields['annotation_replica'].subscribe(function (value) {
        self.output['annotation_replica'] = value;
        self.errors()['annotation_replica'](undefined);
    });
    fields['annotation_size'].subscribe(function (value) {
        self.output['annotation_size'] = value;
        self.errors()['annotation_size'](undefined);
    });
    fields['selection_replica'].subscribe(function (value) {
        self.output['selection_replica'] = value;
        self.errors()['selection_replica'](undefined);
    });
    fields['threshold'].subscribe(function (value) {
        self.output['threshold'] = value;
        self.errors()['threshold'](undefined);
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
    ko.components.register('c-modifycampaignform', {
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
