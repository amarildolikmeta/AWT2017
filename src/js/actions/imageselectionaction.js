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
Action.prototype.run = function (context,parameters, solve) { // add "onCancel" parameters if needed
    // Parameters:
    // parameters['id']
    // parameters['selection']

    // TODO: Execution
    /*
    example:
    mail.find({subject: 'Re: ' + data.subject})
        .then(solve);
    */
    // THIS CAN BE REMOVED (BEGIN)
    context.repositories["tasks"].sendResult(context,parameters.session,parameters.accepted).then(function(result){
        $.notify({message: 'Selection Sent'}, {allow_dismiss: true, type: 'success'});
    solve({
        event: 'selectioncompletedevent', // event
        data: {
            session:parameters.session
        }
    });
    }).catch(function(e){
        if(e.textStatus==404)
        {
            alert("No more images in campaign");
            context.events['workertohome'](context);
        }
        else{
        $.notify({message: 'Selection Sent'}, {allow_dismiss: true, type: 'success'});
       solve({
        event: 'selectioncompletedevent', // event
        data: {
            session:parameters.session
        }});
    }
    });
    
    // THIS CAN BE REMOVED (END)
};

exports.createAction = function (options) {
    var action = new Action(options);
    return function (context,data) {
        return new Promise(function (solve, reject, onCancel) {
            var parameters = (data && data.filters) || {};
            action.run(context,parameters, solve, onCancel);
        });
    };
};
