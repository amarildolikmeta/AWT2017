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
repository.prototype.setDetails=function(details){
    this.campaign=details
};

exports.createRepository = Repository;
