define([
    'jscore/core',
    "./AddTableContentWidgetView",
    "widgets/Combobox",
    'widgets/SelectBox',
    "widgets/Button",
    "formvalidator/Validator",
    'widgets/Notification',
    'container/api'
], function (core, View, Combobox, SelectBox, Button, RoutingRuleWidget, Validator, Notification, container) {
    'use strict';

    return core.Widget.extend({

        View: View,

        init: function () {
        },

        onViewReady: function () {
            this.hasExecuteValidate = false;
            this.allRoutingRuleWidgets = [];
        },

        onDestroy: function () {
        },

        initTab: function (options) {
            var tabList = [];
            for (var i = 0; i < options.length; i++) {
                var tab = {name: options[i], title: options[i], value: options[i]};
                tabList.push(tab);
            }

            var value = "";
            if (tabList.length > 0)
                value = tabList[0];

            this.tableSelBox = new SelectBox({
                value: value,
                items: tabList,
                modifiers: [
                    {name: 'width', value: 'full'}
                ]
            });

            this.tableSelBox.addEventHandler("change", function () {
                this.tabName = this.tableSelBox.getValue().name;
                this.showDetail(this.tabName);
            }.bind(this));

            if (this.tableSelBox.getValue() !== undefined) {
                this.tabName = this.tableSelBox.getValue().name;
                this.showDetail(this.tableSelBox.getValue().name);
            }
            this.tableSelBox.attachTo(this.view.getTab());
        },

        getTabName: function () {
            return this.tabName;
        },

        validateInput: function (input) {
            return true;
        },

        showDetail: function (tabName) {
            switch (tabName) {
                case "AAA":
                    this.view.showAAA().setStyle("display", "");
                    this.view.showBBB().setStyle("display", "none");
                    this.view.showCCC().setStyle("display", "none");
                    break;
                case "BBB":
                    this.view.showAAA().setStyle("display", "none");
                    this.view.showBBB().setStyle("display", "");
                    this.view.showCCC().setStyle("display", "none");
                    break;
                case "CCC":
                    this.view.showAAA().setStyle("display", "none");
                    this.view.showBBB().setStyle("display", "none");
                    this.view.showCCC().setStyle("display", "");
                    break;
            }
        },

        getInput: function (tabName) {
            switch (tabName) {
                case "AAA":
                    return {
                        "name": this.view.getAAAName().getValue(),
                        "age": this.view.getAAAAge().getValue(),
                        "job": this.view.getAAAJob().getValue()
                    };
                case "BBB":
                    return {
                        "name": this.view.getBBBName().getValue(),
                        "age": this.view.getBBBAge().getValue(),
                        "job": this.view.getBBBJob().getValue(),
                        "hometown": this.view.getBBBHometown().getValue()
                    };
                case "CCC":
                    return {
                        "name": this.view.getCCCName().getValue(),
                        "score": this.view.getCCCScore().getValue(),
                        "rank": this.view.getCCCRank().getValue()
                    };
            }
        },

        getEbDialogBoxPrimaryText: function () {
            return this.view.getEbDialogBoxPrimaryText();
        },

        failedNotify: function (msg) {
            if (undefined !== this.notificationWidget) {
                this.notificationWidget.destroy();
            }
            this.notificationWidget = new Notification({
                label: msg,
                icon: 'error',
                color: 'red',
                showCloseButton: true,
                autoDismiss: false,
                showAsToast: true
            });
            this.notificationWidget.attachTo(this.getElement());
        }
    });
});
