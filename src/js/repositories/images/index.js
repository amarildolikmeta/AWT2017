/*jslint node: true, nomen: true */
"use strict";

var Promise = require('bluebird'),
    DataStore = require('nedb');

function Repository(options) {
    if (!(this instanceof Repository)) {
        return new Repository(options);
    }

    // TODO: initialization
    
    // TODO: remove this BEGIN
    this.db = Promise.promisifyAll(new DataStore({
        filename: 'images',
        inMemoryOnly: true
    }));
    //this.db.insert(require('./default'));
    // TODO: remove this END
}

Repository.prototype.getImageStatistics = function (context,id) {
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

Repository.prototype.getImages = function (context) {
    var self = this;
    
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: context.repositories["server"] +""+context.repositories["currentCampaign"].campaign["image"],
            type: "GET",
            contentType: "application/json",
            dataType:"json",
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            },
        }).done(function (result,a,request) {
            self.db = Promise.promisifyAll(new DataStore({
            filename: 'images',
            inMemoryOnly: true
            }));
            self.db.insert(result.images);
            if(result.images.length==0)
                resolve("No images in the campaign");
            else
                resolve("Images Loaded")
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
                error.textStatus="Error while loading images";    
            reject(error);
        });
    });
};
Repository.prototype.deleteImage = function (context,url) {
    var self = this;
    
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: context.repositories["server"] +url,
            type: "DELETE",
            contentType: "application/json",
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            },
        }).done(function (result,a,request) {
                self.db.remove({id:url});
                resolve("Images Loaded")
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
                error.textStatus="Error while loading images";    
            reject(error);
        });
    });
};
Repository.prototype.upload = function (context,image) {
    var self = this;
    var fd = new FormData();
        fd.append("image", image); // Append the file
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: context.repositories["server"] +""+context.repositories["currentCampaign"].campaign["image"],
            type: "POST",
            contentType: false,
            processData: false,
            data:fd,
             headers: {
            "Authorization": "APIToken "+context.repositories["token"]
            },
        }).done(function (result,a,request) {
            resolve(request.getResponseHeader("Location"));
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
                error.textStatus="Upload Failed";    
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
Repository.prototype.findById = function (id) {
    // TODO: implement the accessor to the datasource which returns a promise
    // TODO: remove this BEGIN
    return this.db.findOneAsync({id: id});
    // TODO: remove this END
};
exports.createRepository = Repository;
