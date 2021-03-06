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
Repository.prototype.setDetails=function(details,context){
    for (var key in details) {
  if (details.hasOwnProperty(key)) {
    this.campaign[key]=details[key];
  }
}
 context.repositories["campaigns"].setFlag(false);
};
Repository.prototype.publish = function (context) {
    var self = this;
    context.repositories["campaigns"].setFlag(false);
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
                error.textStatus="Failed to publish";    
            reject(error);
        });
    });
};
Repository.prototype.terminate = function (context) {
    var self = this;
     context.repositories["campaigns"].setFlag(false);
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: context.repositories["server"]+self.campaign["execution"],
            type: "DELETE",
            contentType: "application/json",
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            },
        }).done(function () {
            resolve("DELETED");
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
                error.textStatus="Failed to terminate";    
            reject(error);
        });
    });
};
Repository.prototype.getCampaignStatistics = function (context) {
    var self = this;
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: context.repositories["server"]+self.campaign["statistics"],
            type: "GET",
            contentType: "application/json",
            dataType:"json",
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            },
        }).done(function (result) {
            resolve(result);
        }).error(function (err) {
           
            var error=new Error(err);
            if(err.responseJSON)
                error.textStatus=JSON.stringify(err.responseJSON.error);
            else if(err.responseText)
                error.textStatus=err.responseText;
            else if (err.message)
                error.textStatus=err.message;
            else
                error.textStatus="Couldn't load Statistics ";    
            reject(error);
        });
    });
};
exports.createRepository = Repository;
