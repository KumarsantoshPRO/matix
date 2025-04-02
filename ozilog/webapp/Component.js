sap.ui.define(
  ["sap/ui/core/UIComponent", "matix/com/log/ozilog/ozilog/model/models"],
  (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("matix.com.log.ozilog.ozilog.Component", {
      metadata: {
        manifest: "json",
        interfaces: ["sap.ui.core.IAsyncContentCreation"],
      },

      init() {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        // set the device model
        this.setModel(models.createDeviceModel(), "device");

        // enable routing
        this.getRouter().initialize();

        var jQueryScriptZip = document.createElement("script");
        jQueryScriptZip.setAttribute(
          "src",
          "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.10.0/jszip.js"
        );
        document.head.appendChild(jQueryScriptZip);

        var jQueryScript = document.createElement("script");
        jQueryScript.setAttribute(
          "src",
          "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.10.0/xlsx.js"
        );
        document.head.appendChild(jQueryScript);
      },
    });
  }
);
