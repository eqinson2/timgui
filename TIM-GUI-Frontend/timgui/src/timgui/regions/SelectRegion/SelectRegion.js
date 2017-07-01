define([
    "jscore/core",
    "./SelectRegionView",
    "widgets/MultiSelectBox",
    "i18n!timgui/dictionary.json",
    'widgets/SelectBox',
    "jscore/ext/net",
    "container/api",
    "../../widgets/authHandler/AuthHandler",
    "../../widgets/searchPanel/searchPanel",
    "widgets/Accordion",
    "commonComponents/model/GenericModel"
], function (core, View, MultiSelectBox, dictionary, SelectBox, net, container, AuthHandler, SearchPanel, Accordion, GenericModel) {
    "use strict";

    return core.Region.extend({

        View: View,

        onStart: function () {
            this.authHandler = new AuthHandler();
            this.initTableList();
            this.view.addSelectClickHandler(this.select.bind(this));
            this.view.addSelectCloseHandler(function () {
                this.getEventBus().publish('layouts:toggleleftpanel');
            }.bind(this));

        },

        onStop: function () {

        },

        initTableList: function () {
            if (undefined !== this.tableInput) {
                this.tableInput.detach();
            }
            GenericModel.fetch({
                url: dictionary.baseURI + "/tables/get/listAll",
                authentication: this.authHandler.authenticationDetails(),
                success: function (resp) {
                    this.tableList = resp.tables;
                    var tableList = [];
                    for (var i = 0; i < this.tableList.length; i++) {
                        var tableMap = {name: this.tableList[i], title: this.tableList[i], value: this.tableList[i]};
                        tableList.push(tableMap);
                    }

                    var value = "";
                    if (tableList.length > 0)
                        value = tableList[0];

                    this.tableSelBox = new SelectBox({
                        value: value,
                        items: tableList,
                        modifiers: [
                            {name: 'width', value: '100%'}
                        ]
                    });

                    if (this.tableList.length > 0) {
                        this.getContext().eventBus.publish("tableRegion:select", this.tableList[0]);
                    }

                    this.tableSelBox.attachTo(this.view.getSelectTableBox());
                    this.loadAccordionWidget(this.tableList);

                    if (this.tableSelBox.getValue() !== undefined) {
                        this.tabName = this.tableSelBox.getValue().name;
                        this.searchPanel.showDetail(this.tabName);
                    }

                    this.tableSelBox.addEventHandler("change", function () {
                        this.tabName = this.tableSelBox.getValue().name;
                        this.searchPanel.showDetail(this.tabName);
                    }.bind(this));

                }.bind(this),

                error: function (msg, xhr) {
                    console.log("init moType fail-Something went wrong: " + msg);
                }.bind(this)
            });
        },

        loadAccordionWidget: function (params) {
            var accordionHolder = this.view.getAccordionHolder();
            this.searchPanel = new SearchPanel();
            this.searchPanel.loadWidgets(params);
            this.searchPanel.setParent(this);

            this.accordion = new Accordion({
                title: "Search",
                content: this.searchPanel,
                expanded: false
            });
            this.accordion.attachTo(accordionHolder);

            this.searchPanel.view.enableSearch();
            this.getContext().eventBus.subscribe("filter:jobFinish", function (data) {
                this.searchPanel.view.enableSearch();
            }.bind(this));
            this.getContext().eventBus.subscribe("filter:jobStart", function (data) {
                this.searchPanel.view.disableSearch();
            }.bind(this));
        },

        select: function () {
            var table = this.tableSelBox.getValue().name;
            if (table !== "" && table !== undefined)
                this.getContext().eventBus.publish("tableRegion:select", table);
        },

        change: function () {
            var table = this.tableSelBox.getValue().name;
            if (table !== "" && table !== undefined)
                this.searchPanel.showDetail(table);
        }
    });

});

