/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        data = data || {};
        var packet = {
            'name' : data['Name']
            ,'annotation_replica' : data['annotation_replica']
            ,'annotation_size' : data['annotation_size']
            ,'selection_replica' : data['selection_replica']
            ,'theshold' : data['threshold']
        };
        var promise = context.actions['changecamapignaction']({filters: packet});
        context.runningActionsByContainer['modifycampaignformcontainer'].push(promise);
        promise.then(function (result) {
            context.runningActionsByContainer['modifycampaignformcontainer'].splice(
                context.runningActionsByContainer['modifycampaignformcontainer'].indexOf(promise), 1
            );
            if (result.event) {
                context.events[result.event](context, result.data);
            }
        });
    };
};
