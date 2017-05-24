/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout'),
    Promise = require('bluebird');

function ViewModel(params) {
    var self = this;
    self._repository = params.context.repositories['images'];
    self.context = params.context;
    self.loadError=ko.observable();
    self.deleteError=ko.observable();
    self._repository.getImages(self.context).then(function (result) {
               if(result==="No images in the campaign")
                   self.context.events["imageupload"](self.context);
               else
                self._compute();
        }).catch(function (e) {
            if (e.textStatus) {
              self.loadError(e.textStatus);
            } else {
                self.loadError(e.message);
            }
        });

    self.status = ko.observable('');
    self.selected = ko.observable(undefined);
    self.items = ko.observableArray([]);

    self.select = function() {
        self.selected(this.id);
        self.output = this;
        //document.getElementById("campaignImageDetails").style.display="block";
        self.trigger.call(this, '27fc9e4c-0710-432a-a1dd-d2c4104bb3e0');
    };

    self.trigger = function (id,url) {
        self.deleteError(undefined);
        self._repository.deleteImage(self.context,url).then(function (result) {
               self.context.events[id](self.context, this);
        }).catch(function (e) {
            if (e.textStatus) {
              self.deleteError(e.textStatus);
            } else {
                self.deleteError(e.message);
            }
        });
        //
    };
}

ViewModel.prototype.id = 'campagnimageslist';

ViewModel.prototype.fields = {
    id:1,
    canonical:1
};

ViewModel.prototype.waitForStatusChange = function () {
    return this._computing ||
           this._initializing ||
           Promise.resolve();
};

ViewModel.prototype._compute = function() {
    var self=this;
    self._repository.getImages(self.context).then(function (result) {
               if(result==="No images in the campaign")
                   self.context.events["imageupload"](self.context);
               else
                {
                    if (self._computing) {
                    self._computing.cancel();
                            }
    
    self._computing = self._repository.find(self.filters, self.fields).then(function (items) {
        self.selected(undefined);
        for(var i=0;i<items.length;i++)
        {
            items[i]["canonical"]=self.context.repositories["server"]+items[i]["canonical"];
        }
        self.items(items);
        if (items.length) {
            self.selected(items[0].id);
            self.output = items[0];
        }
        
        self.status('computed');
        self._computing = undefined;
    });
                }
        }).catch(function (e) {
            if (e.textStatus) {
              self.loadError(e.textStatus);
            } else {
                self.loadError(e.message);
            }
        });

    
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
    ko.components.register('c-campagnimageslist', {
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
