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
            this.tabName = "CCC";
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
                "score": this.options.score,
                "rank": this.options.rank
            }
        },

        getNewData: function () {
            var name = this.view.getNameInput().getValue();
            var score = this.view.getScoreInput().getValue();
            var rank = this.view.getRankInput().getValue();
            return {"name": name, "score": score, "rank": rank};
        },

        saveTab: function (oldData, newData) {
            GenericModel.save({
                url: "/timgui-backend/tables/set/" + this.tabName,
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
    });
});
