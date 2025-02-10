sap.ui.define(["sap/ui/core/mvc/Controller"], (Controller) => {
  "use strict";

  return Controller.extend(
    "zpro.sk.matix.so.creation.zskmatixsocreation.controller.View1",
    {
      onInit() {
        sap.ui.core.UIComponent.getRouterFor(this)
        this.getOwnerComponent()
          .getRouter()
          .attachRoutePatternMatched(this.onRouteMatched, this);
      },

      onNextButtonPress: function () {
        this.oRouter = this.getOwnerComponent().getRouter();
        this.oRouter.navTo("View2", {
          SONo: "null",
        });
      },
    }
  );
});
