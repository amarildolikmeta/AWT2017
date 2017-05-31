/*jslint node: true, nomen: true */
"use strict";

var Promise = require('bluebird'),
    DataStore = require('nedb');

function Repository(options) {
    if (!(this instanceof Repository)) {
        return new Repository(options);
    }

    // TODO: initialization
    this.flag=false;
    // TODO: remove this BEGIN
    this.db = Promise.promisifyAll(new DataStore({
        filename: 'campaigns',
        inMemoryOnly: true
    }));
    //this.db.insert(require('./default'));
    // TODO: remove this END
}
Repository.prototype.getFlag=function(){
    return this.flag;
};
Repository.prototype.setFlag=function(flag){
    this.flag=flag;
};
Repository.prototype.findById = function (id) {
    // TODO: implement the accessor to the datasource which returns a promise
    // TODO: remove this BEGIN
    return this.db.findOneAsync({id: id});
    // TODO: remove this END
};
Repository.prototype.getCampaigns = function (context) {
    var self = this;
    self.flag=true;
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: context.repositories["server"]+"/api/campaign",
            type: "GET",
            contentType: "application/json",
            dataType:"json",
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            },
        }).done(function (result,a,request) {
            self.db = Promise.promisifyAll(new DataStore({
             filename: 'campaigns',
                inMemoryOnly: true
            }));
            self.db.insert(result.campaigns);
            resolve("Campaigns Loaded");
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
Repository.prototype.find = function (fields, project) {
    // TODO: implement the accessor to the datasource which returns a promise
    // TODO: remove this BEGIN
    return this.db.findAsync(fields, project);
    // TODO: remove this END
};

exports.createRepository = Repository;
