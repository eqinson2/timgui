define([
    'jscore/core',
    './CCCEditRegionView',
    'jscore/ext/net',
    'widgets/Dialog',
    'widgets/Button',
    'widgets/SelectBox',
    'formvalidator/Validator',
    'container/api',
    'widgets/Notification',
    'i18n!timgui/dictionary.json',
    '../../../widgets/authHandler/AuthHandler',
    'commonComponents/model/GenericModel'
], function (core, View, net, Dialog, Button, SelectBox, Validator, container,
             Notification, dictionary, AuthHandler, GenericModel) {

    return core.Region.extend({

        View: View,

        init: function (options) {
            this.authHandler = new AuthHandler();
            this.options = options || {};
        },

        onDOMAttach: function () {
            this.initNameInput(this.options.name);
            this.initScoreInput(this.options.score);
            this.initRankInput(this.options.rank);
            this.initControlBox();
        },

        onStart: function () {
        },

        validateInput: function () {
            return true;
        },

        initControlBox: function () {
            var saveButtonWidget = this.saveButtonWidget = new Button({
                modifiers: [{name: 'color', value: 'darkBlue'}],
                caption: dictionary.buttons.save.caption
            });

            saveButtonWidget.attachTo(this.view.getSaveButton());
            saveButtonWidget.addEventHandler('click', function () {
                if (!this.validateInput()) {
                    return;
                }
                this.saveTab();
                container.getEventBus().publish("flyout:hide");
            }.bind(this));

            var cancelButtonWidget = this.cancelButtonWidget = new Button({
                caption: dictionary.buttons.cancel.caption
            });

            cancelButtonWidget.attachTo(this.view.getCancelButton());
            cancelButtonWidget.addEventHandler('click', function () {
                this.stop();
                container.getEventBus().publish("flyout:hide");
            }.bind(this));

        },

        saveTab: function () {
        },

        successNotify: function (msg) {
            var successNotificationWidget = new Notification({
                label: msg,
                icon: 'tick',
                color: 'green',
                showCloseButton: true,
                autoDismiss: true,
                showAsGlobalToast: true,
                autoDismissDuration: 5000
            });
            successNotificationWidget.attachTo(this.getElement().getParent().getParent().getParent().getParent());
        },

        failedNotify: function (msg) {
            this.failNotificationWidget = new Notification({
                label: msg,
                icon: 'error',
                color: 'red',
                showCloseButton: true,
                autoDismiss: true,
                showAsToast: true
            });
            this.failNotificationWidget.attachTo(this.getElement().getParent().getParent().getParent().getParent());

        },

        initNameInput: function (value) {
            this.name = value;
            this.view.getNameInput().setValue(value);
            this.view.getNameInput().setAttribute("title", value);
        },

        initScoreInput: function (value) {
            this.age = value;
            this.view.getScoreInput().setValue(value);
            this.view.getScoreInput().setAttribute("title", value);
        },

        initRankInput: function (value) {
            this.job = value;
            this.view.getRankInput().setValue(value);
            this.view.getRankInput().setAttribute("title", value);
        },

        clearCache: function () {
        },

        clearInput: function () {
        },


        changeMethodLayout: function (newRoutingMethod) {
        }

    });


});
