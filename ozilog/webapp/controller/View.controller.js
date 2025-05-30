sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/util/ExportTypeCSV",
    "sap/ui/export/library",
    "sap/ui/export/Spreadsheet",
    "sap/ui/core/format/DateFormat",
  ],
  (
    Controller,
    JSONModel,
    Filter,
    FilterOperator,
    ExportTypeCSV,
    exportLibrary,
    Spreadsheet,
    DateFormat
  ) => {
    "use strict";

    return Controller.extend("matix.com.log.ozilog.ozilog.controller.View", {
      onInit() {
        this.getView().setModel(
          new JSONModel({
            FromErdat: "",
            ToErdat: "",
            FromMatnr: "",
            ToMatnr: "",
            FromSalesOffice: "",
            ToSalesOffice: "",
            FromMatGroup: "",
            ToMatGroup: ""
          }),
          "oModelForFilters"
        );

        this.getView().setModel(
          new JSONModel({
            productDescrp: "",
            productToDescrp: "",
            FromSalesOfficeDescrp: "",
            ToSalesOffice: "",
            FromMatGroupDescrp: "",
            ToMatGroupDescrp: ""
          }),
          "oModelTemp"
        );

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

        var oFilterSalesOffice = new sap.ui.model.Filter({
          path: "Domname",
          operator: "EQ",
          value1: "TVKBZ",
        });

        this.getView().setBusy(true);
        oModel.read(sPath, {
          filters: [oFilterSalesOffice],
          success: function (data) {
            for (let index = 0; index < data.results.length; index++) {
              const element = data.results[index];
              element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
            }
            this.getView().setModel(
              new JSONModel(data.results),
              "oModelForSalesOffice"
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

        var oFiltermatGroup = new sap.ui.model.Filter({
          path: "Domname",
          operator: "EQ",
          value1: "T023T",
        });

        this.getView().setBusy(true);
        oModel.read(sPath, {
          filters: [oFiltermatGroup],
          success: function (data) {
            for (let index = 0; index < data.results.length; index++) {
              const element = data.results[index];
              element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
            }
            this.getView().setModel(
              new JSONModel(data.results),
              "oModelForMatGroup"
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
        var sValue = oEvent.getParameter("value");
        var oBinding = oInput.getBinding("suggestionItems");
        var aContexts = oBinding.getContexts();
        var bValid = false;

        // Check if the entered value exists in the suggestions
        for (var i = 0; i < aContexts.length; i++) {
          if (aContexts[i].getObject().text === sValue) {
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
      // product
      onProductInputSuggestionItemSelected: function (oEvent) {

        var sValue = oEvent.getParameter("selectedItem").getProperty("text");
        this.getView()
          .getModel("oModelForFilters")
          .setProperty("/FromMatnr", sValue.split("-")[0]);
        var oInput = oEvent.getSource();
        oInput.setValueState("None");
        oInput.setValueStateText("");
        if (sValue.split("-")[1] !== "") {
          this.getView()
            .getModel("oModelTemp")
            .setProperty("/productDescrp", "-" + sValue.split("-")[1]);
        }
      },
      onProductToInputSuggestionItemSelected: function (oEvent) {
        var sValue = oEvent.getParameter("selectedItem").getProperty("text");
        this.getView()
          .getModel("oModelForFilters")
          .setProperty("/ToMatnr", sValue.split("-")[0]);
        var oInput = oEvent.getSource();
        oInput.setValueState("None");
        oInput.setValueStateText("");
        if (sValue.split("-")[1] !== "") {
          this.getView()
            .getModel("oModelTemp")
            .setProperty("/productToDescrp", "-" + sValue.split("-")[1]);
        }
      },
      // Sales office
      onFromSalesOfficeInputSuggestionItemSelected: function (oEvent) {
        var sValue = oEvent.getParameter("selectedItem").getProperty("text");
        this.getView()
          .getModel("oModelForFilters")
          .setProperty("/FromSalesOffice", sValue.split("-")[0]);
        var oInput = oEvent.getSource();
        oInput.setValueState("None");
        oInput.setValueStateText("");
        if (sValue.split("-")[1] !== "") {
          this.getView()
            .getModel("oModelTemp")
            .setProperty("/FromSalesOfficeDescrp", "-" + sValue.split("-")[1]);
        }
      },
      onToSalesOfficeInputSuggestionItemSelected: function (oEvent) {
        var sValue = oEvent.getParameter("selectedItem").getProperty("text");
        this.getView()
          .getModel("oModelForFilters")
          .setProperty("/ToSalesOffice", sValue.split("-")[0]);
        var oInput = oEvent.getSource();
        oInput.setValueState("None");
        oInput.setValueStateText("");
        if (sValue.split("-")[1] !== "") {
          this.getView()
            .getModel("oModelTemp")
            .setProperty(
              "/ToSalesOfficeOfficeDescrp",
              "-" + sValue.split("-")[1]
            );
        }
      },
      // Material Group
      onFromMatGroupInputSuggestionItemSelected: function (oEvent) {
        var sValue = oEvent.getParameter("selectedItem").getProperty("text");
        this.getView()
          .getModel("oModelForFilters")
          .setProperty("/FromMatGroup", sValue.split("-")[0]);
        var oInput = oEvent.getSource();
        oInput.setValueState("None");
        oInput.setValueStateText("");
        if (sValue.split("-")[1] !== "") {
          this.getView()
            .getModel("oModelTemp")
            .setProperty("/FromMatGroupDescrp", "-" + sValue.split("-")[1]);
        }
      },
      onToMatGroupInputSuggestionItemSelected: function (oEvent) {
        var sValue = oEvent.getParameter("selectedItem").getProperty("text");
        this.getView()
          .getModel("oModelForFilters")
          .setProperty("/ToMatGroup", sValue.split("-")[0]);
        var oInput = oEvent.getSource();
        oInput.setValueState("None");
        oInput.setValueStateText("");
        if (sValue.split("-")[1] !== "") {
          this.getView()
            .getModel("oModelTemp")
            .setProperty("/ToMatGroupDescrp", "-" + sValue.split("-")[1]);
        }
      },

      onSearchButtonPress: function () {
        var aFilters = new Array();
        //   dates

        var fromDate = this.getView()
          .getModel("oModelForFilters")
          .getProperty("/FromErdat");
        var toDate = this.getView()
          .getModel("oModelForFilters")
          .getProperty("/ToErdat");
        // Products
        var fromProduct = this.getView()
          .getModel("oModelForFilters")
          .getProperty("/FromMatnr");
        var toProduct = this.getView()
          .getModel("oModelForFilters")
          .getProperty("/ToMatnr");
        // Sales Office
        var fromSalesOffice = this.getView()
          .getModel("oModelForFilters")
          .getProperty("/FromSalesOffice");
        var toSalesOffice = this.getView()
          .getModel("oModelForFilters")
          .getProperty("/ToSalesOffice");
        // Material Group
        var fromMatGroup = this.getView()
          .getModel("oModelForFilters")
          .getProperty("/FromMatGroup");
        var toMatGroup = this.getView()
          .getModel("oModelForFilters")
          .getProperty("/ToMatGroup");

        if (
          !fromDate &&
          !toDate &&
          !fromProduct &&
          !toProduct &&
          !fromSalesOffice &&
          !toSalesOffice &&
          !fromMatGroup &&
          !toMatGroup
        ) {
          sap.m.MessageBox.error("Enter any one filter to get the details");
        } else {
          // Date
          if (!fromDate && toDate) {
            fromDate = toDate;
          } else if (!toDate && fromDate) {
            toDate = fromDate;
          }
          // Product
          if (!fromProduct && toProduct) {
            fromProduct = toProduct;
          } else if (!toProduct && fromProduct) {
            toProduct = fromProduct;
          }
          // Sales office
          if (!fromSalesOffice && toSalesOffice) {
            fromSalesOffice = toSalesOffice;
          } else if (!toSalesOffice && fromSalesOffice) {
            toSalesOffice = fromSalesOffice;
          }

          // Material Group
          if (!fromMatGroup && toMatGroup) {
            fromMatGroup = toMatGroup;
          } else if (!toMatGroup && fromMatGroup) {
            toMatGroup = fromMatGroup;
          }
          // Date
          if (fromDate && toDate) {
            var oFilterErdat = new sap.ui.model.Filter({
              path: "Erdat",
              operator: "BT",
              value1: fromDate,
              value2: toDate,
            });
            aFilters.push(oFilterErdat);
          }
          // Product
          if (fromProduct && toProduct) {
            var oFilterMatnr = new sap.ui.model.Filter({
              path: "Matnr",
              operator: "BT",
              value1: fromProduct,
              value2: toProduct,
            });
            aFilters.push(oFilterMatnr);
          }
          // Sales Office
          if (fromSalesOffice && toSalesOffice) {
            var oFilterSalesOffice = new sap.ui.model.Filter({
              path: "SalesOffice",
              operator: "BT",
              value1: fromSalesOffice,
              value2: toSalesOffice,
            });
            aFilters.push(oFilterSalesOffice);
          }
          if (fromMatGroup && toMatGroup) {
            var oFilterMatGroup = new sap.ui.model.Filter({
              path: "Matkl",
              operator: "BT",
              value1: fromMatGroup,
              value2: toMatGroup,
            });
            aFilters.push(oFilterMatGroup);
          }
          // Date
          if (fromDate > toDate) {
            sap.m.MessageBox.error(
              "'From date' can not be less than 'To date'"
            );
          }
          // Product 
          else if (fromProduct > toProduct) {
            sap.m.MessageBox.error(
              "'From Product' can not be less than 'To Product'"
            );
          }
          // Sales Office 
          else if (fromSalesOffice > toSalesOffice) {
            sap.m.MessageBox.error(
              "'From Sales Office' can not be less than 'To Sales Office'"
            );
          }
          // Material Group 
          else if (fromMatGroup > toMatGroup) {
            sap.m.MessageBox.error(
              "'From Material Group' can not be less than 'To Material Group'"
            );
          }
          else {
            var sPath = "/Et_Obd_log";
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
          }
        }
      },
      onResetButtonPress: function () {
        this.getView().getModel("oModelForFilters").setData({});
        this.getView().getModel("oModelForTable").setData({});
        this.getView().getModel("oModelTemp").setData({});
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
        var fileName = "OBD, ZGE and Invoice Log(" + dateTime + ").xlsx";
        oSettings = {
          workbook: {
            columns: aCols,
            hierarchyLevel: "Level",
            textAlign: "Left",
            wrap: true,
            context: {
              sheetName: "OBD, ZGE and Invoice Log",
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
          property: "SoNo",
          label: "SO No",
          type: EdmType.String,
        });
        aCols.push({
          property: "SoDate",
          label: "SO Date",
          type: EdmType.String,
        });
        aCols.push({
          property: "ObdNo",
          label: "OBD No",
          type: EdmType.String,
        });
        aCols.push({
          property: "Erdat",
          label: "OBD Date",
          type: EdmType.String,
        });
        aCols.push({
          property: "SoQty",
          label: "Order Qty",
          type: EdmType.String,
        });
        aCols.push({
          property: "Lfimg",
          label: "Delivery Qty",
          type: EdmType.String,
        });
        aCols.push({
          property: "PgiDoc",
          label: "PGI no",
          type: EdmType.String,
        });
        aCols.push({
          property: "PgiDate",
          label: "PGI Date",
          type: EdmType.String,
        });
        aCols.push({
          property: "InvNo",
          label: "Invoice No",
          type: EdmType.String,
        });
        aCols.push({
          property: "InvDate",
          label: "Invoice Date",
          type: EdmType.String,
        });
        aCols.push({
          property: "BalInvQty",
          label: "Invoice Qty Balance",
          type: EdmType.String,
        });
        aCols.push({
          property: "Werks",
          label: "Plant",
          type: EdmType.String,
        });
        aCols.push({
          property: "Lgort",
          label: "Storage Location",
          type: EdmType.String,
        });
        aCols.push({
          property: "Geino",
          label: "Gate Entry No",
          type: EdmType.String,
        });
        aCols.push({
          property: "Vhlnr",
          label: "Truck No",
          type: EdmType.String,
        });
        aCols.push({
          property: "ZtruckCap",
          label: "Truck Capacity",
          type: EdmType.String,
        });
        aCols.push({
          property: "Lrno",
          label: "LR No",
          type: EdmType.String,
        });
        aCols.push({
          property: "Lrdat",
          label: "LR Date",
          type: EdmType.String,
        });
        aCols.push({
          property: "Matnr",
          label: "material No",
          type: EdmType.String,
        });
        aCols.push({
          property: "Arktx",
          label: "material Description",
          type: EdmType.String,
        });
        aCols.push({
          property: "SalesOffice",
          label: "Sales office",
          type: EdmType.String,
        });
        return aCols;
      },
      // End: Download Excel
    });
  }
);
