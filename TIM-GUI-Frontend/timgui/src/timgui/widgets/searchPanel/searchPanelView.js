define([
    "jscore/core",
    "template!./searchPanel.html",
    "text!./searchPanel.less",
    "i18n!Timgui/dictionary.json"
], function (core, template, style, dictionary) {

    return core.View.extend({
        getTemplate: function () {
            return template(dictionary);
        },

        getStyle: function () {
            return style;
        },

        getTab: function () {
            return this.getElement().find('.ebSelectTable');
        },

        showDispatch: function () {
            return this.getElement().find('.ebDialogBox-Dispatch');
        },

        getDispatchLogin: function () {
            return this.getElement().find('.ebTypeDispatch-Login-Input');
        },

        getDispatchActivity: function () {
            return this.getElement().find('.ebTypeDispatch-Activity-Input');
        },

        getDispatchNpar: function () {
            return this.getElement().find('.ebTypeDispatch-Npar-Input');
        },

        showBBB: function () {
            return this.getElement().find('.ebDialogBox-BBB');
        },

        getBBBName: function () {
            return this.getElement().find('.ebTypeBBB-Name-Input');
        },

        getBBBAge: function () {
            return this.getElement().find('.ebTypeBBB-Age-Input');
        },

        getBBBJob: function () {
            return this.getElement().find('.ebTypeBBB-Job-Input');
        },

        getBBBHometown: function () {
            return this.getElement().find('.ebTypeBBB-Hometown-Input');
        },

        showCCC: function () {
            return this.getElement().find('.ebDialogBox-CCC');
        },

        getCCCName: function () {
            return this.getElement().find('.ebTypeCCC-Name-Input');
        },

        getCCCScore: function () {
            return this.getElement().find('.ebTypeCCC-Score-Input');
        },

        getCCCRank: function () {
            return this.getElement().find('.ebTypeCCC-Rank-Input');
        },

        addSearchClickHandler: function (fn) {
            return this.getElement().find(".eaTimgui-searchWidget-startSearchButton").addEventHandler("click", fn);
        },

        addClearClickHandler: function (fn) {
            var clearButton = this.getElement().find(".eaTimgui-SearchRegion-cancelSearch");
            clearButton.addEventHandler("click", fn);
        },

        isSearchEnabled: function () {
            var searchButton = this.getElement().find(".eaTimgui-searchWidget-startSearchButton");
            return searchButton.getAttribute("disabled") === undefined;
        },

        enableCancel: function () {
            var searchButton = this.getElement().find(".eaTimgui-searchWidget-startSearchButton");
            searchButton.setProperty("disabled", "disabled");
        },

        disableSearch: function () {
            var searchButton = this.getElement().find(".eaTimgui-searchWidget-startSearchButton");
            searchButton.setAttribute("disabled", "disabled");
        },

        enableSearch: function () {
            var searchButton = this.getElement().find(".eaTimgui-searchWidget-startSearchButton");
            searchButton.removeAttribute("disabled");
        }
    });
});