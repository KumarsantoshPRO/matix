sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/PDFViewer",
  ],
  (Controller, JSONModel, PDFViewer) => {
    "use strict";

    return Controller.extend(
      "matix.com.rep.invoiceprint.zinvoiceprint.controller.View1",
      {
        onInit() {
          this.getView().setModel(
            new JSONModel({
              FromVbeln: "",
              FromFkdat: "",
              ToVbeln: "",
              ToFkdat: "",
            }),
            "oModelForFilters"
          );
          this.opdfViewer = new PDFViewer();
          this.getView().addDependent(this.opdfViewer);
        },

        onSearch: function () {
          var aFilters = [];

          var fromDate = this.getView()
            .getModel("oModelForFilters")
            .getProperty("/FromFkdat");
          var toDate = this.getView()
            .getModel("oModelForFilters")
            .getProperty("/ToFkdat");
          var invFrom = this.getView()
            .getModel("oModelForFilters")
            .getProperty("/FromVbeln");
          var invTo = this.getView()
            .getModel("oModelForFilters")
            .getProperty("/ToVbeln");
          var temp = 1;

          if (!toDate) {
            toDate = fromDate;
          }

          if (!invTo) {
            invTo = invFrom;
          }
          if (!fromDate && !invFrom) {
            temp = 0;
            sap.m.MessageBox.error(
              "'Date' or 'Invoice No' filter is needed to get details"
            );
          }
          if (temp === 1) {
            if (invTo || invFrom) {
              aFilters.push(
                new sap.ui.model.Filter(
                  [
                    new sap.ui.model.Filter({
                      path: "Vbeln",
                      operator: "BT",
                      value1: invFrom,
                      value2: invTo,
                    }),
                  ],
                  false
                )
              );
            }
            if (toDate || fromDate) {
              aFilters.push(
                new sap.ui.model.Filter(
                  [
                    new sap.ui.model.Filter({
                      path: "Fkdat",
                      operator: "BT",
                      value1: fromDate,
                      value2: toDate,
                    }),
                  ],
                  false
                )
              );
            }

            var sPath = "/ET_SO_STO_invoiceSet";
            this.getView().setBusy(true);
            this.getOwnerComponent()
              .getModel()
              .read(sPath, {
                filters: aFilters,
                success: function (Data) {
                  if (Data.results.length < 1) {
                    sap.m.MessageBox.error("No entry found for above filters");
                    this.getView().setModel(
                      new JSONModel(Data.results),
                      "oModelForTable"
                    );
                  } else {
                    this.getView().setModel(
                      new JSONModel(Data.results),
                      "oModelForTable"
                    );
                  }
                  this.getView().setBusy(false);
                }.bind(this),
                error: function (sError) {
                  sap.m.MessageBox.error(
                    JSON.parse(sError.responseText).error.message.value
                  );
                  this.getView().setBusy(false);
                },
              });
          }
        },
        onFilterClear: function () {
          this.getView().setModel(
            new JSONModel({
              FromVbeln: "",
              FromFkdat: "",
              ToVbeln: "",
              ToFkdat: "",
            }),
            "oModelForFilters"
          );
          this.getView().setModel(new JSONModel(), "oModelForTable");
        },
        onInvoicePDPress: function (oEvent) {
          var invoiceNo = oEvent.getSource().getText();
          // {
          //   isTrustedSource: true,
          // }
          var opdfViewer = new PDFViewer();
          this.getView().addDependent(opdfViewer);
          var sServiceURL = this.getView().getModel().sServiceUrl;
          var sSource =
            sServiceURL + "/Es_PrintSet('" + invoiceNo + "')/$value";
          opdfViewer.setSource(sSource);
          opdfViewer.setTitle("My PDF");
          opdfViewer.open();
        },
      }
    );
  }
);
