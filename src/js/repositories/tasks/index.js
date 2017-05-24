/*jslint node: true, nomen: true */
"use strict";
var self;
var Promise = require('bluebird'),
    DataStore = require('nedb');

function Repository(options) {
    if (!(this instanceof Repository)) {
        return new Repository(options);
    }

    // TODO: initialization

    // TODO: remove this BEGIN
    this.db = Promise.promisifyAll(new DataStore({
        filename: 'tasks',
        inMemoryOnly: true
    }));
    this.db.insert(require('./default'));
    // TODO: remove this END
    self=this;
}
Repository.prototype.getTasks = function (context) {
    
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: context.repositories["server"]+"/api/task",
            type: "GET",
            contentType: "application/json",
            dataType:"json",
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            },
        }).done(function (result,a,request) {
            self.db = Promise.promisifyAll(new DataStore({
             filename: 'tasks',
                inMemoryOnly: true
            }));
            
            self.db.insert(result.tasks);
            resolve("Tasks Loaded");
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
Repository.prototype.findById = function (id) {
    // TODO: implement the accessor to the datasource which returns a promise
    // TODO: remove this BEGIN
    return this.db.findOneAsync({id: id});
    // TODO: remove this END
};
Repository.prototype.getTaskStatistics = function (context,id) {
    // TODO: implement the accessor to the datasource which returns a promise
    // TODO: remove this BEGIN
    var self = this;
    
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: context.repositories["server"] +id,
            type: "GET",
            contentType: "application/json",
            dataType:"json",
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            },
        }).done(function (result,a,request) {
            $.ajax({
            url: context.repositories["server"] +result.statistics,
            type: "GET",
            contentType: "application/json",
            dataType:"json",
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            },
        }).done(function (result,a,request) {
            resolve(result);
        });
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
                error.textStatus="Error while loading statistics";    
            reject(error);
        });
    });
    // TODO: remove this END
};
Repository.prototype.startSession = function (context,id,optional) {
    // TODO: implement the accessor to the datasource which returns a promise
    // TODO: remove this BEGIN
    var self = this;
    if(optional==="getSessionUrl")
        return new Promise(function (resolve, reject) {
        $.ajax({
            url: context.repositories["server"] +id,
            type: "GET",
            contentType: "application/json",
            dataType:"json",
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            },
        }).done(function (result,a,request) {
            alert("Session:"+result.session);
            $.ajax({
            url: context.repositories["server"] +result.session,
            type: "POST",
            contentType: "application/json",
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            },
        }).done(function (result,a,request) {
            resolve("Started Session");
        });
    }).error(function (err) {
            /*var error = new Error(errorThrown);
            error.responseText =  $.parseJSON(jqXHR.responseText);
            error.textStatus = textStatus;
            error.jqXHR = jqXHR;
            error.errors = jqXHR.responseJSON.errors;*/
            var error=new Error(err);
            if(err.status)
                error.status=err.status;
            else if(err.responseJSON)
                error.textStatus=JSON.stringify(err.responseJSON.error);
            else if(err.responseText)
                error.textStatus=err.responseText;
            else if (err.message)
                error.textStatus=err.message;
            else
                error.textStatus="Error while loading statistics";    
            reject(error);
        });
    });
    else 
    {
         return new Promise(function (resolve, reject) {
        $.ajax({
            url: context.repositories["server"] +id,
            type: "POST",
            contentType: "application/json",
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            },
        }).done(function (result,a,request) {
           resolve
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
                error.textStatus="Error while loading statistics";    
            reject(error);
        });
    });
    }
};
Repository.prototype.find = function (fields, project) {
    // TODO: implement the accessor to the datasource which returns a promise
    // TODO: remove this BEGIN
    return this.db.findAsync(fields, project);
    // TODO: remove this END
};

exports.createRepository = Repository;