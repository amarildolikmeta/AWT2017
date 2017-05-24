/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        data = data || {};
        var packet = {
            'image' : data['image']
        };
        var promise = context.actions['imageuploadaction']({filters: packet});
        context.runningActionsByContainer['imageuploadcontainer'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['imageuploadcontainer'].splice(
                context.runningActionsByContainer['imageuploadcontainer'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
