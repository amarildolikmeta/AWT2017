/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        data = data || {};
        var packet = {
            'name' : data['Name']
            ,'annotation_replica' : data['annotation_replica']
            ,'annotation_size' : data['annotation_size']
            ,'selection_replica' : data['selection_replica']
            ,'threshold' : data['threshold']
        };
        var promise = context.actions['campaigncreationaction']({filters: packet});
        context.runningActionsByContainer['createcampaignmodel'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['createcampaignmodel'].splice(
                context.runningActionsByContainer['createcampaignmodel'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
