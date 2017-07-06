/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout'),
    Promise = require('bluebird');

function ViewModel(params) {
    var self = this;
    self._repository = params.context.repositories['tasks'];
    self.context = params.context;
    self.loadError=ko.observable();
    self.taskError=ko.observable();
   
    self.status = ko.observable('');
    self.selected = ko.observable(undefined);
    self.items = ko.observableArray([]);

    self.select = function() {
        self.selected(this.id);
        self.output = this;
    };
    self.message=ko.observable();
    self.errorMessage=ko.observable();
    self.trigger = function (id) {
        self.taskError(undefined);
        if(id=="executetaskbutton")
            self.context.events[id](self.taskError,self.context, this);
        else
            self.context.events[id](self.context, this);
    };
    self.loadAvailable=function(count,items){
        
            
        if(count==self)
            {
                self.message("Loading Available tasks");
                count=0;
                items=self.items();
            }
          
             this._repository.getTaskStatistics(self.context,items[count].id).then(function (item) {
             if(item.available==0){
                items.splice(count,1);
                count--;
            }
             if(count<items.length-1)
             {
                 count++;
                 self.loadAvailable(count,items);
             }
             else{
                 self.items(items);
                 self.message("Loaded")
             }
    }).catch(function(e){
            self.message(undefined);
            self.errorMessage("Something went wrong. Reload the page");
            console.log(e);
    });
}
        }
  

ViewModel.prototype.id = 'taskslist';

ViewModel.prototype.fields = {
    id: 1
    ,'type': 1
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
    if(!self._repository.getFlag()){
       
     self._repository.getTasks(self.context).then(function (result) {
               self._repository.setFlag(true);
               
               self._compute();
               return;
        }).catch(function (e) {
            if (e.textStatus) {
              self.loadError(e.textStatus);
            } else {
                self.loadError(e.message);
            }
        });}
    if(self.filters.type==="both")
        self.filters={};
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
    if (!this.context.vms['tasktypefilter'] || this.context.vms['tasktypefilter'].status() !== 'computed') {
        return false;
    }
    return true;
};

ViewModel.prototype._firstNotReady = function() {
    if (!this.context.vms['tasktypefilter']) {
        return Promise.reject();
    }
    if (this.context.vms['tasktypefilter'].status() !== 'computed') {
        return this.context.vms['tasktypefilter'].waitForStatusChange();
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
            self.context.vms['tasktypefilter'].output &&
            self.context.vms['tasktypefilter'].output['type']);
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
    ko.components.register('c-taskslist', {
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
