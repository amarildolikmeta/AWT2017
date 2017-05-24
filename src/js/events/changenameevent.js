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
        if (!context.vms['profilecontainer']) {
            context.vms['appcontainer'].active('profilecontainer');
            context.vms['profilecontainer'].init({mask: 'profileview'});
        }
        if (!context.vms['fullnamechangecontainer']) {
            context.vms['profileview'].active('fullnamechangecontainer');
            context.vms['fullnamechangecontainer'].init({mask: 'changenameform'});
        }
        data = data || {};
        var packet = {
            'Fullname' : data['Full Name']
        };
        context.vms['changenameform'].init({input: packet});
    };
};
