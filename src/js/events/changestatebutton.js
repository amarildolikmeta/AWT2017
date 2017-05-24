/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        data = data || {};
        var packet = {
            'state' : data['state']
            ,'id' : data['url']
        };
        var promise = context.actions['statechangeaction']({filters: packet});
        context.runningActionsByContainer['campaignlistcontainer'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['campaignlistcontainer'].splice(
                context.runningActionsByContainer['campaignlistcontainer'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
