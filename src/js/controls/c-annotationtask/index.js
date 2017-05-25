/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout'),
    Promise = require('bluebird');
  
function ViewModel(params) {
    var self = this;
    self._repository = params.context.repositories['tasks'];
    self.context = params.context;
    self.status = ko.observable('');
    self.item = ko.observable(undefined);
    self.session=ko.observable();
    self.Error=ko.observable();
    self.line=ko.observable();
    self.size=ko.observable();
    self.image=ko.observable();
    self.load=true;
    self.canvas=undefined;
    self.clear=function(){
        if(!self.canvas)
            self.canvas=self.context.vms["line-drawer"];
        self.canvas.clear();
        self.line(); 
    };
    self.trigger = function (id) {
        if(self.line()==="")
        {
            alert("Annotate the picture");
            return;
        }
        var packet={
            "line":self.line()
            ,"session":self.session()
        };
        self.context.events[id](self.context, packet);
    };
    
}

ViewModel.prototype.id = 'annotationtask';

ViewModel.prototype.fields = {
    id: 1,
    'type':1,
    'image':1
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
    if(self.load){
        
    this._computing = this._repository.getTask(this.context,this.session()).then(function (item) {
        
        item["image"]=self.context.repositories["server"]+item["image"];
        self.output = item;
        self.image(item["image"]);
        self.size(item["size"]);
        self.status('computed');
        self._computing = undefined;
    }).catch(function (e){
        
        if(e.textStatus==404)
            self.context.events['workertohome'](self.context);
        else
            self.Error(e.textStatus);
    });
    }
    else
        self.load=true;
};


ViewModel.prototype.init = function (options) {
    options = options || {};
    this.output = undefined;
    this.filters = options.input || {};
    if(!this.session())
        this.session(options.session);
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
    ko.components.register('c-annotationtask', {
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
