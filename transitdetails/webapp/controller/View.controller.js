sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/util/ExportTypeCSV",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
  ],
  (Controller, JSONModel, ExportTypeCSV, exportLibrary, Spreadsheet) => {
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
            operator: "BT",
            value1: this.getView()
              .getModel("oModelForFilters")
              .getProperty("/PeriodFrm"),
            value2: this.getView()
              .getModel("oModelForFilters")
              .getProperty("/PeriodTo"),
          });
          aFilters.push(oFilterPeriodFrm);

          // var oFilterPeriodTo = new sap.ui.model.Filter({
          //   path: "PeriodTo",
          //   operator: "EQ",
          //   value1: this.getView()
          //     .getModel("oModelForFilters")
          //     .getProperty("/PeriodTo"),
          // });
          // aFilters.push(oFilterPeriodTo);

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

        oSettings = {
          workbook: {
            columns: aCols,
            hierarchyLevel: "Level",
            textAlign: "Left",
            wrap: true,
            context: {
              sheetName: "List of Debtors Outstanding",
            },
          },
          dataSource: oRowBinding,
          count: 0,
          fileName: "List of Debtors Outstanding.xlsx",
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
          property: "CustomerNumber",
          type: EdmType.String,
        });
        aCols.push({
          property: "CustomerName",
          type: EdmType.String,
        });
        aCols.push({
          property: "DistrictCode",
          type: EdmType.String,
        });
        aCols.push({
          property: "DistrictName",
          type: EdmType.String,
        });
        aCols.push({
          property: "CreditLimit",
          type: EdmType.String,
        });
        aCols.push({
          property: "ValidTill",
          type: EdmType.String,
        });
        aCols.push({
          property: "Balance",
          type: EdmType.String,
        });

        return aCols;
      },
      // End: Download Excel
      }
    );
  }
);
