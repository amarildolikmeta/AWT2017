/*jslint node:true, nomen: true */
"use strict";
function Repository(server) {
    if (!(this instanceof Repository)) {
        return new Repository(server);
    }
    this._server = "http://awt.ifmledit.org" || '';
}
var $ = require('jquery'),
    Promise = require('bluebird');
Repository.prototype.log_in = function (context,packet) {
    var self = this;
    
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: context.repositories["server"]+"/api/auth",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
             headers: {
            "Authorization": "APIKey "+context.repositories["APIKey"]
            },
            data:JSON.stringify(packet),
        }).done(function (result) {
            context.repositories["tasks"].setFlag(false);
            context.repositories["userAPI"].setFlag(false);
            resolve(result.token);
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

exports.Repository = Repository;
exports.createRepository = Repository;