/*jslint node: true, nomen: true */
"use strict";

var Promise = require('bluebird');

function Action() { // add "options" parameters if needed
    // TODO: Global Initialization
    /*
    example:
    this.collection = options.repositories.mail;
    */
}
Action.prototype.run = function (error,context,parameters, solve) { // add "onCancel" parameters if needed
    // Parameters:
    // parameters['annotation']
    // parameters['id']

    // TODO: Execution
    /*
    example:
    mail.find({subject: 'Re: ' + data.subject})
        .then(solve);
    */
    // THIS CAN BE REMOVED (BEGIN)
    var method;
    if(parameters['annotation'])
        method="DELETE";
    else
        method="POST";
        context.repositories["workers"].setTask(context,method,"annotation",parameters["id"]).then(function (result) {
               
                solve({
                    event: 'selectionresultevent', // Selection Result
                    data: {
                }
                });
        }).catch(function (e) {
            if (e.textStatus) {
              error(e.textStatus);
            } else {
                error(e.message);
            }
        });
    
    // THIS CAN BE REMOVED (END)
};

exports.createAction = function (options) {
    var action = new Action(options);
    return function (error,data,context) {
        return new Promise(function (solve, reject, onCancel) {
            var parameters = (data && data.filters) || {};
            action.run(error,context,parameters, solve, onCancel);
        });
    };
};
