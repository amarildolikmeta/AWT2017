/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        data = data || {};
        var packet = {
            'id' : data['id']
        };
        var promise = context.actions['b2bf886a-84d9-46d3-87c4-261b16fe72e6']({filters: packet});
        context.runningActionsByContainer['imageslistcontainer'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['imageslistcontainer'].splice(
                context.runningActionsByContainer['imageslistcontainer'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
