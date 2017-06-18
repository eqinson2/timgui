define([
    'jscore/core',
    './TimguiView',
    'layouts/TopSection',
    './regions/TableRegion/TableRegion',
    './regions/SelectRegion/SelectRegion',
    'widgets/Button',
    'widgets/Dialog',
    'layouts/SlidingPanels',
    'container/api',
    './widgets/addTableContentWidget/AddTableContentWidget',
    'jscore/ext/net',
    'widgets/Notification',
    "./widgets/authHandler/AuthHandler",
    "commonComponents/model/GenericModel"
], function (core, View,
             TopSection,
             TableRegion, SelectRegion,
             Button, Dialog, SlidingPanels,
             container, AddTableContentWidget, net,
             Notification, AuthHandler, GenericModel) {
    'use strict';

    return core.App.extend({

        View: View,

        /**
         * Called when the app is first instantiated in the current tab for the first time.
         */
        onStart: function () {
            this.authHandler = new AuthHandler();
            this.AddRoutingOptions = {};
            this.initRegion();
            this.isSuccessfulAddRouting = true;
        },

        initRegion: function () {
            this.createRegions();
        },

        createRegions: function () {
            this.notification_error = [];
            this.notification_success = [];

            var tableRegion = new TableRegion({
                id_name: "table_region",
                context: this.getContext()
            });


            var selectRegion = new SelectRegion({
                id_name: "select_region",
                context: this.getContext()
            });

            var topSection = new TopSection({
                title: "TIM Service Catalog",
                breadcrumb: this.options.breadcrumb,
                context: this.getContext(),
                defaultActions: [
                    {
                        name: 'Add Record',
                        type: 'button',
                        color: 'darkBlue',
                        action: function (action) {
                            this.showAddTabRecDialog();
                        }.bind(this)
                    }
                ]
            });

            topSection.setContent(new SlidingPanels({
                context: this.getContext(),
                resolutionThreshold: 700,
                leftWidth: 350,
                rightWidth: 200,
                main: {
                    label: 'Result',
                    contents: tableRegion
                },
                left: {
                    label: 'Select',
                    contents: selectRegion,
                    expanded: true
                },
                resp: {
                    width: '800'
                }
            }));

            topSection.attachTo(this.getElement());
        },

        saveTabContent: function (tabName, tabData, addTabContWidget) {
            GenericModel.save({
                url: '/timgui-backend/tables/' + tabName,
                authentication: this.authHandler.authenticationDetails(),
                data: tabData,
                contentType: 'application/json',
                success: function (data, xhr) {
                    this.successNotify("Table record added");
                    this.dialog.hide();
                    container.getEventBus().publish("routinglist:reload");
                }.bind(this),
                error: function (msg, xhr) {
                    console.error('Error: ' + xhr.getResponseText());
                    var details = (JSON.parse(xhr.getResponseText())).details;
                    var endIndex = details.indexOf(":");
                    addTabContWidget.failedNotify("Routing added unsuccessful: " + details.substring(0, endIndex));
                    this.dialog.show();
                }.bind(this)
            });
        },

        showAddTabRecDialog: function () {
            var addTabContWidget = new AddTableContentWidget();
            this.initTabList(addTabContWidget);
            this.dialog = new Dialog({
                header: 'Add Table Record',
                content: addTabContWidget,
                buttons: [{
                    caption: 'Add',
                    color: 'darkBlue',
                    action: function () {
                        var tabName = addTabContWidget.getTabName();
                        var data = addTabContWidget.getInput(tabName);
                        this.saveTabContent(tabName, data, addTabContWidget);
                        container.getEventBus().publish("tableRegion:reload", tabName);
                    }.bind(this)
                }, {
                    caption: 'Cancel',
                    action: function () {
                        this.dialog.hide();
                    }.bind(this)
                }]
            });

            this.dialog.show();
        },

        initTabList: function (addTabContWidget) {
            GenericModel.fetch({
                url: "/timgui-backend/tables/list",
                authentication: this.authHandler.authenticationDetails(),
                success: function (resp) {
                    addTabContWidget.initTab(resp.tables);
                }.bind(this),

                error: function (msg, xhr) {
                    console.log("init moType fail-Something went wrong: " + msg);
                }.bind(this)
            });
        },


        /**
         * This method is called when the user has left your app to view a different app.
         */
        onPause: function () {
        },

        /**
         * Called when the user navigates back to the application.
         */
        onResume: function () {
        },

        /**
         * Called before the user is about to leave your app, either by navigating away or closing the tab.
         */
        onBeforeLeave: function () {
        },

        failedNotify: function (msg) {
            var notificationWidget = new Notification({
                label: msg,
                icon: 'error',
                color: 'red',
                showCloseButton: true,
                showAsToast: true
            });
            notificationWidget.attachTo(this.getElement());
        },

        successNotify: function (msg) {
            var notificationWidget = new Notification({
                label: msg,
                icon: 'tick',
                color: 'green',
                showCloseButton: true,
                showAsToast: true,
                autoDismissDuration: 5000
            });
            notificationWidget.attachTo(this.getElement());
        }
    });
});
