module.exports = function (app) {
    app.get("/timgui-backend/tables/get/listAll", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/tables.json"));
    });

    app.get("/timgui-backend/tables/get/Dispatch", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/tableContents/Dispatch.json"));
    });

    app.get("/timgui-backend/tables/get/AVPType", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/tableContents/AVPType.json"));
    });

    app.get("/timgui-backend/tables/get/WF", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/tableContents/WF.json"));
    });

    app.get("/timgui-backend/tables/get/Action", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/tableContents/Action.json"));
    });

    app.get("/timgui-backend/tables/get/ErrorMsg", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/tableContents/ErrorMsg.json"));
    });

    app.get("/timgui-backend/tables/filter/AAA", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/filter/AAA.json"));
    });

    app.get("/timgui-backend/tables/filter/BBB", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/filter/BBB.json"));
    });

    app.get("/timgui-backend/tables/filter/CCC", function (req, res) {
        res.status(200).send(require("./src/timgui/mockdata/filter/CCC.json"));
    });

    app.post("/timgui-backend/tables/insert/Dispatch", function (req, res) {
        res.status(204).send();
    });

    app.post("/timgui-backend/tables/insert/BBB", function (req, res) {
        res.status(204).send();
    });

    app.post("/timgui-backend/tables/insert/CCC", function (req, res) {
        res.status(204).send();
    });

    app.delete("/timgui-backend/tables/delete/AAA", function (req, res) {
        res.status(204).send();
    });

    app.delete("/timgui-backend/tables/delete/BBB", function (req, res) {
        res.status(204).send();
    });

    app.delete("/timgui-backend/tables/delete/CCC", function (req, res) {
        res.status(204).send();
    });

    app.put("/timgui-backend/tables/set/Dispatch", function (req, res) {
        res.status(204).send();
    });

    app.put("/timgui-backend/tables/set/BBB", function (req, res) {
        res.status(204).send();
    });

    app.put("/timgui-backend/tables/set/CCC", function (req, res) {
        res.status(204).send();
    });


    app.get("/oauth/v1/session", function (req, res) {
        res.status(204).send();
    });

    app.get("/oauth/v1/refresh", function (req, res) {
        res.cookie("TOKEN", "TokenSetFromMockServer", {maxAge: 50000000, httpOnly: false});
        res.status(204).send();
    });
}
