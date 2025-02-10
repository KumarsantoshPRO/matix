sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/vk/Material",
    "sap/ui/model/json/JSONModel",
  ],
  (Controller, Material, JSONModel) => {
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
        },
        onRouteMatched: function(oEvent){

        },

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
