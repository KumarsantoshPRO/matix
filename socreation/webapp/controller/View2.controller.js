sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  function (Controller, JSONModel, DateFormat, Filter, FilterOperator) {
    "use strict";

    return Controller.extend(
      "matix.com.sp.socreation.socreation.controller.View2",
      {
        /**
         * @override
         */

        onInit() {
          this.getOwnerComponent()
            .getRouter()
            .attachRoutePatternMatched(this.onRouteMatched, this);
          this.loadPayloads();
          this.loadDataForSuggestions();
        },

        loadPayloads: function () {
          var headerPayload = {
            DocType: "ZRAO",
            ReqDateH: "2025-03-16T00:00:00",
            Ref1: "40000000",
            SalesOrg: "1000",
            Pmnttrms: "ZT04",
            DistrChan: "10",
            Incoterms1: "",
            Incoterms2: "FOB",
            Division: "UR",
            PriceDate: "2025-03-16T00:00:00",
            PurchNoC: "PURCH_NO_C",
            DocDate: "",
            Lrdat: "2025-03-12T00:00:00",
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
          this.getView().setModel(
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
              },
            ],
          };

          this.getView().setModel(
            new JSONModel(dataFortable),
            "oModelForItems"
          );
        },

        loadDataForSuggestions: function () {
          var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";
          var oModel = new sap.ui.model.odata.ODataModel(sService, true);
          var sPath = "/Es_F4_ValueSet";

          var oFilterSP = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "KNA1",
          });
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
              this.getView().setModel(
                new JSONModel(data.results),
                "oModelForShipToParty"
              );
            }.bind(this),
            error: function (sError) {}.bind(this),
          });
          var oFilterPT = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "T052U",
          });
          oModel.read(sPath, {
            filters: [oFilterPT],
            success: function (data) {
              for (let index = 0; index < data.results.length; index++) {
                const element = data.results[index];
                element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
              }
              this.getView().setModel(
                new JSONModel(data.results),
                "oModelForPaymentTerm"
              );
            }.bind(this),
            error: function (sError) {}.bind(this),
          });

          var oFilterIT = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "INCO1",
          });
          oModel.read(sPath, {
            filters: [oFilterIT],
            success: function (data) {
              for (let index = 0; index < data.results.length; index++) {
                const element = data.results[index];
                element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
              }
              this.getView().setModel(
                new JSONModel(data.results),
                "oModelForIncoTerm"
              );
            }.bind(this),
            error: function (sError) {}.bind(this),
          });

          var oFilterMaterial = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "MATERIAL",
          });
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
            }.bind(this),
            error: function (sError) {}.bind(this),
          });

          var oFilterPlant = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "WERKS",
          });
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
            }.bind(this),
            error: function (sError) {}.bind(this),
          });
          this.getView().setModel(new JSONModel(), "oModelForStorageLoc");
          this.getView().setModel(new JSONModel(), "oModelForBatch");
        },
        onSelectChangeMaterial: function (oEvent) {
          this.selectedMaterial = oEvent.getParameter("selectedItem").getKey();
        },
        onSelectChangePlant: function (oEvent) {
          var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";
          var oModel = new sap.ui.model.odata.ODataModel(sService, true);
          var sPath = "/Es_F4_ValueSet";
          this.selectedPlant = oEvent.getParameter("selectedItem").getKey();
          var aFilterStorageLoc = [];
          var oFilterStorageLoc = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "T001L",
          });

          aFilterStorageLoc.push(oFilterStorageLoc);
          var oFilterStorageLocPlant = new sap.ui.model.Filter({
            path: "Domname2",
            operator: "EQ",
            value1: this.selectedPlant,
          });
          debugger;
          aFilterStorageLoc.push(oFilterStorageLocPlant);
          oModel.read(sPath, {
            filters: aFilterStorageLoc,
            success: function (data) {
              for (let index = 0; index < data.results.length; index++) {
                const element = data.results[index];
                element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
              }
              this.getView().setModel(
                new JSONModel(data.results),
                "oModelForStorageLoc"
              );
            }.bind(this),
            error: function (sError) {}.bind(this),
          });
        },
        onSelectChangeStorageLoc: function (oEvent) {
          var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";
          var oModel = new sap.ui.model.odata.ODataModel(sService, true);
          var sPath = "/Es_F4_ValueSet";
          this.storageLocation = oEvent.getParameter("selectedItem").getKey();
          debugger;
          var aFilterBatch = [];
          var oFilterBatch = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "MCHB",
          });
          aFilterBatch.push(oFilterBatch);
          var oFilterStorageLocPlant = new sap.ui.model.Filter({
            path: "Domname1",
            operator: "EQ",
            value1: this.selectedPlant,
          });
          aFilterBatch.push(oFilterStorageLocPlant);

          var oFilterBatchStorageLoc = new sap.ui.model.Filter({
            path: "Domname2",
            operator: "EQ",
            value1: this.storageLocation,
          });
          aFilterBatch.push(oFilterBatchStorageLoc);

          var oFilterBatchMat = new sap.ui.model.Filter({
            path: "Domname3",
            operator: "EQ",
            value1: this.selectedMaterial,
          });
          aFilterBatch.push(oFilterBatchMat);
          oModel.read(sPath, {
            filters: aFilterBatch,
            success: function (data) {
              for (let index = 0; index < data.results.length; index++) {
                const element = data.results[index];
                element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
              }
              this.getView().setModel(
                new JSONModel(data.results),
                "oModelForBatch"
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

        onRouteMatched: function (oEvent) {
          var SONo = oEvent.getParameter("arguments").SONo;
          var title = "ZFAC-Factory Order WC - Sales order";
        },
        onAddNewItemPress: function () {
          this.itemNo = this.itemNo + 10;
          var JSONData = this.getView().getModel("oModelForItems").getData();
          JSONData.results.push({
            ItmNumber: this.itemNo.toString(),
            TargetQu: "",
            Material: "",
            Batch: "",
            Plant: "",
            StoreLoc: "",
            TargetQty: "",
          });
          this.getView()
            .getModel("oModelForItems")
            .setData(JSON.parse(JSON.stringify(JSONData)));
        },
        deleteRow: function (oEvent) {
          var table = this.getView().byId("SOTable");
          var selected = table.getSelectedItems();
          var msg;
          if (selected["length"] === 0) {
            msg = "Please select atleast one row";
            sap.m.MessageBox.show(msg, {
              icon: sap.m.MessageBox.Icon.ERROR,
              title: "Error",
            });
          } else {
            var length = selected.length;
            for (var i = 0; i < length; i++) {
              selected[i].destroy();
            }
            this.tableDateRefresh();
          }
        },
        tableDateRefresh: function (oEvent) {
          var table = this.getView().byId("SOTable");
          var rowCount = table.getItems().length;
          for (var i = 0; i < rowCount; i++) {
            var text = i + 1;
            text = text * 10;
            table.getItems()[i].getCells()[0].setProperty("text", text);
          }
        },
        onSubmit: function () {
          var oHeadPayload = this.getView()
            .getModel("oModelForHeader")
            .getData();
          var aItemPayload = this.getView()
            .getModel("oModelForItems")
            .getData();

          oHeadPayload.ET_SO_AUTO_CREATION_ORDER_ITEM = aItemPayload.results;
          var payload = oHeadPayload;

          const oDateFormat = DateFormat.getDateTimeInstance(
            {
              pattern: "yyyy-MM-dd'T'HH:mm:ss",
            },
            sap.ui.getCore().getConfiguration().getLocale()
          ); // You can also use a specific locale

          const myDate = new Date();
          payload.DocDate = oDateFormat.format(payload.DocDate);

          for (
            let index = 0;
            index < oHeadPayload.ET_SO_AUTO_CREATION_ORDER_ITEM.length;
            index++
          ) {
            const element = oHeadPayload.ET_SO_AUTO_CREATION_ORDER_ITEM[index];
            payload.ET_SO_AUTO_CREATION_SCHEDULESE.push({
              ItmNumber: element.ItmNumber,
              ReqDate: oDateFormat.format(myDate),
              ReqQty: element.TargetQty,
            });
          }

          var sPath = "/Es_So_Auto_Creation_Head";

          this.getView()
            .getModel()
            .create(sPath, payload, {
              success: function (oData, response) {}.bind(this),
              error: function (sError) {}.bind(this),
            });
        },
      }
    );
  }
);
