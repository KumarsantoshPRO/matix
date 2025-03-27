sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/util/ExportTypeCSV",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/format/DateFormat",
  ],
  (Controller, JSONModel, ExportTypeCSV, exportLibrary, Spreadsheet, DateFormat) => {
    "use strict";
    var EdmType = exportLibrary.EdmType;
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
                var totalStock = 0;
                for (let index = 0; index < oData.results.length; index++) {
                  const element = oData.results[index];
                  totalStock = totalStock + Number(element.Labst);
                }
                this.getView().setModel(
                  new JSONModel({ totalStock: totalStock }),
                  "oLocalModel"
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
        // Start: Download Excel
        //Excel export using Spreadsheet
        onExport: function () {
          var aCols, oRowBinding, oSettings, oSheet, oTable;

          if (!this._oTable) {
            this._oTable = this.getView().byId("table");
          }

          oTable = this._oTable;
          oRowBinding = oTable.getBinding("items");
          aCols = this.createColumnConfig();
          var dateTime = DateFormat.getDateInstance({
            pattern: "dd-MM-yyyy HH:mm:ss",
          }).format(new Date());
          var fileName = "Stocks at Different Location(" + dateTime + ").xlsx";
          oSettings = {
            workbook: {
              columns: aCols,
              hierarchyLevel: "Level",
              textAlign: "Left",
              wrap: true,
              context: {
                sheetName: "Stocks at Different Location",
              },
            },
            dataSource: oRowBinding,
            count: 0,
            fileName: fileName,
            worker: false, // We need to disable worker because we are using a MockServer as OData Service
          };

          oSheet = new Spreadsheet(oSettings);
          oSheet.build().finally(function () {
            oSheet.destroy();
          });
        },
        createColumnConfig: function () {
          var aCols = [];
          aCols.push({
            label: "Material Code",
            property: "Matnr",
            type: EdmType.String,
          });
          aCols.push({
            label: "Material Name",
            property: "Name1",
            type: EdmType.String,
          });
          aCols.push({
            label: "Quantity",
            property: "Labst",
            type: EdmType.String,
          });
          aCols.push({
            label: "Plant",
            property: "Werks",
            type: EdmType.String,
          });
          aCols.push({
            label: "Location Code",
            property: "Lgort",
            type: EdmType.String,
          });

          return aCols;
        },
        // End: Download Excel
      }
    );
  }
);
