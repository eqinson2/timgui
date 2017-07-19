define([
    'jscore/core',
    'template!./EditRegion.html',
    'styles!./EditRegion.less'
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

        getLoginInput: function () {
            return this.getElement().find('.eaTimgui-editTable-editContent-loginBox-loginInput');
        },

        getLabel: function () {
            return this.getElement().find('.eaTimgui-editTable-editContent-loginBox-loginLabel');
        },

        getActivityInput: function () {
            return this.getElement().find('.eaTimgui-editTable-editContent-activityBox-activityInput');
        },

        getNparInput: function () {
            return this.getElement().find('.eaTimgui-editTable-editContent-nparBox-nparInput');
        },

        getOperationInput: function () {
            return this.getElement().find('.eaTimgui-editTable-editContent-operationBox-operationInput');
        },

        getMoInput: function () {
            return this.getElement().find('.eaTimgui-editTable-editContent-moBox-moInput');
        },

        getParamsInput: function () {
            return this.getElement().find('.eaTimgui-editTable-editContent-paramsBox-paramsInput');
        },

        getAvpsInput: function () {
            return this.getElement().find('.eaTimgui-editTable-editContent-avpsBox-avpsInput');
        },

        getItemById: function (id) {
            return this.getElement().find('#' + id);
        },

        getEditContent: function () {
            return this.getElement().find(".eaTimgui-editTable-editContent");
        }
    });
});