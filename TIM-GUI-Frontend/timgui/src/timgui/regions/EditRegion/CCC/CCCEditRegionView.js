define([
    'jscore/core',
    'template!./CCCEditRegion.html',
    'styles!./CCCEditRegion.less'
], function (core, template, styles) {

    return core.View.extend({

        getTemplate: function () {
            return template(this.options);
        },

        getStyle: function () {
            return styles;
        },

        getSaveButton: function () {
            return this.getElement().find('.eaTimgui-editTable-editContent-controlBox-saveButton');
        },

        getCancelButton: function () {
            return this.getElement().find('.eaTimgui-editTable-editContent-controlBox-cancelButton');
        },

        getNameInput: function () {
            return this.getElement().find('.eaTimgui-editTable-editContent-nameBox-nameInput');
        },

        getScoreInput: function () {
            return this.getElement().find('.eaTimgui-editTable-editContent-scoreBox-scoreInput');
        },

        getRankInput: function () {
            return this.getElement().find('.eaTimgui-editTable-editContent-rankBox-rankInput');
        },

        getItemById: function (id) {
            return this.getElement().find('#' + id);
        }
    });

});
