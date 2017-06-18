define([
    'jscore/core',
    'template!./AAAEditRegion.html',
    'styles!./AAAEditRegion.less'
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

        getAgeInput: function () {
            return this.getElement().find('.eaTimgui-editTable-editContent-ageBox-ageInput');
        },

        getJobInput: function () {
            return this.getElement().find('.eaTimgui-editTable-editContent-jobBox-jobInput');
        },

        getItemById: function (id) {
            return this.getElement().find('#' + id);
        }
    });

});
