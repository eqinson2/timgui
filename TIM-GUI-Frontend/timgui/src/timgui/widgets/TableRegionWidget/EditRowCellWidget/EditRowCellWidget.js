define([
    'tablelib/Cell',
    './EditRowCellWidgetView',
    'widgets/Dialog',
    'container/api',
    'jscore/ext/net',
    'widgets/Notification',
    '../../../regions/EditRegion/EditRegion',
    '../../../widgets/authHandler/AuthHandler',
    'commonComponents/model/GenericModel',
    '../../../models/TableModel'
], function (Cell, View, Dialog, container, net, Notification, EditRegion, 
    AuthHandler, GenericModel, TableModel) {

    return Cell.extend({

        View: View,

        init: function () {
            this.authHandler = new AuthHandler();
            this.tabName = this.getTable().options.modifiers[0].name;
        },

        setValue: function () {
            var attr = this.getColumnDefinition().attribute;
            var value = this.getRow().getData()[attr];
            this.view.getValueIcon().setText(value);

            var editIcon = this.view.getEditIcon();
            var deleteIcon = this.view.getDeleteIcon();

            editIcon.addEventHandler('click', function () {
                this.editRowData();
            }.bind(this));

            deleteIcon.addEventHandler('click', function () {
                this.deleteRowData();
                this.confirmDialog.show();
            }.bind(this));
        },

        editRowData: function () {
            var row = this.getRow().getData();
            var cells = this.getRow().getCells();
            container.getEventBus().publish("flyout:show", {
                header: "Edit Table " + this.tabName,
                content: new EditRegion(cells, row)
            });
        },

        deleteRowData: function () {
            this.confirmDialog = new Dialog({
                header: 'Delete Table Row',
                content: 'Are you sure you want to delete this row?',
                buttons: [{
                    caption: 'Delete',
                    color: 'darkBlue',
                    action: function () {
                        GenericModel.destroy({
                            url: "/timgui-backend/tables/delete/" + this.tabName,
                            authentication: this.authHandler.authenticationDetails(),
                            type: "DELETE",
                            headers: this.getRow().getData(),
                            contentType: 'application/json',
                            success: function (data) {
                                this.popSuccessNotification("Delete Table Row Successfully.");
                                container.getEventBus().publish("tableRegion:reload", this.tabName);
                            }.bind(this),
                            error: function (msg, xhr) {
                                console.error('Error: ' + xhr.getResponseText());
                                var details = (JSON.parse(xhr.getResponseText())).details;
                                var endIndex = details.indexOf(":");
                                this.popErrorNotification("Delete Routing Failed: " + details.substring(0, endIndex));
                            }.bind(this)
                        });
                        this.confirmDialog.hide();
                    }.bind(this)
                }, {
                    caption: 'Cancel',
                    action: function () {
                        this.confirmDialog.hide();
                    }.bind(this)
                }]
            });
        },

        popSuccessNotification: function (msg) {
            if (undefined !== this.successNotificationWidget) {
                this.successNotificationWidget.destroy();
            }
            this.successNotificationWidget = new Notification({
                label: msg,
                icon: 'tick',
                color: 'green',
                showCloseButton: true,
                autoDismiss: false,
                showAsGlobalToast: true,
                autoDismissDuration: 5000
            });
            this.successNotificationWidget.attachTo(this.getElement().getParent().getParent().getParent().getParent());
        },

        popErrorNotification: function (msg) {
            if (undefined !== this.failNotificationWidget) {
                this.failNotificationWidget.destroy();
            }
            this.failNotificationWidget = new Notification({
                label: msg,
                icon: 'error',
                color: 'red',
                showCloseButton: true,
                autoDismiss: false,
                showAsToast: true,
                showAsGlobalToast: true
            });
            this.failNotificationWidget.attachTo(this.getElement().getParent().getParent().getParent().getParent());
        }

    });
});
