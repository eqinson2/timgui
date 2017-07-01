define([
    "jscore/core",
    "./TableRegionView",
    'tablelib/Table',
    'tablelib/Cell',
    'tablelib/Row',
    'tablelib/plugins/Selection',
    'tablelib/plugins/SortableHeader',
    'tablelib/plugins/FixedHeader',
    'tablelib/plugins/RowEvents',
    '../../widgets/TableRegionWidget/EditRowCellWidget/EditRowCellWidget',
    'widgets/SelectBox',
    'widgets/Pagination',
    'widgets/Notification',
    "i18n!timgui/dictionary.json",
    'container/api',
    "../../widgets/authHandler/AuthHandler",
    "commonComponents/model/GenericModel",
    "../../models/TableModel"
], function (core, View, Table, Cell, Row, Selection, SortableHeader, FixedHeader, RowEvents,
             EditRowCellWidget, SelectBox, Pagination, Notification, dictionary, container,
             AuthHandler, GenericModel, TableModel) {

    return core.Region.extend({

        view: function () {
            return new View(this.options);
        },
        paginationList: [],
        pageSize: 10,
        pagination: null,
        cell: null,

        onStart: function () {
            this.authHandler = new AuthHandler();
            this.tableModel = new TableModel();
            this.getContext().eventBus.subscribe("tableRegion:select", function (params) {
                this.fetchTable(params);
            }.bind(this));
            container.getEventBus().subscribe("tableRegion:reload", function (params) {
                this.fetchTable(params);
            }.bind(this));
            this.getContext().eventBus.subscribe("tableRegion:filter", function (params) {
                this.filterTable(params);
            }.bind(this));
        },

        replaceTableData: function (data) {
            this.table.setData(data);
        },

        //Fetch all Routing Configurations
        fetchTable: function (selectedTabName) {
            this.view.setLoadingDisplay(true);
            GenericModel.fetch({
                url: dictionary.baseURI + "/tables/get/" + selectedTabName,
                authentication: this.authHandler.authenticationDetails(),
                success: function (data) {
                    this.displayTable(data);

                }.bind(this),
                error: function (response) {
                    console.log("Get table contents from Backend failed: " + response.getStatusText());
                    this.popErrorNotification("Get table contents from Backend failed.");
                }.bind(this)
            });
        },

        filterTable: function (param) {
            this.view.setLoadingDisplay(true);
            this.getContext().eventBus.publish("filter:jobStart");
            GenericModel.fetch({
                url: dictionary.baseURI + '/tables/filter/' + param.name,
                authentication: this.authHandler.authenticationDetails(),
                type: "GET",
                headers: param.condition,
                contentType: 'application/json',
                success: function (resp) {
                    this.displayTable(resp);
                    this.getContext().eventBus.publish("filter:jobFinish");
                }.bind(this),
                error: function (response) {
                    console.log("Get table contents from Backend failed: " + response.getStatusText());
                    this.popErrorNotification("Get table contents from Backend failed.");
                }.bind(this)
            });
        },

        displayTable: function (data) {
            this.view.setLoadingDisplay(false);
            this.tabName = this.tableModel.buildTableName(data);
            this.tabHeader = this.tableModel.buildTableHeader(data);
            this.tabData = this.tableModel.buildTableContent(data);
            this.createTable(this.tabName, this.tabHeader, this.tabData);

            this.view.setHeaderText(this.tabName);
            if (this.tabData.length > 0) {
                var selectedPage = null;
                if (this.pagination !== null) {
                    selectedPage = this.pagination.selectedPage;
                }
                this.paging(this.tabData, selectedPage);
            }
        },

        createTable: function (name, header, content) {
            this.createShowSelectBox(content);

            if (this.table) {
                this.table.destroy();
            }

            var metadata = [];
            for (var i = 0; i < header.length; i++) {
                metadata.push({
                    title: header[i],
                    attribute: header[i]
                });
            }

            var columns = [];
            for (var j = 0; j < metadata.length; j++) {
                if (j < metadata.length - 1)
                    columns.push({
                        title: metadata[j].title,
                        attribute: metadata[j].attribute,
                        sortable: true,
                        width: "30%"
                    });
                else {
                    columns.push({
                        title: metadata[j].title,
                        attribute: metadata[j].attribute,
                        sortable: true,
                        width: "30%",
                        cellType: EditRowCellWidget
                    });
                }
            }

            this.table = new Table({
                plugins: [
                    new SortableHeader()
                ],
                modifiers: [
                    {name: name}
                ],
                tooltips: true,
                data: content,
                columns: columns,
                parent: this
            });

            this.table.addEventHandler("sort", this.table.sort.bind(this.table));
            this.table.attachTo(this.view.getTableContent());
        },

        //Create show Box
        createShowSelectBox: function (tableData) {
            this.showSelect = new SelectBox({
                value: {name: this.pageSize, value: 0},
                items: [
                    {name: '10', value: 10},
                    {name: '25', value: 25},
                    {name: '50', value: 50},
                    {name: '75', value: 75},
                    {name: '100', value: 100}
                ],
                modifiers: [
                    {name: 'width', value: 'full'}
                ]
            });
            this.showSelect.addEventHandler("change", function () {
                this.pageSize = this.showSelect.getValue().value;
                this.setPageSize(this.pageSize);
                var fetchedResults = tableData;
                if (fetchedResults.length > 0) {
                    var selectedPage = null;
                    if (this.pagination !== null) {
                        selectedPage = this.pagination.selectedPage;
                    }
                    this.paging(fetchedResults, selectedPage);
                }
            }.bind(this));

            var element = this.view.getShowSelectBox();
            element.setText("");
            this.showSelect.attachTo(element);
            this.view.getElement().find('.ebSelect_width_full').setStyle("height", "20px");
        },

        paging: function (array, selectedPage) {
            this.paginationList = array;
            this.pagination = new Pagination({
                pages: Math.ceil(this.paginationList.length / this.getPageSize()),
                maxWidth: "1000px",
                selectedPage: selectedPage,
                onPageChange: function (pageNumber) {
                    var startOfSlice = (pageNumber - 1) * this.getPageSize();
                    var tablePage = this.paginationList.slice(startOfSlice, startOfSlice + this.getPageSize());
                    this.replaceTableData(tablePage);
                }.bind(this)
            });
            if (selectedPage !== null) {
                this.pagination.selectedPage = selectedPage;
            }

            var element = this.view.getTablePagination();
            element.setText("");
            this.pagination.attachTo(element);
        },

        getPageSize: function () {
            return this.pageSize;
        },

        setPageSize: function (pageSize) {
            this.pageSize = pageSize;
        },

        // selecting: function (params) {
        //     this.view.setLoadingDisplay(true);
        //     this.sleep(500);
        //     GenericModel.fetch({
        //         url: "/syncsingleentry-backend/dc/cai3g/routing/list",
        //         authentication: this.authHandler.authenticationDetails(),
        //         success: function (data) {
        //             this.view.setLoadingDisplay(false);
        //             var filetredData = [];
        //             var filterMoType = params.moType.toLowerCase();
        //             var filterNes = params.nes;
        //             var filterRoutingMethods = params.routeType;
        //
        //             this.routingConfigModel.buildTableContent(data);
        //             var allData = this.routingConfigModel.getRoutingConfigList();
        //
        //             var moTypeMatchedData = [];
        //             if (filterMoType.length === 0) {
        //                 moTypeMatchedData = allData;
        //             } else {
        //                 for (var val in allData) {
        //                     var iMatch = allData[val].moType.toLowerCase().indexOf(filterMoType);
        //                     if (iMatch >= 0) {
        //                         moTypeMatchedData.push(allData[val]);
        //                     }
        //                 }
        //             }
        //
        //             var nesMatchedData = [];
        //             if (filterNes.length === 0) {
        //                 nesMatchedData = [];
        //             } else {
        //                 for (var a in moTypeMatchedData) {
        //                     var nes = moTypeMatchedData[a].nes;
        //                     eachRowLoop:
        //                         for (var b in nes) {
        //                             for (var c in filterNes) {
        //                                 if (nes[b] === filterNes[c]) {
        //                                     nesMatchedData.push(moTypeMatchedData[a]);
        //                                     break eachRowLoop;
        //                                 }
        //                             }
        //                         }
        //                 }
        //             }
        //
        //             var routeTypeMatchedData = [];
        //             if (filterRoutingMethods === 0) {
        //                 routeTypeMatchedData = [];
        //             } else {
        //                 for (var i in nesMatchedData) {
        //                     var routeType = nesMatchedData[i].routeType;
        //                     for (var j in filterRoutingMethods) {
        //                         if (routeType === filterRoutingMethods[j]) {
        //                             routeTypeMatchedData.push(nesMatchedData[i]);
        //                         }
        //                     }
        //                 }
        //             }
        //
        //             filetredData = routeTypeMatchedData;
        //             this.createTable(filetredData);
        //             var fetchedResults = filetredData;
        //             if (fetchedResults.length > 0) {
        //                 var selectedPage = null;
        //                 if (this.pagination !== null) {
        //                     selectedPage = this.pagination.selectedPage;
        //                 }
        //                 this.paging(fetchedResults, selectedPage);
        //             }
        //         }.bind(this),
        //         error: function (response) {
        //             console.log("Get Routing List from Backend failed: " + response.getStatusText());
        //             this.popErrorNotification("Get Routing List from Backend failed.");
        //         }.bind(this)
        //     });
        // },

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
                showAsToast: true
            });
            this.failNotificationWidget.attachTo(this.getElement().getParent().getParent().getParent().getParent());

        },

        sleep: function (sleepTime) {
            for (var start = Date.now(); Date.now() - start <= sleepTime;) {
            }
        }
    });

});
