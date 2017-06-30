define([
    "commonComponents/model/StatefulModel",
    "i18n!timgui/dictionary.json"
], function (StatefulModel, dictionary) {


    return StatefulModel.extend({

        url: "/timgui-backend/tables/AAA",

        buildTableContent: function (data) {
            return data.tableContents;
        },

        buildTableHeader: function (data) {
            return data.tableHeader;
        },

        buildTableName: function (data) {
            return data.tableName;
        },

        getRoutingConfigList: function () {
            return this.tableContents;
        }

    });
});
