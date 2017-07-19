define([
    'jscore/core',
    './EditRegionView',
    'jscore/ext/net',
    'widgets/Dialog',
    'widgets/Button',
    'widgets/SelectBox',
    'formvalidator/Validator',
    'container/api',
    'widgets/Notification',
    'i18n!timgui/dictionary.json',
    '../../widgets/authHandler/AuthHandler',
    'commonComponents/model/GenericModel'
], function (core, View, net, Dialog, Button, SelectBox, Validator, container,
             Notification, dictionary, AuthHandler, GenericModel) {

    return core.Region.extend({

        View: View,

        init: function (cell, row) {
            this.authHandler = new AuthHandler();
            this.options = row || {};
            this.tabName = "Dispatch"; // need change
            this.cell = cell || {};
            // console.log("cell: ", this.cell);
            // for (var i = 0, len = cell.length; i < len; i++)
            // {
            //     console.log(this.cell[i].options.column.title);
            // }
        },

        onDOMAttach: function () {
            for (var len = this.cell.length, i = len - 1; i >= 0; i--) {
                var title = this.cell[i].options.column.title;
                this.initLoginInput(title, this.options[title]);
            }
            //this.initActivityInput(this.options.activity);
            // this.initNparInput(this.options.npar);
            // this.initOperationInput(this.options.operation);
            // this.initMoInput(this.options.mo);
            // this.initParamsInput(this.options.params);
            // this.initAvpsInput(this.options.avps);
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
            return {"name": this.options.name, "age": this.options.age, "job": this.options.job};
        },

        getNewData: function () {
            var login = this.view.getLoginInput().getValue();
            var activity = this.view.getActivityInput().getValue();
            var npar = this.view.getNparInput().getValue();
            var operation = this.view.getOperationInput().getValue();
            var mo = this.view.getMoInput().getValue();
            var params = this.view.getParamsInput().getValue();
            var avps = this.view.getAvpsInput().getValue();
            return {"login": login,
                    "activity": activity,
                    "npar": npar,
                    "operation": operation,
                    "mo": mo,
                    "params": params,
                    "avps": avps
            };
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

        initLoginInput: function (title, value) {
            var div = new core.Element();
            
            var label = new core.Element();
            label.setAttribute("class", "eaTimgui-editTable-editContent-loginBox-loginLabel");
            label.setText(title);

            var input = new core.Element('input');
            input.setAttribute("type", "text");
            input.setAttribute("class", "ebInput eaTimgui-editTable-editContent-loginBox-loginInput");
            input.setAttribute("title", value);
            input.setValue(value);

            div.append(label);
            div.append(input);
            this.view.getEditContent().prepend(div);
        },

        initActivityInput: function (value) {
            this.activity = value;
            this.view.getActivityInput().setValue(value);
            this.view.getActivityInput().setAttribute("title", value);
        },

        initNparInput: function (value) {
            this.npar = value;
            this.view.getNparInput().setValue(value);
            this.view.getNparInput().setAttribute("title", value);
        },

        initOperationInput: function (value) {
            this.operation = value;
            this.view.getOperationInput().setValue(value);
            this.view.getOperationInput().setAttribute("title", value);
        },

        initMoInput: function (value) {
            this.mo = value;
            this.view.getMoInput().setValue(value);
            this.view.getMoInput().setAttribute("title", value);
        },

        initParamsInput: function (value) {
            this.params = value;
            this.view.getParamsInput().setValue(value);
            this.view.getParamsInput().setAttribute("title", value);
        },

        initAvpsInput: function (value) {
            this.avps = value;
            this.view.getAvpsInput().setValue(value);
            this.view.getAvpsInput().setAttribute("title", value);
        }        
    });

    function isNumOnly(inputString) {
        return new RegExp("^[0-9]+$").test(inputString);
    }
});