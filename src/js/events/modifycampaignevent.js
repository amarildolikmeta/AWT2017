/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context) {
        var promise = context.actions['getcurrentcampaigndetailsaction']();
        context.runningActionsByContainer['campaigncontainer'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['campaigncontainer'].splice(
                context.runningActionsByContainer['campaigncontainer'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
