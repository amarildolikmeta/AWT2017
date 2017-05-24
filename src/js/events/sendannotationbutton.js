/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context) {
        var promise = context.actions['sendannotationaction']();
        context.runningActionsByContainer['annotationtaskview'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['annotationtaskview'].splice(
                context.runningActionsByContainer['annotationtaskview'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
