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
  (Controller, JSONModel, ExportTypeCSV, exportLibrary, Spreadsheet, DateFormat, Filter, FilterOperator) => {
    "use strict";
    var EdmType = exportLibrary.EdmType;
    return Controller.extend(
      "matix.com.rep.stockdifflocation.stockdifflocation.controller.View",
      {
        onInit() {
          this.getView().setModel(new JSONModel({ Plant: "", PlantDescrp: "", Material: "", MaterialDescrp: "" }), "oModelForFilters");
          this.loadSuggestions();
        },
        loadSuggestions: function () {
          var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";
          var oModel = new sap.ui.model.odata.ODataModel(sService, true);
          var sPath = "/Es_F4_ValueSet";

          var oFilterMaterial = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "MATNR",
          });

          this.getView().setBusy(true);
          oModel.read(sPath, {
            filters: [oFilterMaterial],
            success: function (data) {
              for (let index = 0; index < data.results.length; index++) {
                const element = data.results[index];
                element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
              }
              this.getView().setModel(
                new JSONModel(data.results),
                "oModelForMaterial"
              );
              this.getView().setBusy(false);
            }.bind(this),
            error: function (sError) {
              MessageBox.error(
                JSON.parse(sError.responseText).error.message.value
              );
              this.getView().setBusy(false);
            }.bind(this),
          });

          var oFilterPlant = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "WERKS",
          });

          this.getView().setBusy(true);
          oModel.read(sPath, {
            filters: [oFilterPlant],
            success: function (data) {
              for (let index = 0; index < data.results.length; index++) {
                const element = data.results[index];
                element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
              }
              this.getView().setModel(
                new JSONModel(data.results),
                "oModelForPlant"
              );
              this.getView().setBusy(false);
            }.bind(this),
            error: function (sError) {
              MessageBox.error(
                JSON.parse(sError.responseText).error.message.value
              );
              this.getView().setBusy(false);
            }.bind(this),
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

          oEvent.getSource().getBinding("suggestionItems").filter(Filters);
        },
        onInputChange: function (oEvent) {
          var oInput = oEvent.getSource();
          var sValue = oEvent.getParameter("value").split("-")[0];
          var oBinding = oInput.getBinding("suggestionItems");
          var aContexts = oBinding.getContexts();
          var bValid = false;

          // Check if the entered value exists in the suggestions
          for (var i = 0; i < aContexts.length; i++) {
            if (aContexts[i].getObject().DomvalueL === sValue) {
              bValid = true;
              break;
            }
          }

          if (!bValid && sValue !== "") {
            // Input is invalid (not in suggestions and not empty)
            oInput.setValueState("Error");
            oInput.setValue("");
            sap.m.MessageToast.show(
              "Please select a valid entry from the suggestions."
            );
          } else {
            // Input is valid (either in suggestions or empty)
            oInput.setValueState("None");
            oInput.setValueStateText("");
          }
        },
        onPlantInputSuggestionItemSelected: function (oEvent) {

          var sValue = oEvent.getParameter("selectedItem").getProperty("text");
          this.getView()
            .getModel("oModelForFilters")
            .setProperty("/Plant", sValue.split("-")[0]);
          var oInput = oEvent.getSource();
          oInput.setValueState("None");
          oInput.setValueStateText("");
          if (sValue.split("-")[1] !== "") {
            this.getView()
              .getModel("oModelForFilters")
              .setProperty("/PlantDescrp", "-" + sValue.split("-")[1]);
          }
        },
        onMaterialInputSuggestionItemSelected: function (oEvent) {
          var sValue = oEvent.getParameter("selectedItem").getProperty("text");
          this.getView()
            .getModel("oModelForFilters")
            .setProperty("/Material", sValue.split("-")[0]);
          var oInput = oEvent.getSource();
          oInput.setValueState("None");
          oInput.setValueStateText("");
          if (sValue.split("-")[1] !== "") {
            this.getView()
              .getModel("oModelForFilters")
              .setProperty("/MaterialDescrp", "-" + sValue.split("-")[1]);
          }
        },
        onNextButtonPress: function () {
          var aFilters = new Array();
          var plant = this.getView().getModel("oModelForFilters").getProperty("/Plant");
          var material = this.getView().getModel("oModelForFilters").getProperty("/Material");
          if (plant) {
            var oFilterPlant = new sap.ui.model.Filter({
              path: "Werks",
              operator: "EQ",
              value1: plant,
            });
            aFilters.push(oFilterPlant);
          }


          if (material) {
            var oFilterMaterial = new sap.ui.model.Filter({
              path: "Matnr",
              operator: "EQ",
              value1: material,
            });
            aFilters.push(oFilterMaterial);
          }

          if (!plant && !material) {
            sap.m.MessageBox.error("Plant or Material filter is required to get details");
          } else {
            var sPath = "/Es_Stock_Report";
            this.getView().setBusy(true);
            this.getView()
              .getModel()
              .read(sPath, {
                filters: aFilters,
                success: function (oData) {
                  if (oData.results.length < 1) {
                    sap.m.MessageBox.error("No details to show");
                  }
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
          }

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
