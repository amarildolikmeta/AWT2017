/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context) {
        var promise = context.actions['homeaction']({"context":context});
        context.runningActionsByContainer['profilecontainer'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['profilecontainer'].splice(
                context.runningActionsByContainer['profilecontainer'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
