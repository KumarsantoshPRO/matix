sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/vk/Material",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  (Controller, Material, JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend(
      "matix.com.sp.socreation.socreation.controller.View",
      {
        onInit() {
          var tableForData = {
            results: [
              {
                Material: "4400000000-Neam Coated Urea",
                MaterialDescription: "",
                Quantity: "",
                Unit: "TON",
                Plant: "1000-PANAGARH IN",
                StorageLocation: "1021 Bagged Urea",
                Contract: "",
                BatchNo: "",
              },
            ],
          };

          this.getView().setModel(
            new JSONModel(tableForData),
            "oModelForTable"
          );
          sap.ui.core.UIComponent.getRouterFor(this);
          this.getOwnerComponent()
            .getRouter()
            .attachRoutePatternMatched(this.onRouteMatched, this);
          this.loadDataForSuggestions();
        },

        loadDataForSuggestions: function () {
          var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";
          var oModel = new sap.ui.model.odata.ODataModel(sService, true);
          var sPath = "/Es_F4_ValueSet";

          var oFilterSODocType = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "TVAKT",
          });

          oModel.read(sPath, {
            filters: [oFilterSODocType],
            success: function (data) {
              for (let index = 0; index < data.results.length; index++) {
                const element = data.results[index];
                element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
              }
              this.getView().setModel(
                new JSONModel(data.results),
                "oModelForSODocType"
              );
            }.bind(this),
            error: function (sError) {}.bind(this),
          });

          var oFilterDisChanel = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "TVTWT",
          });

          oModel.read(sPath, {
            filters: [oFilterDisChanel],
            success: function (data) {
              for (let index = 0; index < data.results.length; index++) {
                const element = data.results[index];
                element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
              }
              this.getView().setModel(
                new JSONModel(data.results),
                "oModelForDistChannel"
              );
            }.bind(this),
            error: function (sError) {}.bind(this),
          });

          var oFilterDivision = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "TSPAT",
          });

          oModel.read(sPath, {
            filters: [oFilterDivision],
            success: function (data) {
              for (let index = 0; index < data.results.length; index++) {
                const element = data.results[index];
                element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
              }
              this.getView().setModel(
                new JSONModel(data.results),
                "oModelForDivision"
              );
            }.bind(this),
            error: function (sError) {}.bind(this),
          });

          var oFilterMatGroup = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "T023T",
          });

          oModel.read(sPath, {
            filters: [oFilterMatGroup],
            success: function (data) {
              for (let index = 0; index < data.results.length; index++) {
                const element = data.results[index];
                element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
              }
              this.getView().setModel(
                new JSONModel(data.results),
                "oModelForMatGroup"
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

          oEvent.getSource().getBinding("suggestionItems").filter(Filters);
        },

        onRouteMatched: function (oEvent) {},

        onNextButtonPress: function () {
          this.oRouter = this.getOwnerComponent().getRouter();
          this.oRouter.navTo("View2", {
            SONo: "null",
          });
        },
      }
    );
  }
);
