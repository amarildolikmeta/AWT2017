/*jslint node: true, nomen: true */
"use strict";

var Promise = require('bluebird'),
    DataStore = require('nedb');

function Repository(options) {
    if (!(this instanceof Repository)) {
        return new Repository(options);
    }

    // TODO: initialization
    var self=this;
    // TODO: remove this BEGIN
    this.campaign={};
    //this.db.insert(require('./default'));
    // TODO: remove this END
}
Repository.prototype.clear=function(){
    this.campaign={};
};

Repository.prototype.setURL=function(url){
    this.campaign["url"]=url;
};
Repository.prototype.setExecutionURL=function(executionUrl){
    this.campaign["execution"]=executionUrl;
};
Repository.prototype.setDetails=function(details){
    for (var key in details) {
  if (details.hasOwnProperty(key)) {
    this.campaign[key]=details[key];
  }
}
};
Repository.prototype.publish = function (context) {
    var self = this;
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: context.repositories["server"]+self.campaign["execution"],
            type: "POST",
            contentType: "application/json",
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            },
        }).done(function () {
            resolve("Published");
        }).error(function (err) {
            /*var error = new Error(errorThrown);
            error.responseText =  $.parseJSON(jqXHR.responseText);
            error.textStatus = textStatus;
            error.jqXHR = jqXHR;
            error.errors = jqXHR.responseJSON.errors;*/
            var error=new Error(err);
            if(err.responseJSON)
                error.textStatus=JSON.stringify(err.responseJSON.error);
            else if(err.responseText)
                error.textStatus=err.responseText;
            else if (err.message)
                error.textStatus=err.message;
            else
                error.textStatus="Something Went Wrong in the request";    
            reject(error);
        });
    });
};
exports.createRepository = Repository;
