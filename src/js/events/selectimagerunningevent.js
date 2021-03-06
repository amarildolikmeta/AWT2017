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
        if (!context.vms['runningcampaigncontainer']) {
            context.vms['managerhomecontainer'].active('runningcampaigncontainer');
            context.vms['runningcampaigncontainer'].init({mask: 'runningcampaignview'});
        }
        if (!context.vms['campaignlistcontainerrunning']) {
            context.vms['runningcampaignview'].active('campaignlistcontainerrunning');
            context.vms['campaignlistcontainerrunning'].init({mask: 'imagestatisticsrunning'});
        }
        data = data || {};
        var packet = {
            'id' : data['id'],
            'canonical':data['canonical']
        };
        context.vms['imagestatisticsrunning'].init({input: packet});
    };
};
