/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        data = data || {};
        var packet = {
            'New Password' : data['New Password']
            ,'Old Password' : data['Old Password']
            ,'Repeat Password' : data['Repeat Password']
        };
        var promise = context.actions['changepasswordaction']({filters: packet});
        context.runningActionsByContainer['changepasswordcontainer'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['changepasswordcontainer'].splice(
                context.runningActionsByContainer['changepasswordcontainer'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
