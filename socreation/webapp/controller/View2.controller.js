sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel"], function (Controller, JSONModel) {
  "use strict";

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

        this.getView().setModel(new JSONModel(tableForData), "oModelForTable");
      },
      onAddNewItemPress: function () {
        var JSONData = this.getView().getModel("oModelForTable").getData();
        JSONData.results.push({
          Material: "4400000000-Neam Coated Urea",
          MaterialDescription: "",
          Quantity: "",
          Unit: "TON",
          Plant: "1000-PANAGARH IN",
          StorageLocation: "1021 Bagged Urea",
          Contract: "",
          BatchNo: "",
        });
        this.getView()
          .getModel("oModelForTable")
          .setData(JSON.parse(JSON.stringify(JSONData)));
      },
      deleteRow: function (oEvent) {
        var table = this.getView().byId("SOTable");
        var selected = table.getSelectedItems();
        var msg;
        if (selected["length"] === 0) {
          msg = "Please select atleast one row";
          sap.m.MessageBox.show(msg, {
            icon: sap.m.MessageBox.Icon.ERROR,
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
      tableDateRefresh: function (oEvent) {
        var table = this.getView().byId("SOTable");
        var rowCount = table.getItems().length;
        for (var i = 0; i < rowCount; i++) {
          var text = i + 1;
          text = text * 10;
          table.getItems()[i].getCells()[0].setProperty("text", text);
        }
      },

      onRouteMatched: function (oEvent) {
        var SONo = oEvent.getParameter("arguments").SONo;
      },
    }
  );
});
