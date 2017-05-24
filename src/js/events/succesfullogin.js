/*jslint node: true, nomen: true */
"use strict";

exports.createEvent = function () { // add "options" parameter if needed
    return function (context) {
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
        if (!context.vms['userdetails']) {
            context.vms['profileview'].active('userdetails');
        }
        context.vms['userdetails'].init();
    };
};
