sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  (Controller, JSONModel) => {
    "use strict";

    return Controller.extend(
      "matix.com.rep.stockdifflocation.stockdifflocation.controller.View",
      {
        onInit() {},
        onNextButtonPress: function () {
          var aFilters = new Array();
          var oFilterPlant = new sap.ui.model.Filter({
            path: "Werks",
            operator: "EQ",
            value1: "1000",
          });
          aFilters.push(oFilterPlant);

          var oFilterPlant = new sap.ui.model.Filter({
            path: "Matnr",
            operator: "EQ",
            value1: "4400000000",
          });
          aFilters.push(oFilterPlant);

          var sPath = "/Es_Stock_Report";
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
        onResetButtonPress: function(){
          this.getView().getModel(
           "oModelForTable"
          ).setData({});
        }
      }
    );
  }
);
