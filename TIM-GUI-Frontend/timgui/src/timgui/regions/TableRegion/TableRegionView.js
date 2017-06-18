define([
    'jscore/core',
    'text!./TableRegion.html',
    'styles!./TableRegion.less'
], function (core, template, styles) {
    'use strict';

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return styles;
        },

        getTableContent: function () {
            return this.getElement().find(".eaTimgui-tableRegion-editContent-table");
        },

        getShowSelectBox: function () {
            return this.getElement().find('.eaTimgui-tableRegion-editContent-main-topMenu-select-box');
        },

        getTablePagination: function () {
            return this.getElement().find('.eaTimgui-tableRegion-editContent-pagination');
        },

        setHeaderText: function (text) {
            var fieldNameElement = document.getElementById("eaTimgui-tableRegion-editContent-main-topMenu-Header-Text");
            if (fieldNameElement.firstChild)
                fieldNameElement.firstChild.nodeValue = "Service Catalog of Table " + text;
        },

        setLoadingDisplay: function (display) {
            var table = this.getTableContent();

            if (display) {
                table.setModifier('loading'); // set the min-height to show the loader below the header
            }
            else {
                table.removeModifier('loading');
            }
        }


    });

});