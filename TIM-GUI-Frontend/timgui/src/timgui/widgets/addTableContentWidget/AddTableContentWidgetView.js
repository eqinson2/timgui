define([
    "jscore/core",
    "text!./AddTableContentWidget.html",
    "text!./AddTableContentWidget.less"
], function (core, template, style) {
    'use strict';

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return style;
        },

        getTab: function () {
            return this.getElement().find('.ebSelectTable');
        },

        addButton: function () {
            return this.getElement().find('.addTabRecordButton');
        },

        showAAA: function () {
            return this.getElement().find('.ebDialogBox-AAA');
        },

        getAAAName: function () {
            return this.getElement().find('.ebTypeAAA-Name-Input');
        },

        getAAAAge: function () {
            return this.getElement().find('.ebTypeAAA-Age-Input');
        },

        getAAAJob: function () {
            return this.getElement().find('.ebTypeAAA-Job-Input');
        },

        showBBB: function () {
            return this.getElement().find('.ebDialogBox-BBB');
        },

        getBBBName: function () {
            return this.getElement().find('.ebTypeBBB-Name-Input');
        },

        getBBBAge: function () {
            return this.getElement().find('.ebTypeBBB-Age-Input');
        },

        getBBBJob: function () {
            return this.getElement().find('.ebTypeBBB-Job-Input');
        },

        getBBBHometown: function () {
            return this.getElement().find('.ebTypeBBB-Hometown-Input');
        },

        showCCC: function () {
            return this.getElement().find('.ebDialogBox-CCC');
        },

        getCCCName: function () {
            return this.getElement().find('.ebTypeCCC-Name-Input');
        },

        getCCCScore: function () {
            return this.getElement().find('.ebTypeCCC-Score-Input');
        },

        getCCCRank: function () {
            return this.getElement().find('.ebTypeCCC-Rank-Input');
        }
    });

});