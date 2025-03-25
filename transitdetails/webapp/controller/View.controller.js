sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  (Controller, JSONModel) => {
    "use strict";

    return Controller.extend(
      "matix.com.rep.transitdetails.transitdetails.controller.View",
      {
        onInit() {
          this.getView().setModel(
            new JSONModel({
              LipsMatnr: "",
              LikpBzirk: "",
              LipsWerks: "",
              PeriodFrm: "",
              PeriodTo: "",
            }),
            "oModelForFilters"
          );
        },
        onNextButtonPress: function () {
          var aFilters = new Array();
          //   var oFilterLips = new sap.ui.model.Filter({
          //     path: "Lips",
          //     operator: "EQ",
          //     value1: "1000",
          //   });
          //   aFilters.push(oFilterLips);

          var oFilterLipsMatnr = new sap.ui.model.Filter({
            path: "LipsMatnr",
            operator: "EQ",
            value1: "4400000000",
          });
          aFilters.push(oFilterLipsMatnr);

          var oFilterLikpBzirk = new sap.ui.model.Filter({
            path: "LikpBzirk",
            operator: "EQ",
            value1: "",
          });
          aFilters.push(oFilterLikpBzirk);

          var oFilterLipsWerks = new sap.ui.model.Filter({
            path: "LipsWerks",
            operator: "EQ",
            value1: "B015",
          });
          aFilters.push(oFilterLipsWerks);

          var oFilterPeriodFrm = new sap.ui.model.Filter({
            path: "PeriodFrm",
            operator: "EQ",
            value1: this.getView()
              .getModel("oModelForFilters")
              .getProperty("/PeriodFrm"),
          });
          aFilters.push(oFilterPeriodFrm);

          var oFilterPeriodTo = new sap.ui.model.Filter({
            path: "PeriodTo",
            operator: "EQ",
            value1: this.getView()
              .getModel("oModelForFilters")
              .getProperty("/PeriodTo"),
          });
          aFilters.push(oFilterPeriodTo);

          var sPath = "/Es_Stock_In_Transit_Report";
          this.getView().setBusy(true);
          this.getView()
            .getModel()
            .read(sPath, {
              filters: aFilters,
              success: function (oData) {
                // this.getView().setModel();
                this.getView().setModel(
                  new JSONModel(oData.results),
                  "oModelForTable"
                );

                this.getView().setBusy(false);
              }.bind(this),
              error: function (oError) {
                this.getView().setBusy(false);
              }.bind(this),
            });
        },
        onResetButtonPress: function () {
          this.getView().getModel("oModelForTable").setData({});
        },
      }
    );
  }
);
