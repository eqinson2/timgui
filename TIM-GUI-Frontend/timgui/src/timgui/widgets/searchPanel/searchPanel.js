/**
 * @author egragus
 * @author ejeserl
 */
define([
    'jscore/core',
    "./SearchPanelView",
    "widgets/Combobox",
    'widgets/SelectBox',
    "formvalidator/Validator",
    "commonComponents/TagInput",
    "widgets/Button",
    "../../widgets/authHandler/AuthHandler",
    "commonComponents/model/GenericModel",
    'container/api',
    'widgets/Notification'
], function (core, View, Combobox, SelectBox, Validator, TagInput, Button, AuthHandler, GenericModel, Container, Notification) {

    return core.Widget.extend({

        View: View,

        init: function () {
            this.authHandler = new AuthHandler();
        },

        onViewReady: function (options) {
        },

        setParent: function (param) {
            this.parent = param;
        },

        loadWidgets: function (params) {
            var tabList = [];
            for (var i = 0; i < params.length; i++) {
                var tab = {name: params[i], title: params[i], value: params[i]};
                tabList.push(tab);
            }

            var value = "";
            if (tabList.length > 0)
                value = tabList[0];

            this.tableSelBox = new SelectBox({
                value: value,
                items: tabList,
                modifiers: [
                    {name: 'width', value: '100%'}
                ]
            });

            this.tableSelBox.addEventHandler("change", function () {
                this.tabName = this.tableSelBox.getValue().name;
                this.showDetail(this.tabName);
            }.bind(this));


            this.view.addSearchClickHandler(function () {
                if (!this.validateInput() || !this.view.isSearchEnabled()) {
                    return;
                }
                this.search();
            }.bind(this));

            this.view.addClearClickHandler(function () {
                this.cancel();
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

        filterTab: function (name, condition) {
            var param = {
                "name": name,
                "condition": condition
            };
            this.parent.getContext().eventBus.publish("tableRegion:filter", param);

        },

        search: function () {
            var tabName = this.getTabName();
            var data = this.getInput(tabName);
            this.filterTab(tabName, data);
        },

        cancel: function () {
        },

        clear: function () {
        },

        validateInput: function () {
            return true;
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