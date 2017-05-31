/*jslint node: true, nomen: true */
"use strict";

var Promise = require('bluebird'),
    DataStore = require('nedb');
var self,count;
function Repository(options) {
    if (!(this instanceof Repository)) {
        return new Repository(options);
    }

    // TODO: initialization

    // TODO: remove this BEGIN
    this.db = Promise.promisifyAll(new DataStore({
        filename: 'workers',
        inMemoryOnly: true
    }));
    self=this;
    // TODO: remove this END
}
Repository.prototype.setTask = function (context,method,type,id) {
   
    var url="";
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
            url=result[type];
            $.ajax({
            url: context.repositories["server"] +url,
            type: method,
            contentType: "application/json",
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            },
        }).done(function (result,a,request) {
            resolve("Done");
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
                error.textStatus="Error while executing task";    
            reject(error);
        });
    });
};
Repository.prototype.workerDetail = function (context,worker) {
    
    
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: context.repositories["server"]+worker,
            type: "GET",
            contentType: "application/json",
            dataType:"json",
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            }
        }).done(function (result) {
            resolve(result);
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
                error.textStatus="Couldn't load worker details";    
            reject(error);
        });
    });
};
Repository.prototype.getWorkers = function (context) {
    
    
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: context.repositories["server"] +""+context.repositories["currentCampaign"].campaign["worker"],
            type: "GET",
            contentType: "application/json",
            dataType:"json",
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            },
        }).done(function (result,a,request) {
            self.db = Promise.promisifyAll(new DataStore({
            filename: 'workers',
            inMemoryOnly: true
            }));
            var workers=result.workers;
             
            var item;
            for (var i=0 ;i< workers.length;i++){
                item=workers[i];
            if(item.selector&item.annotator)
            {
                workers[i]["type"]="Both";
                 workers[i]["selectionAction"]="Deselect";
                 workers[i]["annotationAction"]="DeAnnotate";
            }
            else if(item.selector){
                 workers[i]["type"]="Selection";
                workers[i]["selectionAction"]="Deselect";
                 workers[i]["annotationAction"]="Annotate";
            }
            else if(item.annotator){
                 workers[i]["type"]="Annotation";
                 workers[i]["selectionAction"]="Select";
                 workers[i]["annotationAction"]="DeAnnotate";
            }
            else{
                 workers[i]["selectionAction"]="Select";
                 workers[i]["annotationAction"]="Annotate";
                 workers[i]["type"]="None";
            }
                
        }
            self.workerList=workers;
            self.db.insert(workers);
            if(result.workers.length==0)
                resolve("No workers in the campaign");
            else
                resolve("Workers Loaded")
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
                error.textStatus="Error while loading workers";    
            reject(error);
        });
    });
};

Repository.prototype.setWorkers = function (workerList) {
    this.db = Promise.promisifyAll(new DataStore({
            filename: 'workers',
            inMemoryOnly: true
            }));
    self.db.insert(workerList);
};
Repository.prototype.findById = function (id) {
    // TODO: implement the accessor to the datasource which returns a promise
    // TODO: remove this BEGIN
    return this.db.findOneAsync({id: id});
    // TODO: remove this END
};

Repository.prototype.find = function (fields, project) {
    // TODO: implement the accessor to the datasource which returns a promise
    // TODO: remove this BEGIN
    return this.db.findAsync(fields, project);
    // TODO: remove this END
};

exports.createRepository = Repository;
