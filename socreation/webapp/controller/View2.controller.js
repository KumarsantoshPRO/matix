sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "matix/com/sp/socreation/socreation/model/formatter",
    "sap/m/MessageBox",
  ],
  function (
    Controller,
    JSONModel,
    DateFormat,
    Filter,
    FilterOperator,
    formatter,
    MessageBox
  ) {
    "use strict";
    formatter: formatter;
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

          this.loadDataForSuggestions();
        },

        onRouteMatched: function (oEvent) {
          var SONo = oEvent.getParameter("arguments").SONo;
          if (SONo === "null") {
            if (!this.getOwnerComponent().getModel("oModelForHeader")) {
              this.getOwnerComponent().getRouter().navTo("RouteView");
            }
          }
          var title = "ZFAC-Factory Order WC - Sales order";
          var oDatePicker = this.getView().byId("docTypeDatePickerId"); // Replace "yourDatePickerId"
          var oMinDate = new Date(); // Set your desired minimum date here
          oDatePicker.setMinDate(oMinDate);
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
          this.getView().setBusy(true);
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
              this.getView().setBusy(false);
            }.bind(this),
            error: function (sError) {
              MessageBox.error(sError.message);
              this.getView().setBusy(false);
            }.bind(this),
          });
          var oFilterPT = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "T052U",
          });
          this.getView().setBusy(true);
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
              this.getView().setBusy(false);
            }.bind(this),
            error: function (sError) {
              MessageBox.error(sError.message);
              this.getView().setBusy(false);
            }.bind(this),
          });

          var oFilterIT = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "INCO1",
          });
          this.getView().setBusy(true);
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
              this.getView().setBusy(false);
            }.bind(this),
            error: function (sError) {
              MessageBox.error(sError.message);
              this.getView().setBusy(false);
            }.bind(this),
          });

          var oFilterMaterial = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "MATERIAL",
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
              MessageBox.error(sError.message);
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
              MessageBox.error(sError.message);
              this.getView().setBusy(false);
            }.bind(this),
          });
          this.getView().setModel(new JSONModel(), "oModelForStorageLoc");
          this.getView().setModel(new JSONModel(), "oModelForBatch");
        },
        onTargetQtyInputLiveChange: function (oEvent) {
          var enteredQuntity = oEvent.getParameter("value");
          if (Number(enteredQuntity) % 9 === 0) {
            oEvent.getSource().setValueState("Success");
          } else {
            oEvent.getSource().setValue("");
            oEvent.getSource().setValueState("Error");
            oEvent
              .getSource()
              .setValueStateText("Entering quantity must be multiple of 9");
          }
        },
        onResetButtonPress: function () {
          this.oRouter = this.getOwnerComponent().getRouter();
          this.oRouter.navTo("RouteView");
        },
        onSelectChangeMaterial: function (oEvent) {
          this.selectedMaterial = oEvent.getParameter("selectedItem").getKey();
          var sPath = oEvent.getSource().getParent().getBindingContextPath();
          var Material = this.selectedMaterial;

          var oModelData = this.getView()
            .getModel("oModelForMaterial")
            .getData();

          for (let index = 0; index < oModelData.length; index++) {
            const element = oModelData[index];
            if (Material === element.DomvalueL) {
              var description = element.Ddtext;
              var unit = element.Domname3;
            }
          }
          oEvent
            .getSource()
            .getParent()
            .getAggregation("cells")[1]
            .setValue(description);
          sPath = sPath + "/TargetQu";
          this.getOwnerComponent()
            .getModel("oModelForItems")
            .setProperty(sPath, unit);
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

          aFilterStorageLoc.push(oFilterStorageLocPlant);
          this.oPlantSelect = oEvent
            .getSource()
            .getParent()
            .getAggregation("cells")[5];
          this.getView().setBusy(true);
          oModel.read(sPath, {
            filters: aFilterStorageLoc,
            success: function (data) {
              for (let index = 0; index < data.results.length; index++) {
                const element = data.results[index];
                element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
              }

              this.oPlantSelect.setModel(
                new JSONModel(data.results),
                "oModelForStorageLoc"
              );
              this.getView().setBusy(false);
            }.bind(this),
            error: function (sError) {
              MessageBox.error(sError.message);
              this.getView().setBusy(false);
            }.bind(this),
          });
        },
        onSelectChangeStorageLoc: function (oEvent) {
          var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";
          var oModel = new sap.ui.model.odata.ODataModel(sService, true);
          var sPath = "/Es_F4_ValueSet";
          this.storageLocation = oEvent.getParameter("selectedItem").getKey();

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
          this.obatchSelect = oEvent
            .getSource()
            .getParent()
            .getAggregation("cells")[7];
          this.getView().setBusy(true);
          oModel.read(sPath, {
            filters: aFilterBatch,
            success: function (data) {
              for (let index = 0; index < data.results.length; index++) {
                const element = data.results[index];
                element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
              }
              this.obatchSelect.setModel(
                new JSONModel(data.results),
                "oModelForBatch"
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

        onAddNewItemPress: function () {
          this.itemNo = this.itemNo + 10;
          var JSONData = this.getOwnerComponent()
            .getModel("oModelForItems")
            .getData();
          JSONData.results.push({
            ItmNumber: this.itemNo.toString(),
            TargetQu: "",
            Material: "",
            Batch: "",
            Plant: "",
            StoreLoc: "",
            TargetQty: "",
          });
          this.getOwnerComponent()
            .getModel("oModelForItems")
            .setData(JSON.parse(JSON.stringify(JSONData)));
        },
        deleteRow: function (oEvent) {
          var table = this.getView().byId("SOTable");
          var selected = table.getSelectedItems();
          var msg;
          if (selected["length"] === 0) {
            msg = "Please select atleast one row";
            MessageBox.show(msg, {
              icon: MessageBox.Icon.ERROR,
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
        tableDateRefresh: function () {
          var table = this.getView().byId("SOTable");
          var rowCount = table.getItems().length;
          for (var i = 0; i < rowCount; i++) {
            var text = i + 1;
            text = text * 10;
            table.getItems()[i].getCells()[0].setProperty("text", text);
          }
        },

        onUpdateContractValue: function () {
          const oDateFormat = DateFormat.getDateTimeInstance(
            {
              pattern: "yyyy-MM-dd'T'HH:mm:ss",
            },
            sap.ui.getCore().getConfiguration().getLocale()
          ); // You can also use a specific locale
          var sPath = "/Es_Contract_Value";
          var aFilters = [];
          aFilters.push(
            new Filter(
              "SoldToParty",
              FilterOperator.EQ,
              this.getOwnerComponent()
                .getModel("oModelForHeader")
                .getProperty("/ET_SO_AUTO_CREATION_PARTNERSET/0/PartnNumb")
                .split("-")[0]
            )
          );
          aFilters.push(
            new Filter(
              "CreationDate",
              FilterOperator.EQ,
              oDateFormat.format(
                this.getOwnerComponent()
                  .getModel("oModelForHeader")
                  .getProperty("/DocDate")
              )
            )
          );
          var aPayload = this.getOwnerComponent()
            .getModel("oModelForItems")
            .getData().results;
          var oModel = this.getView().getModel();
          var that = this;
          var promise = Promise.resolve();
          aPayload.forEach(function (Payload, i) {
            //copy local variables
            //Chain the promises
            promise = promise.then(function () {
              aFilters.push(
                new Filter("Material", FilterOperator.EQ, Payload.Material)
              );
              return that._promiseReadCallForEachContract(
                oModel,
                sPath,
                aFilters,
                i
              );
            });
          });
          promise.then(function () {}).catch(function () {});
        },

        _promiseReadCallForEachContract: function (
          oModel,
          sPath,
          aFilters,
          index
        ) {
          var that = this;
          this.getView().setBusy(true);
          oModel.read(sPath, {
            filters: aFilters,
            success: function (data) {
              var path = "/" + index + "/Ref1";
              this.getOwnerComponent()
                .getModel("oModelForItems")
                .setProperty(path);
              this.getView().setBusy(false);
            }.bind(this),
            error: function (sError) {
              MessageBox.error(sError.message);
              this.getView().setBusy(false);
            }.bind(this),
          });
        },

        onSubmit: function () {
          var oHeadPayload = this.getOwnerComponent()
            .getModel("oModelForHeader")
            .getData();
          var aItemPayload = this.getOwnerComponent()
            .getModel("oModelForItems")
            .getData();

          oHeadPayload.ET_SO_AUTO_CREATION_ORDER_ITEM = aItemPayload.results;

          oHeadPayload.SalesOrg = oHeadPayload.SalesOrg.split("-")[0];
          oHeadPayload.DocType = oHeadPayload.DocType.split("-")[0];
          oHeadPayload.DistrChan = oHeadPayload.DistrChan.split("-")[0];
          oHeadPayload.Division = oHeadPayload.Division.split("-")[0];
          oHeadPayload.Pmnttrms = oHeadPayload.Pmnttrms.split("-")[0];
          oHeadPayload.Incoterms1 = oHeadPayload.Incoterms1.split("-")[0];
          const myDate = new Date();
          const oDateFormat = DateFormat.getDateTimeInstance(
            {
              pattern: "yyyy-MM-dd'T'HH:mm:ss",
            },
            sap.ui.getCore().getConfiguration().getLocale()
          ); // You can also use a specific locale

          if (oHeadPayload.DocDate) {
            oHeadPayload.DocDate = oDateFormat.format(oHeadPayload.DocDate);
          } else {
            oHeadPayload.DocDate = oDateFormat.format(myDate);
          }
          oHeadPayload.Lrdat = oDateFormat.format(myDate);
          oHeadPayload.PriceDate = oDateFormat.format(myDate);
          oHeadPayload.ReqDateH = oDateFormat.format(myDate);
          oHeadPayload.ET_SO_AUTO_CREATION_PARTNERSET[0].PartnNumb =
            oHeadPayload.ET_SO_AUTO_CREATION_PARTNERSET[0].PartnNumb.split(
              "-"
            )[0];
          oHeadPayload.ET_SO_AUTO_CREATION_PARTNERSET[1].PartnNumb =
            oHeadPayload.ET_SO_AUTO_CREATION_PARTNERSET[1].PartnNumb.split(
              "-"
            )[0];

          var payload = oHeadPayload;

          for (
            let index = 0;
            index < oHeadPayload.ET_SO_AUTO_CREATION_ORDER_ITEM.length;
            index++
          ) {
            const element = oHeadPayload.ET_SO_AUTO_CREATION_ORDER_ITEM[index];
            element.MatlGroup = this.getOwnerComponent()
              .getModel("oModelTemp")
              .getProperty("/MatlGroup");
            payload.ET_SO_AUTO_CREATION_SCHEDULESE.push({
              ItmNumber: element.ItmNumber,
              ReqDate: oDateFormat.format(myDate),
              ReqQty: element.TargetQty,
            });
          }

          var sPath = "/Es_So_Auto_Creation_Head";
          this.getView().setBusy(true);
          this.getView()
            .getModel()
            .create(sPath, payload, {
              success: function (oData, response) {
                var message = JSON.parse(
                  response.headers["sap-message"]
                ).message;
                // MessageBox.success(message);
                var that = this;
                MessageBox.success(message, {
                  actions: ["OK", MessageBox.Action.CLOSE],
                  emphasizedAction: "OK",
                  onClose: function (sAction) {
                    that.getOwnerComponent().getRouter().navTo("RouteView");
                  },
                  dependentOn: this.getView(),
                });
                this.getView().setBusy(false);
              }.bind(this),
              error: function (sError) {
                MessageBox.error(sError.message);
                this.getView().setBusy(false);
              }.bind(this),
            });
        },
      }
    );
  }
);
