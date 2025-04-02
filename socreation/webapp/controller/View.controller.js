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
            .attachRoutePatternMatched(this._onRouteMatched, this);
          this.loadDataForSuggestions();
          this.loadPayloads();
        },
        _onRouteMatched: function (oEvent) {
          if (oEvent.getParameter("name") === "View2") {
          } else {
            this.loadPayloads();
          }
        },
        loadPayloads: function () {
          var headerPayload = {
            DocType: "ZRAO",
            ReqDateH: "",
            Ref1: "",
            SalesOrg: "1000",
            Pmnttrms: "",
            DistrChan: "10",
            Incoterms1: "FOB",
            Incoterms2: "",
            Division: "UR",
            PriceDate: "",
            PurchNoC: "",
            DocDate: new Date(),
            Lrdat: "",
            Lrno: null,
            Vhlnr: null,
            ZtruckCap: null,
            Tdlnr: null,
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

          var dataFortable = {
            results: [
              {
                ItmNumber: "10",
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
            MatlGroup: "90",
            matDescription: "",
            DocDescription: "-SO FR & UR W/O Cont.",
            DistrChanDescription: "-Dealers",
            DivisionDescription: "-Urea",
            PmnttrmsDescrp: "",
            PartnNumbDescrp: "",
            PartnNumbDescrp2: "",
            Incoterms1Descrp: "-Free on Board",
            SalesOrgDescription: "-Matix Sales Group",
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
              MessageBox.error(
                JSON.parse(sError.responseText).error.message.value
              );
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
              MessageBox.error(
                JSON.parse(sError.responseText).error.message.value
              );
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
              MessageBox.error(
                JSON.parse(sError.responseText).error.message.value
              );
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

        onRouteMatched: function (oEvent) {},

        onNextButtonPress: function () {
          var nTemp = 1;
          // var myModel = this.getOwnerComponent().getModel("oModelForHeader");

          // var docType = this.getView().byId("idInputSODocType").getValue(),
          //   DistrChan = this.getView().byId("idInputDistChanel").getValue(),
          //   Division = this.getView().byId("idInputDivision").getValue();

          // if (!docType) {
          //   nTemp = 0;
          //   this.getView().byId("idInputSODocType").setValueState("Error");
          // } else if (!DistrChan) {
          //   nTemp = 0;
          //   this.getView().byId("idInputDistChanel").setValueState("Error");
          // } else if (!Division) {
          //   nTemp = 0;
          //   this.getView().byId("idInputDivision").setValueState("Error");
          // } else {
          //   nTemp = 1;
          //   this.getView().byId("idInputSODocType").setValueState("None");
          //   this.getView().byId("idInputDistChanel").setValueState("None");
          //   this.getView().byId("idInputDivision").setValueState("None");
          // }

          if (nTemp === 1) {
            this.oRouter = this.getOwnerComponent().getRouter();
            this.oRouter.navTo("View2", {
              SONo: "null",
            });
          } else {
            MessageBox.error("Enter all mandatory fields");
          }
        },

        onDocTypeSugSelect: function (oEvent) {
          var sValue = oEvent.getParameter("selectedItem").getProperty("text");
          this.getOwnerComponent()
            .getModel("oModelForHeader")
            .setProperty("/DocType", sValue.split("-")[0]);

          if (sValue.split("-")[1] !== "") {
            this.getOwnerComponent()
              .getModel("oModelTemp")
              .setProperty("/DocDescription", "-" + sValue.split("-")[1]);
          }
        },
        onDistChanSugSelect: function (oEvent) {
          var sValue = oEvent.getParameter("selectedItem").getProperty("text");
          this.getOwnerComponent()
            .getModel("oModelForHeader")
            .setProperty("/DistrChan", sValue.split("-")[0]);

          if (sValue.split("-")[1] !== "") {
            this.getOwnerComponent()
              .getModel("oModelTemp")
              .setProperty("/DistrChanDescription", "-" + sValue.split("-")[1]);
          }
        },
        onDivisionSugSelect: function (oEvent) {
          var sValue = oEvent.getParameter("selectedItem").getProperty("text");
          this.getOwnerComponent()
            .getModel("oModelForHeader")
            .setProperty("/Division", sValue.split("-")[0]);

          if (sValue.split("-")[1] !== "") {
            this.getOwnerComponent()
              .getModel("oModelTemp")
              .setProperty("/DivisionDescription", "-" + sValue.split("-")[1]);
          }
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
      }
    );
  }
);
