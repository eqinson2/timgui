define([
    'jscore/core',
    './BBBEditRegionView',
    'jscore/ext/net',
    'widgets/Dialog',
    'widgets/Button',
    'widgets/SelectBox',
    'formvalidator/Validator',
    'container/api',
    'widgets/Notification',
    '../../../widgets/authHandler/AuthHandler',
    'commonComponents/model/GenericModel',
    "i18n!timgui/dictionary.json"
], function (core, View, net, Dialog, Button, SelectBox, Validator, container,
             Notification, AuthHandler, GenericModel, dictionary) {

    return core.Region.extend({

        View: View,

        init: function (options) {
            this.authHandler = new AuthHandler();
            this.options = options || {};
            this.tabName = "BBB";
        },

        onDOMAttach: function () {
            this.initNameInput(this.options.name);
            this.initAgeInput(this.options.age);
            this.initJobInput(this.options.job);
            this.initHometownInput(this.options.hometown);
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
                this.saveTab(this.getOldData(), this.getNewData());
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

        getOldData: function () {
            return {
                "name": this.options.name,
                "age": this.options.age,
                "job": this.options.job,
                "hometown": this.options.hometown
            };
        },

        getNewData: function () {
            var name = this.view.getNameInput().getValue();
            var age = this.view.getAgeInput().getValue();
            var job = this.view.getJobInput().getValue();
            var hometown = this.view.getHometownInput().getValue();
            return {"name": name, "age": age, "job": job, "hometown": hometown};
        },

        saveTab: function (oldData, newData) {
            GenericModel.save({
                url: dictionary.baseURI + "/tables/set/" + this.tabName,
                type: "PUT",
                authentication: this.authHandler.authenticationDetails(),
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify({
                    "oldData": oldData,
                    "newData": newData
                }),
                success: function (resp) {
                    this.successNotify("Table " + this.tabName + " saved");
                    container.getEventBus().publish("tableRegion:reload", this.tabName);
                    container.getEventBus().publish("flyout:hide");
                }.bind(this),
                error: function (msg, xhr) {
                    console.error('Error: ' + xhr.getResponseText());
                    var details = (JSON.parse(xhr.getResponseText())).details;
                    var endIndex = details.indexOf(":");
                    this.failedNotify("Failed to update table: " + details.substring(0, endIndex));
                }.bind(this)
            });
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

        initAgeInput: function (value) {
            this.age = value;
            this.view.getAgeInput().setValue(value);
            this.view.getAgeInput().setAttribute("title", value);
        },

        initJobInput: function (value) {
            this.job = value;
            this.view.getJobInput().setValue(value);
            this.view.getJobInput().setAttribute("title", value);
        },

        initHometownInput: function (value) {
            this.job = value;
            this.view.getHometownInput().setValue(value);
            this.view.getHometownInput().setAttribute("title", value);
        },
    });


});
