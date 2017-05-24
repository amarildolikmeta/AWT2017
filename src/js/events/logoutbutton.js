/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context) {
        var promise = context.actions['logoutaction']();
        context.runningActionsByContainer['app'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['app'].splice(
                context.runningActionsByContainer['app'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
