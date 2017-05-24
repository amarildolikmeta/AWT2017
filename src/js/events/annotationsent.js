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
        if (!context.vms['workerhomecontainer']) {
            context.vms['appcontainer'].active('workerhomecontainer');
            context.vms['workerhomecontainer'].init({mask: 'workerhomecontainerview'});
        }
        if (!context.vms['annotationtaskview']) {
            context.vms['workerhomecontainerview'].active('annotationtaskview');
        }
        context.vms['annotationtaskview'].init();
    };
};
