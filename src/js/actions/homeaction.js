/*jslint node: true, nomen: true */
"use strict";

var Promise = require('bluebird');

function Action(options) { // add "options" parameters if needed
    // TODO: Global Initialization
    /*
    example:
    this.collection = options.repositories.mail;
    */
    var repos=options.repositories;
}
Action.prototype.run = function (params, solve) { // add "onCancel" parameters if needed
    // Parameters:
    // parameters['token']

    // TODO: Execution
    /*
    example:
    mail.find({subject: 'Re: ' + data.subject})
        .then(solve);
    */
    // THIS CAN BE REMOVED (BEGIN)
    var e="";
    
    if(params["type"]=="master")
        e="managettohome"
    else
        e="workertohome"
   
    solve({
        event: e, // ManagerResult
        // event: 'workertohome', // Worker Result
        data: {
        }
    });
    // THIS CAN BE REMOVED (END)
};

exports.createAction = function (options) {
    var action = new Action(options);
    return function (data) {
        return new Promise(function (solve, reject, onCancel) {
            var parameters = (data && data.filters) || {};
            action.run(options.repositories, solve, onCancel);
        });
    };
};
