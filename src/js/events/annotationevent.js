/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (error,context, data) {
        data = data || {};
        var packet = {
            'annotation' : data['annotator']
            ,'id' : data['id']
        };
        var promise = context.actions['annotationaction'](error,{filters: packet},context);
        context.runningActionsByContainer['selectworkerscontainer'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['selectworkerscontainer'].splice(
                context.runningActionsByContainer['selectworkerscontainer'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
