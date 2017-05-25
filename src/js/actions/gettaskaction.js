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

    // TODO: Execution
    /*
    example:
    mail.find({subject: 'Re: ' + data.subject})
        .then(solve);
    */
    // THIS CAN BE REMOVED (BEGIN)
    var e="gotoannotation";
    if(parameters["type"]==="selection")
        e="gotoselection"
    context.repositories["tasks"].startSession(context,parameters["id"],"getSessionUrl").then(function(result){
         $.notify({message: 'Work Session Started'}, {allow_dismiss: true, type: 'success'});
    solve({
        event: e, // Image Selection
        // event: 'gotoannotation', // Image Annotation fuck
        data: {
            "session":result.session,
            "task":result.task,
        }
    });
    }).catch(function(e){
        if(e.textStatus===404)
            error("No images available");
        else if (e.textStatus) {
              error(e.textStatus);
            } else {
                error(e.message);
            }
    });
   
    // THIS CAN BE REMOVED (END)
};

exports.createAction = function (options) {
    var action = new Action(options);
    return function (error,context,data) {
        return new Promise(function (solve, reject, onCancel) {
            var parameters = (data && data.filters) || {};
            action.run(error,context,parameters, solve, onCancel);
        });
    };
};
