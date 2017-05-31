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
Action.prototype.run = function (parameters, solve) { // add "onCancel" parameters if needed
    // Parameters:
    // parameters['state']
    // parameters['url']

    // TODO: Execution
    /*
    example:
    mail.find({subject: 'Re: ' + data.subject})
        .then(solve);
    */
    // THIS CAN BE REMOVED (BEGIN)
    
    var e="unpublishedcampaignresult";
    if(parameters.status==="started")
        e="runningcampaign";
    else if(parameters.status==="ended")
        e='completedcampaignresult';
    
    
    solve({
        event: e, // Unpublished Campaign
        // event: 'completedcampaignresult', // Completed Campaign Result
        // event: 'runningcampaign', // Campaign Running
        data: {
            'details': '0',
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
