/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        data = data || {};
        var packet = {
            'id' : data['id']
            ,'selection' : data['selection']
        };
        var promise = context.actions['imageselectionaction']({filters: packet});
        context.runningActionsByContainer['selectiontaskview'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['selectiontaskview'].splice(
                context.runningActionsByContainer['selectiontaskview'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
