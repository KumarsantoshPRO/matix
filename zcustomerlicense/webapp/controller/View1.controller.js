sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
  ],
  (Controller, JSONModel, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend(
      "matix.com.rep.customerlicense.zcustomerlicense.controller.View1",
      {
        onInit() {
          this.getView().setModel(
            new JSONModel({
              FromDate: "",
              FromCustmer: "",
              FromRegion: "",
              ToDate: "",
              ToCustmer: "",
              ToRegion: "",
            }),
            "oModelForFilters"
          );
        },
        onFilterClear: function () {
          this.getView().getModel("oModelForFilters").setData({});
        },
        // CUSTOMER REGION DATE
        onSearch: function () {
          var aFilters = [];

          var fromDate = this.getView()
            .getModel("oModelForFilters")
            .getProperty("/FromDate");
          var toDate = this.getView()
            .getModel("oModelForFilters")
            .getProperty("/ToDate");
          var custFrom = this.getView()
            .getModel("oModelForFilters")
            .getProperty("/FromCustmer");
          var custTo = this.getView()
            .getModel("oModelForFilters")
            .getProperty("/ToCustmer");
          var regionFrom = this.getView()
            .getModel("oModelForFilters")
            .getProperty("/FromRegion");
          var regionTo = this.getView()
            .getModel("oModelForFilters")
            .getProperty("/ToRegion");
          var aFilters = [];

          !fromDate
            ? (fromDate = toDate)
            : aFilters.push(
                new Filter(
                  [
                    new Filter({
                      path: "DATE_FROM",
                      operator: "EQ",
                      value2: fromDate,
                    }),
                  ],
                  false
                )
              );

          !toDate
            ? (toDate = fromDate)
            : aFilters.push(
                new Filter(
                  [
                    new Filter({
                      path: "DATE_TO",
                      operator: "EQ",
                      value2: toDate,
                    }),
                  ],
                  false
                )
              );

          !custFrom
            ? (custFrom = custTo)
            : aFilters.push(
                new Filter(
                  [
                    new Filter({
                      path: "CUSTOMER_FROM",
                      operator: "EQ",
                      value2: custFrom,
                    }),
                  ],
                  false
                )
              );

          !custTo
            ? (custTo = custFrom)
            : aFilters.push(
                new Filter(
                  [
                    new Filter({
                      path: "CUSTOMER_TO",
                      operator: "EQ",
                      value2: custTo,
                    }),
                  ],
                  false
                )
              );

          !regionFrom
            ? (regionFrom = regionTo)
            : aFilters.push(
                new Filter(
                  [
                    new Filter({
                      path: "REGION_FROM",
                      operator: "EQ",
                      value2: regionFrom,
                    }),
                  ],
                  false
                )
              );
          !regionTo
            ? (regionTo = regionFrom)
            : aFilters.push(
                new Filter(
                  [
                    new Filter({
                      path: "REGION_TO",
                      operator: "EQ",
                      value2: regionTo,
                    }),
                  ],
                  false
                )
              );
          debugger;
          if (!fromDate && !custFrom && !regionFrom) {
            sap.m.MessageBox.error("Any 1 filter is needed to get details");
          } else {
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
                }.bind(this),
              });
          }
        },
      }
    );
  }
);
