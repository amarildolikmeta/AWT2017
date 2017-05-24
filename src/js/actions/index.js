/*jslint node: true, nomen: true */
"use strict";

exports.createActions = function (options) {
    return {
        'registeraction': require('./registeraction').createAction(options)
        ,'logoutaction': require('./logoutaction').createAction(options)
        ,'loginaction': require('./loginaction').createAction(options)
        ,'homeaction': require('./homeaction').createAction(options)
        ,'gettaskaction': require('./gettaskaction').createAction(options)
        ,'statechangeaction': require('./statechangeaction').createAction(options)
        ,'getcampaigndetailsaction': require('./getcampaigndetailsaction').createAction(options)
        ,'campaigncreationaction': require('./campaigncreationaction').createAction(options)
        ,'changenameaction': require('./changenameaction').createAction(options)
        ,'changepasswordaction': require('./changepasswordaction').createAction(options)
        ,'imageselectionaction': require('./imageselectionaction').createAction(options)
        ,'sendannotationaction': require('./sendannotationaction').createAction(options)
        ,'getcurrentcampaigndetailsaction': require('./getcurrentcampaigndetailsaction').createAction(options)
        ,'loadworkersaction': require('./loadworkersaction').createAction(options)
        ,'b2bf886a-84d9-46d3-87c4-261b16fe72e6': require('./b2bf886a-84d9-46d3-87c4-261b16fe72e6').createAction(options)
        ,'changecamapignaction': require('./changecamapignaction').createAction(options)
        ,'imageuploadaction': require('./imageuploadaction').createAction(options)
        ,'selectionaction': require('./selectionaction').createAction(options)
        ,'annotationaction': require('./annotationaction').createAction(options)
    };
};
