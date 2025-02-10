sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "zpro/sk/matix/so/creation/zskmatixsocreation/model/models",
  ],
  (UIComponent, models) => {
    "use strict";

    return UIComponent.extend(
      "zpro.sk.matix.so.creation.zskmatixsocreation.Component",
      {
        metadata: {
          manifest: "json",
          interfaces: ["sap.ui.core.IAsyncContentCreation"],
        },

        init() {
          debugger;
          // call the base component's init function
          UIComponent.prototype.init.apply(this, arguments);

          // set the device model
          this.setModel(models.createDeviceModel(), "device");

          // enable routing
          this.getRouter().initialize();
        },
      }
    );
  }
);
