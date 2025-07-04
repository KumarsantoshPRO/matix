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

          //Global variable to format the date
          this.oDateFormat = DateFormat.getDateTimeInstance(
            {
              pattern: "yyyy-MM-dd'T'HH:mm:ss",
            },
            sap.ui.getCore().getConfiguration().getLocale()
          );
        },

        onRouteMatched: function (oEvent) {
          var SONo = oEvent.getParameter("arguments").SONo;
          if (SONo === "null") {
            if (!this.getOwnerComponent().getModel("oModelForHeader")) {
              this.getOwnerComponent().getRouter().navTo("RouteView");
            } else {
              this.loadDataForSuggestions();
            }
          }
          var title = "ZFAC-Factory Order WC - Sales order";
          var oDatePicker = this.getView().byId("docTypeDatePickerId"); // Replace "yourDatePickerId"
          var oDate = new Date(); // Set your desired minimum date here
          oDatePicker.setMaxDate(oDate);
        },

        loadDataForSuggestions: function () {
          var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";
          var oModel = new sap.ui.model.odata.ODataModel(sService, true);
          var sPath = "/Es_F4_ValueSet";
          // Sold to Party
          var oFilterSP = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "SOLD",
          });
          var oFilterSO = new sap.ui.model.Filter({
            path: "Domname1",
            operator: "EQ",
            value1: this.getOwnerComponent()
              .getModel("oModelForHeader")
              .getProperty("/SalesOrg"),
          });
          var oFilterDistChan = new sap.ui.model.Filter({
            path: "Domname2",
            operator: "EQ",
            value1: this.getOwnerComponent()
              .getModel("oModelForHeader")
              .getProperty("/DistrChan"),
          });

          var oFilterDivision = new sap.ui.model.Filter({
            path: "Domname3",
            operator: "EQ",
            value1: this.getOwnerComponent()
              .getModel("oModelForHeader")
              .getProperty("/Division"),
          });
          this.getView().setBusy(true);
          oModel.read(sPath, {
            filters: [oFilterSP, oFilterSO, oFilterDistChan, oFilterDivision],
            success: function (data) {
              for (let index = 0; index < data.results.length; index++) {
                const element = data.results[index];
                element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
              }
              this.getView().setModel(
                new JSONModel(data.results),
                "oModelForSoldTopart"
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
          // Payment Term
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
              MessageBox.error(
                JSON.parse(sError.responseText).error.message.value
              );
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
              MessageBox.error(
                JSON.parse(sError.responseText).error.message.value
              );
              this.getView().setBusy(false);
            }.bind(this),
          });

          var oFilterMaterial = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "MATERIAL",
          });
          var oFilterMaterialGrp = new sap.ui.model.Filter({
            path: "Domname1",
            operator: "EQ",
            value1: this.getOwnerComponent()
              .getModel("oModelTemp")
              .getProperty("/MatlGroup"),
          });

          this.getView().setBusy(true);
          oModel.read(sPath, {
            filters: [oFilterMaterial, oFilterMaterialGrp],
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


          this.getView().setModel(new JSONModel(), "oModelForBatch");
        },
        getShipToPartySuggestion: function () {
          var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";
          var oModel = new sap.ui.model.odata.ODataModel(sService, true);
          var sPath = "/Es_F4_ValueSet";
          // Sold to Party
          var oFilterSP = new sap.ui.model.Filter({
            path: "Domname",
            operator: "EQ",
            value1: "SHIP",
          });
          var oFilterSO = new sap.ui.model.Filter({
            path: "Domname1",
            operator: "EQ",
            value1: this.getOwnerComponent()
              .getModel("oModelForHeader")
              .getProperty("/SalesOrg"),
          });
          var oFilterDistChan = new sap.ui.model.Filter({
            path: "Domname2",
            operator: "EQ",
            value1: this.getOwnerComponent()
              .getModel("oModelForHeader")
              .getProperty("/DistrChan"),
          });

          var oFilterDivision = new sap.ui.model.Filter({
            path: "Domname3",
            operator: "EQ",
            value1: this.getOwnerComponent()
              .getModel("oModelForHeader")
              .getProperty("/Division"),
          });
          var oFilterSold = new sap.ui.model.Filter({
            path: "Domname4",
            operator: "EQ",
            value1: this.getOwnerComponent()
              .getModel("oModelForHeader")
              .getProperty("/ET_SO_AUTO_CREATION_PARTNERSET/0/PartnNumb"),
          });

          this.getView().setBusy(true);
          oModel.read(sPath, {
            filters: [
              oFilterSP,
              oFilterSO,
              oFilterDistChan,
              oFilterDivision,
              oFilterSold,
            ],
            success: function (data) {
              for (let index = 0; index < data.results.length; index++) {
                const element = data.results[index];
                element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
              }
              // this.getView().setModel(
              //   new JSONModel(data.results),
              //   "oModelForSoldTopart"
              // );
              this.getView().setModel(
                new JSONModel(data.results),
                "oModelForShipToParty"
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
        onTargetQtyInputLiveChange: function (oEvent) {
          debugger;
          var division = this.getOwnerComponent()
            .getModel("oModelForHeader")
            .getProperty("/Division");
          var docType = this.getOwnerComponent()
            .getModel("oModelForHeader")
            .getProperty("/DocType");

          var matGroup = this.getOwnerComponent()
            .getModel("oModelTemp")
            .getProperty("/MatlGroup");

          if (docType === "ZRAO" && division === "UR" && matGroup === "90") {
            var enteredQuntity = Number(oEvent.getParameter("value"));

            // const scaleFactor = 100; // Since there are at most two decimal places
            // const intNum1 = Number(enteredQuntity) * scaleFactor;
            // const intNum2 = 0.045 * scaleFactor;

            var checkValue = enteredQuntity / 0.045;
            var isInteger = Number.isInteger(parseFloat(checkValue.toFixed(4)));

            if (isInteger) {
              oEvent.getSource().setValueState("Success");
            } else {
              oEvent.getSource().setValue("");
              oEvent.getSource().setValueState("Error");
              sap.m.MessageToast.show(
                "Entering quantity must be multiple of 0.045"
              );
              oEvent
                .getSource()
                .setValueStateText(
                  "Entering quantity must be multiple of 0.045"
                );
            }
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

          var rowContextPath = oEvent.getSource().getParent().getBindingContextPath();
          var sPathForBatchNo = rowContextPath + "/Batch";
          this.getOwnerComponent().getModel("oModelForItems").setProperty(sPathForBatchNo, "");

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
          this.getBatches(oEvent);
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

          var rowContextPath = oEvent.getSource().getParent().getBindingContextPath();
          var sPathForStorageLocation = rowContextPath + "/StoreLoc";
          var sPathForBatchNo = rowContextPath + "/Batch";
          this.getOwnerComponent().getModel("oModelForItems").setProperty(sPathForStorageLocation, "");
          this.getOwnerComponent().getModel("oModelForItems").setProperty(sPathForBatchNo, "");
          this.sPathPlantSlected = rowContextPath
          // var oStorageLocation = oEvent
          //   .getSource()
          //   .getParent()
          //   .getAggregation("cells")[5];
          this.getView().setBusy(true);
          oModel.read(sPath, {
            filters: aFilterStorageLoc,
            success: function (data) {
              for (let index = 0; index < data.results.length; index++) {
                const element = data.results[index];
                element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
              }

              var sPathStorageLocation = this.sPathPlantSlected + "/locationList"
              this.getOwnerComponent().getModel("oModelForItems").setProperty(sPathStorageLocation, data.results)

              // oStorageLocation.setModel(
              //   new JSONModel(data.results),
              //   "oModelForStorageLoc"
              // );

              this.getView().setBusy(false);
            }.bind(this),
            error: function (sError) {
              MessageBox.error(
                JSON.parse(sError.responseText).error.message.value
              );
              this.getView().setBusy(false);
            }.bind(this),
          });

          var oPlantSelect = oEvent.getSource();
          var sPlant = oPlantSelect.getSelectedKey();
          var oRow = oPlantSelect.getParent();
          var oBatchSelect = oRow.getAggregation("cells")[7];
          if (sPlant === "1000") {
            oBatchSelect.setEnabled(false);
            // this.aBatchSelected.push(false);
            this.getOwnerComponent().getModel("oModelForHeader").setProperty("/Flag", "");
            // this.getView().getModel("oAppState").setProperty("/autoInvoice", false);
            // this.getView().getModel("oAppState").setProperty("/submitBtnText", "Create SO");
            // this.getView().getModel("oAppState").setProperty("/submitEnable", true);
          } else {
            oBatchSelect.setEnabled(true);
            // this.aBatchSelected.push(true);
            var sTemp = false;
            var tableItem = this.getOwnerComponent().getModel("oModelForItems").getData().results;
            for (let index = 0; index < tableItem.length; index++) {
              const element = tableItem[index];
              element.Plant === "1000" ? sTemp = true : "";
            }
            if (sTemp) {
              this.getOwnerComponent().getModel("oModelForHeader").setProperty("/Flag", "");
              // this.getView().getModel("oAppState").setProperty("/autoInvoice", false);
              // this.getView().getModel("oAppState").setProperty("/submitBtnText", "Create SO");
              // this.getView().getModel("oAppState").setProperty("/submitEnable", true);
            } else {
              this.getOwnerComponent().getModel("oModelForHeader").setProperty("/Flag", "X");
              // this.getView().getModel("oAppState").setProperty("/autoInvoice", true);
              // this.getView().getModel("oAppState").setProperty("/submitBtnText", "Submit");
              // this.getView().getModel("oAppState").setProperty("/submitEnable", false);
            }
          }
        },
        onSelectChangeStorageLoc: function (oEvent) {

          this.storageLocation = oEvent.getParameter("selectedItem").getKey();
          this.getBatches(oEvent);

        },

        getBatches: function (oEvent) {

          this.getView().getModel("oModelForBatch").setData({});
          var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";
          var oModel = new sap.ui.model.odata.ODataModel(sService, true);
          var sPath = "/Es_F4_ValueSet";
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
          var rowContextPath = oEvent.getSource().getParent().getBindingContextPath();
          var sPathForBatchNo = rowContextPath + "/Batch";
          this.getOwnerComponent().getModel("oModelForItems").setProperty(sPathForBatchNo, "");
          var oBatchNo = oEvent
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
              oBatchNo.setModel(
                new JSONModel(data.results),
                "oModelForBatch"
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

        onAddNewItemPress: function () {
          var JSONData = this.getOwnerComponent()
            .getModel("oModelForItems")
            .getData();
          var itemNo =
            Number(JSONData.results[JSONData.results.length - 1].ItmNumber) +
            10;

          JSONData.results.push({
            ItmNumber: itemNo.toString(),
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
              this.oDateFormat.format(
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
          promise.then(function () { }).catch(function () { });
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
              MessageBox.error(
                JSON.parse(sError.responseText).error.message.value
              );
              this.getView().setBusy(false);
            }.bind(this),
          });
        },

        getEnteredPayload: function () {
          var oHeadPayload = this.getOwnerComponent()
            .getModel("oModelForHeader")
            .getData();
          var aItemPayload = this.getOwnerComponent()
            .getModel("oModelForItems")
            .getData();

          oHeadPayload.ET_SO_AUTO_CREATION_ORDER_ITEM = aItemPayload.results;

          const myDate = new Date();

          // if (oHeadPayload.DocDate) {
          //   oHeadPayload.DocDate = this.oDateFormat.format(oHeadPayload.DocDate);
          // } else {
          //   oHeadPayload.DocDate = this.oDateFormat.format(myDate);
          // }
          oHeadPayload.Lrdat = this.oDateFormat.format(myDate);
          oHeadPayload.PriceDate = this.oDateFormat.format(myDate);
          oHeadPayload.ReqDateH = this.oDateFormat.format(myDate);

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
              ReqDate: this.oDateFormat.format(myDate),
              ReqQty: element.TargetQty,
            });
          }
          return payload;
        },
        onAutoInvSo: function () {
          var payload = this.getEnteredPayload();
          // Formatting docDate
          if (payload.DocDate) {
            payload.DocDate = this.oDateFormat.format(payload.DocDate);
          } else {
            // If docDate not selected passing today's date
            payload.DocDate = this.oDateFormat.format(new Date());
          }

          for (let index = 0; index < payload.ET_SO_AUTO_CREATION_ORDER_ITEM.length; index++) {
            const element = payload.ET_SO_AUTO_CREATION_ORDER_ITEM[index];
            delete element.locationList;
            var lineNo = index + 1;

            if (element.Plant && element.Plant !== "1000") {
              if (!element.Batch) {
                MessageBox.error("Batch No is not entered in the line number : " + lineNo);
                return
              }
            }
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

                MessageBox.information(message, {
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
                var that = this;

                MessageBox.error(
                  JSON.parse(sError.responseText).error.message.value,
                  {
                    onClose: function (sAction) {
                      that.getOwnerComponent().getRouter().navTo("RouteView");
                    },
                    dependentOn: this.getView(),
                  }
                );
                this.getView().setBusy(false);
              }.bind(this),
            });
        },

        onSubmit: function () {
          var payload = this.getEnteredPayload();
          payload.Flag = "";
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

                MessageBox.information(message, {
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
                var that = this;

                MessageBox.error(
                  JSON.parse(sError.responseText).error.message.value,
                  {
                    onClose: function (sAction) {
                      that.getOwnerComponent().getRouter().navTo("RouteView");
                    },
                    dependentOn: this.getView(),
                  }
                );
                this.getView().setBusy(false);
              }.bind(this),
            });
        },

        onConditionButtonPress: function () {

          var payload = {
            DocType: "",
            SalesOrg: "",
            DistrChan: "",
            Division: "",
            ReqDateH: "",
            Ref1: "",
            Pmnttrms: "",
            Incoterms1: "",
            Incoterms2: "",
            PriceDate: "",
            PurchNoC: "",
            DocDate: "",
            Lrdat: "",
            Lrno: "",
            Vhlnr: "",
            ZtruckCap: "",
            Tdlnr: "",
            Et_Condition_item: [
              {
                ItmNumber: "",
                Material: "",
                Batch: "",
                Plant: "",
                StoreLoc: "",
                TargetQty: "",
                TargetQu: "",
                MatlGroup: ""
              }
            ],
            Et_Condition_partner: [
              {
                PartnRole: "",
                PartnNumb: ""
              },
              {
                PartnRole: "",
                PartnNumb: ""
              }
            ],
            Et_Condition_final: [
              {
                ItmNumber: "",
                CondStNo: "",
                CondCount: "",
                CondType: "",
                CondText: "",
                CondValue: null,
                Currency: "",
                CondUnit: ""

              }

            ]
          };
          var comparingPayload = this.getEnteredPayload();

          payload.DistrChan = comparingPayload.DistrChan;
          payload.Division = comparingPayload.Division;
          payload.DocDate = comparingPayload.DocDate;
          payload.DocType = comparingPayload.DocType;
          payload.Incoterms1 = comparingPayload.Incoterms1;
          payload.Incoterms2 = comparingPayload.Incoterms2;
          payload.Lrdat = comparingPayload.Lrdat;
          payload.Lrno = comparingPayload.Lrno;
          payload.Pmnttrms = comparingPayload.Pmnttrms;
          payload.PriceDate = comparingPayload.PriceDate;
          payload.PurchNoC = comparingPayload.PurchNoC;
          payload.Ref1 = comparingPayload.Ref1;
          payload.ReqDateH = comparingPayload.ReqDateH;
          payload.SalesOrg = comparingPayload.SalesOrg;
          payload.Tdlnr = comparingPayload.Tdlnr;
          payload.Vhlnr = comparingPayload.Vhlnr;
          payload.ZtruckCap = comparingPayload.ZtruckCap;

          payload.Et_Condition_partner = comparingPayload.ET_SO_AUTO_CREATION_PARTNERSET;
          payload.Et_Condition_item = comparingPayload.ET_SO_AUTO_CREATION_ORDER_ITEM;

          var sPath = "/Et_condition_creation_headSet";
          this.getView().setBusy(true);
          this.getView()
            .getModel()
            .create(sPath, payload, {
              success: function (oData, response) {
                this.getView().setModel(new JSONModel(oData.Et_Condition_final.results), "oModelForCondition")
                // create dialog lazily
                if (!this.oMPDialog) {
                  this.oMPDialog = this.loadFragment({
                    name: "matix.com.sp.socreation.socreation.view.fragments.condition"
                  });
                }
                this.oMPDialog.then(function (oDialog) {
                  // console.log("Fragment loaded")
                  this.oDialog = oDialog;
                  this.oDialog.setModel("oModelForCondition");
                  this.oDialog.open();
                }.bind(this));

                this.getView().setBusy(false);
              }.bind(this),
              error: function (sError) {
                var that = this;

                MessageBox.error(
                  JSON.parse(sError.responseText).error.message.value,
                  {
                    onClose: function (sAction) {
                      that.getOwnerComponent().getRouter().navTo("RouteView");
                    },
                    dependentOn: this.getView(),
                  }
                );
                this.getView().setBusy(false);
              }.bind(this),
            });
        },
        _closeDialog: function () {
          this.oDialog.close();
        },
        onPmnttrmsInputSuggestionItemSelected: function (oEvent) {
          var sValue = oEvent.getParameter("selectedItem").getProperty("text");
          this.getOwnerComponent()
            .getModel("oModelForHeader")
            .setProperty("/Pmnttrms", sValue.split("-")[0]);
          var oInput = oEvent.getSource();
          oInput.setValueState("None");
          oInput.setValueStateText("");

          if (sValue.split("-")[1] !== "") {
            this.getOwnerComponent()
              .getModel("oModelTemp")
              .setProperty("/PmnttrmsDescrp", "-" + sValue.split("-")[1]);
          }
        },
        onPartnNumbInputSuggestionItemSelected: function (oEvent) {
          var sValue = oEvent.getParameter("selectedItem").getProperty("text");
          this.getOwnerComponent()
            .getModel("oModelForHeader")
            .setProperty(
              "/ET_SO_AUTO_CREATION_PARTNERSET/0/PartnNumb",
              sValue.split("-")[0]
            );
          var oInput = oEvent.getSource();
          oInput.setValueState("None");
          oInput.setValueStateText("");

          if (sValue.split("-")[1] !== "") {
            this.getOwnerComponent()
              .getModel("oModelTemp")
              .setProperty("/PartnNumbDescrp", "-" + sValue.split("-")[1]);
          }
          this.getShipToPartySuggestion();
        },
        onPartnNumbInputSuggestionItemSelected2: function (oEvent) {
          var sValue = oEvent.getParameter("selectedItem").getProperty("text");
          this.getOwnerComponent()
            .getModel("oModelForHeader")
            .setProperty(
              "/ET_SO_AUTO_CREATION_PARTNERSET/1/PartnNumb",
              sValue.split("-")[0]
            );
          var oInput = oEvent.getSource();
          oInput.setValueState("None");
          oInput.setValueStateText("");
          if (sValue.split("-")[1] !== "") {
            this.getOwnerComponent()
              .getModel("oModelTemp")
              .setProperty("/PartnNumbDescrp2", "-" + sValue.split("-")[1]);
          }
        },
        onIncotermsInputSuggestionItemSelected: function (oEvent) {
          var sValue = oEvent.getParameter("selectedItem").getProperty("text");
          this.getOwnerComponent()
            .getModel("oModelForHeader")
            .setProperty("/Incoterms1", sValue.split("-")[0]);
          var oInput = oEvent.getSource();
          oInput.setValueState("None");
          oInput.setValueStateText("");

          if (sValue.split("-")[1] !== "") {
            this.getOwnerComponent()
              .getModel("oModelTemp")
              .setProperty("/Incoterms1Descrp", "-" + sValue.split("-")[1]);
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
        onInputChangeSold: function (oEvent) {
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
            this.getShipToPartySuggestion();
            oInput.setValueState("None");
            oInput.setValueStateText("");
          }
        },
      }
    );
  }
);
