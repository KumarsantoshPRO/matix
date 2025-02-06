sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(
	Controller
) {
	"use strict";

	return Controller.extend("zpro.sk.matix.so.creation.zskmatixsocreation.controller.View2", {

		/**
		 * @override
		 */
		onInit: function() {
			this.getOwnerComponent()
			.getRouter()
			.attachRoutePatternMatched(this.onRouteMatched, this);
			
		
		},

		onRouteMatched: function (oEvent) {
			var SONo = oEvent.getParameter("arguments").SONo;
		}

	});
});