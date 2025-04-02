sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/util/ExportTypeCSV",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  (
    Controller,
    JSONModel,
    ExportTypeCSV,
    exportLibrary,
    Spreadsheet,
    DateFormat,
    Filter,
    FilterOperator
  ) => {
    "use strict";
    var EdmType = exportLibrary.EdmType;
    return Controller.extend("matix.com.rep.debtors.debtors.controller.View", {
      onInit() {
        this.getView().setModel(
          new JSONModel({
            CustomerNumber: "",
            Keydate: new Date(),
          }),
          "oModelForFilters"
        );
        this.getView().setModel(new JSONModel(), "oModelForTable");
        this.loadDataForSuggestions();
      },

      loadDataForSuggestions: function () {
        var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";

        var oModel = new sap.ui.model.odata.ODataModel(sService, true);
        var oFilterSP = new sap.ui.model.Filter({
          path: "Domname",
          operator: "EQ",
          value1: "KUNNR",
        });

        var sPath = "/Es_F4_ValueSet";
        oModel.read(sPath, {
          filters: [oFilterSP],
          success: function (data) {
            for (let index = 0; index < data.results.length; index++) {
              const element = data.results[index];
              element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
            }
            this.getView().setModel(
              new JSONModel(data.results),
              "oModelForSoldTopart"
            );
          }.bind(this),
          error: function (sError) {}.bind(this),
        });
      },

      onSuggest: function (oEvent) {
        var sTerm = oEvent.getParameter("suggestValue");
        var aFilters = [];
        aFilters.push(
          new Filter("Ddtext", FilterOperator.Contains, sTerm.toString())
        );
        aFilters.push(
          new Filter("DomvalueL", FilterOperator.Contains, sTerm.toString())
        );
        if (sTerm) {
          var Filters = new Filter({
            filters: aFilters,
            and: false,
          });
        }
        debugger;
        oEvent.getSource().getBinding("suggestionItems").filter(Filters);
      },

      onNextButtonPress: function () {
        var aFilters = new Array();

        var oFilterSoldToParty = new sap.ui.model.Filter({
          path: "CustomerNumber",
          operator: "EQ",
          value1: "500000",
        });
        aFilters.push(oFilterSoldToParty);

        var oFilterDate = new sap.ui.model.Filter({
          path: "Keydate",
          operator: "EQ",
          value1: this.getView()
            .getModel("oModelForFilters")
            .getProperty("/Keydate"),
        });
        aFilters.push(oFilterDate);

        var sPath = "/Es_Debtors_Ageing";
        this.getView().setBusy(true);
        this.getView()
          .getModel()
          .read(sPath, {
            filters: aFilters,
            success: function (oData) {
              // this.getView().setModel();
              this.getView().getModel("oModelForTable").setData(oData.results);
              this.getView().byId("myMessageStrip").setVisible(true);
              this.getView().setBusy(false);
            }.bind(this),
            error: function (oError) {
              this.getView().setBusy(false);
            }.bind(this),
          });
      },
      onResetButtonPress: function () {
        this.getView().getModel("oModelForFilters").setData({});
        this.getView().getModel("oModelForTable").setData({});
        this.getView().byId("myMessageStrip").setVisible(false);
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
        var fileName = "List of Debtors Outstanding(" + dateTime + ").xlsx";
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
    });
  }
);
