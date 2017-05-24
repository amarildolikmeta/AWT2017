/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        data = data || {};
        var packet = {
            'Fullname' : data['Fullname']
            ,'Password' : data['Password']
            ,'TypeAccount' : data['TypeAccount']
            ,'Username' : data['Username']
        };
        var promise = context.actions['registeraction'](context,{filters: packet});
        context.runningActionsByContainer['indexpage'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['indexpage'].splice(
                context.runningActionsByContainer['indexpage'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
