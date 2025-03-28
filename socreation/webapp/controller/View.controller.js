sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/vk/Material",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
  ],
  (Controller, Material, JSONModel, Filter, FilterOperator, MessageBox) => {
    "use strict";

    return Controller.extend(
      "matix.com.sp.socreation.socreation.controller.View",
      {
        onInit() {
          sap.ui.core.UIComponent.getRouterFor(this);
          this.getOwnerComponent()
            .getRouter()
            .attachRoutePatternMatched(this.onRouteMatched, this);
          this.loadDataForSuggestions();
          this.loadPayloads();
        },
        onRouteMatched: function(){
          this.loadPayloads();
        },
        loadPayloads: function () {
          var headerPayload = {
            DocType: "",
            ReqDateH: "",
            Ref1: "",
            SalesOrg: "1000-Matix Sales Group",
            Pmnttrms: "",
            DistrChan: "",
            Incoterms1: "",
            Incoterms2: "",
            Division: "",
            PriceDate: "",
            PurchNoC: "",
            DocDate: "",
            Lrdat: "",
            Lrno: "",
            Vhlnr: "",
            ZtruckCap: "",
            Tdlnr: "",
            ET_SO_AUTO_CREATION_ORDER_ITEM: [],

            ET_SO_AUTO_CREATION_PARTNERSET: [
              {
                PartnRole: "SP",
                PartnNumb: "",
              },

              {
                PartnRole: "SH",
                PartnNumb: "",
              },
            ],

            ET_SO_AUTO_CREATION_SCHEDULESE: [],
          };
          this.getOwnerComponent().setModel(
            new JSONModel(headerPayload),
            "oModelForHeader"
          );
          this.itemNo = 10;
          var dataFortable = {
            results: [
              {
                ItmNumber: this.itemNo.toString(),
                TargetQu: "",
                Material: "",
                Batch: "",
                Plant: "",
                StoreLoc: "",
                TargetQty: "",
                MatlGroup: "",
              },
            ],
          };

          this.getOwnerComponent().setModel(
            new JSONModel(dataFortable),
            "oModelForItems"
          );

          var dataForTemp = {
            MatlGroup: "",
            matDescription: "",
          };
          this.getOwnerComponent().setModel(
            new JSONModel(dataForTemp),
            "oModelTemp"
          );
        },
        onResetButtonPress: function () {
          this.loadPayloads();
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
          this.getView().setBusy(true);
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

              this.getView().setBusy(false);
            }.bind(this),
            error: function (sError) {
              MessageBox.error(sError.message);
              this.getView().setBusy(false);
            }.bind(this),
          });

          var oFilterDisChanel = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "TVTWT",
          });
          this.getView().setBusy(true);
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

              this.getView().setBusy(false);
            }.bind(this),
            error: function (sError) {
              MessageBox.error(sError.message);
              this.getView().setBusy(false);
            }.bind(this),
          });

          var oFilterDivision = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "TSPAT",
          });
          this.getView().setBusy(true);
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
              this.getView().setBusy(false);
            }.bind(this),
            error: function (sError) {
              MessageBox.error(sError.message);
              this.getView().setBusy(false);
            }.bind(this),
          });

          var oFilterMatGroup = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "T023T",
          });
          this.getView().setBusy(true);
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
              this.getView().setBusy(false);
            }.bind(this),
            error: function (sError) {
              MessageBox.error(sError.message);
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
