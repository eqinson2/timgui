define([
    'jscore/core',
    'text!./SelectRegion.html',
    'styles!./SelectRegion.less'
], function (core, template, styles) {
    'use strict';

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return styles;
        },

        getSelectTableBox: function () {
            return this.getElement().find(".eaTimgui-SelectRegion-Table");
        },

        addSelectClickHandler: function (fn) {
            this.getElement().find(".eaTimgui-SelectRegion-Select").addEventHandler("click", fn);
        },

        addSelectCloseHandler: function (fn) {
            this.getElement().find(".eaTimgui-Close_Icon").addEventHandler("click", fn);
        },

        getAccordionHolder: function () {
            return this.getElement().find(".eaTimgui-SearchRegion-accordionHolder");
        }
    });

});
