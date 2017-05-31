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
    this.flag=false;
    // TODO: remove this BEGIN
    this.db = Promise.promisifyAll(new DataStore({
        filename: 'tasks',
        inMemoryOnly: true
    }));
    this.db.insert(require('./default'));
    // TODO: remove this END
    self=this;
}
Repository.prototype.getFlag=function(){
        return this.flag;
};
Repository.prototype.setFlag=function(flag){
        this.flag=flag;
};
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
Repository.prototype.getTask = function (context,session) {
    
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: context.repositories["server"]+session,
            type: "GET",
            contentType: "application/json",
            dataType:"json",
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            },
           error: function(err, textStatus, errorThrown) { 
            if(err.status == 404 || errorThrown == 'Not Found') 
            { 
                var e=new Error(err);
                e.textStatus=err.status;
                reject(e);
                
             }
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
                error.textStatus="Couldn't get new task";    
            reject(error);
            },
        }).done(function (result,a,request) {
            
            resolve(result);
        });
    });
};
Repository.prototype.sendResult = function (context,session,accepted,optional) {
   var packet={
       "accepted":accepted
   };
   if(optional)
        packet={
            "skyline":accepted
        };
    
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: context.repositories["server"]+session,
            type: "PUT",
            contentType: "application/json",
            dataType:"json",
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            },
            data:JSON.stringify(packet),
            success: function (data) {
            resolve("Done")
            },
           error: function(err, textStatus, errorThrown) { 
            if(err.status == 404 || errorThrown == 'Not Found') 
            { 
                var e=new Error(err);
                e.textStatus=err.status;
                reject(e);
                
             }
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
                error.textStatus="Error while sending the result";    
            reject(error);
            },
        }).done(function (result,a,request) {
            resolve("Done");
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
            var session=result.session;
            $.ajax({
            url: context.repositories["server"] +result.session,
            type: "POST",
            contentType: "application/json",
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            },
            error: function(err, textStatus, errorThrown) { 
               
            if(err.status == 404 || err.status == 412  || errorThrown == 'Not Found') 
            { 
                var e=new Error(err);
                e.textStatus=err.status;
                reject(e);
                
             }
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
                error.textStatus="Couln't start a new session";    
            reject(error);
            },
        }).done(function (result,a,request) {
            var res={
                session:session,
                task:result
            }
            resolve(res);
        });
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
            error: function(jqXHR, textStatus, errorThrown) { 
            if(jqXHR.status == 404 || errorThrown == 'Not Found') 
            { 
                var e=new Error(jqXHR);
                e.textStatus=jqXHR.status;
                resolve(e);
             }
            },
        }).done(function (result,a,request) {
           resolve(id);
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
                error.textStatus="Couln't start a new session";    
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
