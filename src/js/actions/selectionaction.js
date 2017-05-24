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
    // parameters['id']
    // parameters['selection']

    // TODO: Execution
    /*
    example:
    mail.find({subject: 'Re: ' + data.subject})
        .then(solve);
    */
    var method;
    if(parameters['selection'])
        method="DELETE";
    else
        method="POST";
        context.repositories["workers"].setTask(context,method,"selection",parameters["id"]).then(function (result) {
               $.notify({message: 'Done'}, {allow_dismiss: true, type: 'success'});
                    
                    solve({
                    event: 'annotationresultevent', // Annotation result
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
    // THIS CAN BE REMOVED (BEGIN)
    
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
