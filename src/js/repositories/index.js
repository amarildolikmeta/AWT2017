/*jslint node: true, nomen: true */
"use strict";

exports.createRepositories = function (options) {
    var repositories = {}
    repositories['completed'] = require('./completed').createRepository(options);
    repositories['user'] = require('./user').createRepository(options);
    repositories['ImageSelection'] = require('./ImageSelection').createRepository(options);
    repositories['types'] = require('./types').createRepository(options);
    repositories['tasks'] = require('./tasks').createRepository(options);
    repositories['imageannotation'] = require('./imageannotation').createRepository(options);
    repositories['images'] = require('./images').createRepository(options);
    repositories['annotation'] = require('./annotation').createRepository(options);
    repositories['execution'] = require('./execution').createRepository(options);
    repositories['campaigns'] = require('./campaigns').createRepository(options);
    repositories['tasksTypes'] = require('./tasksTypes').createRepository(options);
    repositories['workers'] = require('./workers').createRepository(options);
    repositories['register']= require('./register').createRepository(options);
    repositories['log-in']= require('./log-in').createRepository(options);
    repositories["userAPI"]=require('./user').createRepository(options);
    repositories["modifyUser"]=require('./modifyUser').createRepository(options);
    repositories["logOut"]=require('./logOut').createRepository(options);
    repositories["createCampaign"]=require('./createCampaign').createRepository(options);
    repositories["getCampaigns"]=require('./getCampaigns').createRepository(options);
    repositories["getCampaignDetails"]=require('./getCampaignDetails').createRepository(options);
    repositories["APIKey"]="5568af19-9656-4d8f-91f6-ac7752f1a238";
    repositories["server"]="http://awt.ifmledit.org";
    repositories["token"]="";
    repositories["type"]="";
    repositories["currentCampaign"]=require('./currentCampaign').createRepository(options);;
    return repositories;
};
