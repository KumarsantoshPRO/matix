sap.ui.define(
  ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
  (Controller, JSONModel) => {
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
      }
    );
  }
);
