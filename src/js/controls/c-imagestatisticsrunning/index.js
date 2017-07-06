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
    self.img=ko.observable();
    self.Error=ko.observable();
    self.trigger = function (id) {
        self.context.events[id](self.context, self.item()["annotation"],self.filters.canonical);
    };
    self.clear=function(){
        self.item(undefined);
    }
}

ViewModel.prototype.id = 'imagestatisticsrunning';

ViewModel.prototype.fields = {
    id: 1
    ,'rejected': 1
    ,'accepted': 1
    ,'canonical': 1
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
    if(this.filters.id)
    {
    self.Error(undefined);
   
    this._computing = this._repository.getImageStatistics(this.context,this.filters.id).then(function (item) {
        self.output = item;
       
        self.img(self.filters.canonical);
        self.item(item);
      if(!item.annotation.length)
      {
           
            document.getElementById("annotationButton").disabled=true;
      }
        else
        {
           
            document.getElementById("annotationButton").disabled=false;
        }
        self.status('computed');
        self._computing = undefined;
    }).catch(function(e){
        if(e.textStatus)
            self.Error(e.textStatus);
        else
            self.Error("Couldn't load statistics");
    });}
};


ViewModel.prototype.init = function (options) {
    options = options || {};
    this.output = undefined;
    this.filters = options.input || {};
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
    ko.components.register('c-imagestatisticsrunning', {
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
