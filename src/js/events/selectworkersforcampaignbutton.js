/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context, data) {
        if (!context.vms['croudsourcecontainer']) {
            context.top.active('croudsourcecontainer');
            context.vms['croudsourcecontainer'].init({mask: 'croudsourceviewcontainer'});
        }
        if (!context.vms['app']) {
            context.vms['croudsourceviewcontainer'].active('app');
            context.vms['app'].init({mask: 'appcontainer'});
        }
        if (!context.vms['homepagemanager']) {
            context.vms['appcontainer'].active('homepagemanager');
            context.vms['homepagemanager'].init({mask: 'managerhomecontainer'});
        }
        if (!context.vms['unpublishedcampaigndetails']) {
            context.vms['managerhomecontainer'].active('unpublishedcampaigndetails');
            context.vms['unpublishedcampaigndetails'].init({mask: 'campaigncontainer'});
        }
        if (!context.vms['selectworkerscontainer']) {
            context.vms['campaigncontainer'].active('selectworkerscontainer');
            context.vms['selectworkerscontainer'].init({mask: 'campaignworkeslist'});
        }
        data = data || {};
        var packet = {
            'type' : data['type']
        };
        context.vms['campaignworkeslist'].init({input: packet});
    };
};
