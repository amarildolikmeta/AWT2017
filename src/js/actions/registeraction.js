/*jslint node: true, nomen: true */
"use strict";
var $ = require('jquery'),
    Promise = require('bluebird');


function Action() { // add "options" parameters if needed
    // TODO: Global Initialization
    /*
    example:
    this.collection = options.repositories.mail;
    */
}
Action.prototype.run = function (parameters, solve) { // add "onCancel" parameters if needed
    // Parameters:
    // parameters['ConfirmPassword']
    // parameters['Fullname']
    // parameters['Password']
    // parameters['TypeAccount']
    // parameters['Username']

    // TODO: Execution
    /*
    example:
    mail.find({subject: 'Re: ' + data.subject})
        .then(solve);
    */
    // THIS CAN BE REMOVED (BEGIN)
    
    $.notify({message: 'Registered'}, {allow_dismiss: true, type: 'success'});
    solve({
        event: 'registerresult', // Registered
        data: {
            'Fullname': parameters['Fullname'],
            'Token': '0',
            'Username': parameters['Username'],
        }
    });
    // THIS CAN BE REMOVED (END)
};

exports.createAction = function (options) {
    var action = new Action(options);
    return function (data) {
        return new Promise(function (solve, reject, onCancel) {
            var parameters = (data && data.filters) || {};
            action.run(parameters, solve, onCancel);
        });
    };
};
