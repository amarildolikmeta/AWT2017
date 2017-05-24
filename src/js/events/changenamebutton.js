/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        data = data || {};
        var packet = {
            'Fullname' : data['Fullname']
        };
        var promise = context.actions['changenameaction']({filters: packet});
        context.runningActionsByContainer['fullnamechangecontainer'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['fullnamechangecontainer'].splice(
                context.runningActionsByContainer['fullnamechangecontainer'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
