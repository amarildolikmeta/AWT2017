/*jslint node: true, nomen: true */
"use strict";

var ko = require('knockout'),
    Promise = require('bluebird');
var count ;
var t;
function ViewModel(params) {
    var self = this;
    self._repository = params.context.repositories['images'];
    self.context = params.context;
    self.status = ko.observable('');
    self.selected = ko.observable(undefined);
    self.items = ko.observableArray([]);
    self.loadError=ko.observable();
    self.images=[];
    self.selectedMessage=ko.observable();
    self.select = function() {
        self.selected(this.id);
        self.output = this;
        self.trigger.call(this, 'selectimagerunningevent');
    };
    self.selectedImages=function(){
        self.selected(undefined);
        self.output = undefined;
       self.context.vms["imagestatisticsrunning"].clear();
        self.selectedMessage("Loading Selected Images");
        self.loadError(undefined);
        self.images=self.items();
        t=self.context.repositories.currentCampaign.campaign.threshold;
        
       count=0;
       if(self.items().length==0)
        return;
       self.selectImage();
    };
    self.selectImage=function(){
        var img=self.items()[count].id;
        count++;
        self.context.repositories.images.getImageStatistics(self.context,img).then(function(res)
        {
            if(res.selection.accepted<t)
                {self.images.splice(count-1, 1);
                    count--;}
            if(count==self.items().length)
            {
                self.items(self.images);
                if(self.images.length)
                    self.selectedMessage("Images selected shown!");
                else
                    self.selectedMessage("No selected images");
            }
            else
                self.selectImage();
        }).catch(function(e){
             if (e.textStatus) {
              self.loadError(message+e.textStatus);
            } else {
                self.loadError("Something went wrong");
            }
        });
    };
    self.trigger = function (id) {
        self.context.events[id](self.context, this);
    };
}

ViewModel.prototype.id = 'runningcampaignimagelist';

ViewModel.prototype.fields = {
    id: 1
    ,'canonical': 1
};

ViewModel.prototype.waitForStatusChange = function () {
    return this._computing ||
           this._initializing ||
           Promise.resolve();
};

ViewModel.prototype._compute = function() {
    var self=this;
    self.loadError(undefined);
    self.selectedMessage(undefined);
    self._repository.getImages(self.context).then(function (result) {
               if(result==="No images in the campaign")
                   self.loadError(result);
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
    ko.components.register('c-runningcampaignimagelist', {
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
