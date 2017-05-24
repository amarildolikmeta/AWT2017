/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (error,context, data) {
        data = data || {};
        var packet = {
            'id' : data['id']
            ,"type":data["type"]
        };
        var promise = context.actions['gettaskaction'](error,context,{filters: packet});
        context.runningActionsByContainer['usertaskscontainer'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['usertaskscontainer'].splice(
                context.runningActionsByContainer['usertaskscontainer'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
