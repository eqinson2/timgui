define([
    'jscore/core',
    'text!./EditRowCellWidget.html',
    'styles!./EditRowCellWidget.less'
], function (core, template, styles) {
    'use strict';

    return core.View.extend({

        getTemplate: function () {
            return template;
        },

        getStyle: function () {
            return styles;
        },

        getValueIcon: function () {
            return this.getElement().find('.eaTimgui-tableRegion-editContent-table-row-value');
        },

        getEditIcon: function () {
            return this.getElement().find('.eaTimgui-tableRegion-editContent-table-row-edit');
        },

        getDeleteIcon: function () {
            return this.getElement().find('.eaTimgui-tableRegion-editContent-table-row-delete');
        }
    });
});



