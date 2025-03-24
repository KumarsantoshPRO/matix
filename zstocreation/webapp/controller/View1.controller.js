sap.ui.define(
	["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function(Controller, JSONModel) {
		"use strict";
    return Controller.extend("matix.com.stp.stocreation.zstocreation.controller.View1", {
        onInit: function () {
            // var oData = {
            //     items: []
            // };
            // var oModel = new JSONModel(oData);
            // this.getView().setModel(oModel, "oModelForTable");
        },
        // onAddNewItemPress: function () {
        //     var oModel = this.getView().getModel("oModelForTable");
        //     var aItems = oModel.getProperty("/items");
        
        //     var oNewItem = {
        //         material: "",
        //         quantity: "",
        //         unit: "",
        //         destinationPlant: "",
        //         locationCode: "",
        //         batchNo: ""
        //     };
        
        //     aItems.push(oNewItem);
        //     oModel.setProperty("/items", aItems);
        // },
        // onItemsTableDelete: function (oEvent) {
        //     var oModel = this.getView().getModel("oModelForTable");
        //     var oTable = oModel.getData();
        //     var sPath = oEvent.getSource().getBindingContext("oModelForTable").getPath();
        //     var iIndex = parseInt(sPath.split("/")[1]);
        //     oTable.splice(iIndex, 1);
        //     oModel.refresh();
        // }
        
    });
});