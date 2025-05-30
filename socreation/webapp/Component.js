sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "matix/com/sp/socreation/socreation/model/models",
    "sap/ui/model/json/JSONModel",
  ],
  (UIComponent, models, JSONModel) => {
    "use strict";

    return UIComponent.extend("matix.com.sp.socreation.socreation.Component", {
      metadata: {
        manifest: "json",
        interfaces: ["sap.ui.core.IAsyncContentCreation"],
      },

      init() {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        this.setModel(new sap.ui.model.json.JSONModel({ 
          showBatch: false,
          autoInvoice: true,
          submitBtnText: "Submit",
          submitEnable: true
        }), "oAppState");
        // set the device model
        this.setModel(models.createDeviceModel(), "device");

        // enable routing
        this.getRouter().initialize();

      }
    });
  }
);
