sap.ui.define(
    ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageBox",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator, MessageBox) {
        "use strict";

        return Controller.extend("matix.com.log.solog.solog.controller.View", {
            onInit() {
                var oFilterModel = new sap.ui.model.json.JSONModel({
                    fromDate: "",
                    toDate: "",
                    user: "",
                    salesOffice: "",
                    product: "",
                    custSalesGroup: ""
                });
                this.getView().setModel(oFilterModel, "oFilterModel");
                this.materialSuggestions();
                this.onSalesOfficeSelectSuggestion();
            },

            getData: function (aFilters) {
                var oFormModel = new JSONModel();
                this.getView().setModel(oFormModel, "oFormModel");
                var oFormModel = this.getView().getModel("oFormModel");
                this.getView().setBusy(true);
                this.oModel = this.getOwnerComponent().getModel("ZSFA_GET_SO_LOG_SRV");
                // aFilters.push(new sap.ui.model.Filter([new sap.ui.model.Filter("DocType", sap.ui.model.FilterOperator.EQ, oFormModel.DocType)], false));
                this.oModel.read("/Et_So_Log", {
                    filters: aFilters,
                    success: function (oData) {
                        this.getView().setBusy(false);
                        oFormModel.setData(oData.results);
                        // oData.results.forEach((item, index) => {
                        //     item.SINo = index + 1;
                        // });
                        // console.log(oData);
                    }.bind(this),
                    error: function (error) {
                        this.getView().setBusy(false);
                        // console.log(error);
                    }.bind(this),
                });
            },

            formatDate: function (date) {
                if (!date) return "";
                const oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "dd.MM.yyyy" });
                return oDateFormat.format(new Date(date));
            },

            onSalesOfficeSelectSuggestion: function () {
                var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";
                var oModel = new sap.ui.model.odata.ODataModel(sService, true);
                var oFilterSP = new sap.ui.model.Filter({
                    path: "Domname",
                    operator: "EQ",
                    value1: "TVKBZ",
                });

                var sPath = "/Es_F4_ValueSet";
                oModel.read(sPath, {
                    filters: [oFilterSP],
                    success: function (data) {
                        for (let index = 0; index < data.results.length; index++) {
                            const element = data.results[index];
                            element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
                        }
                        this.getView().setModel(
                            new JSONModel(data.results),
                            "oModelforSalesOffice"
                        );
                    }.bind(this),
                    error: function (sError) { }.bind(this),
                });
            },

            customerSalesGroupSuggestions: function () {
                var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";
                var oModel = new sap.ui.model.odata.ODataModel(sService, true);
                var salesOffice = this.getView().getModel("oFilterModel").getProperty("/salesOffice");
                var oFilterSP = new sap.ui.model.Filter({
                    path: "Domname",
                    operator: "EQ",
                    value1: "TVBVK",
                });
                var oFilterPlant = new sap.ui.model.Filter({
                    path: "Domname2",
                    operator: "EQ",
                    value1: salesOffice.split("-")[0],
                });

                var sPath = "/Es_F4_ValueSet";
                oModel.read(sPath, {
                    filters: [oFilterSP, oFilterPlant],
                    success: function (data) {
                        for (let index = 0; index < data.results.length; index++) {
                            const element = data.results[index];
                            element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
                        }
                        this.getView().setModel(
                            new JSONModel(data.results),
                            "oModelforCustSalesGroup"
                        );
                    }.bind(this),
                    error: function (sError) { }.bind(this),
                });
            },

            materialSuggestions: function () {
                var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";
                var oModel = new sap.ui.model.odata.ODataModel(sService, true);
                var oFilterSP = new sap.ui.model.Filter({
                    path: "Domname",
                    operator: "EQ",
                    value1: "MATNR",
                });

                var sPath = "/Es_F4_ValueSet";
                oModel.read(sPath, {
                    filters: [oFilterSP],
                    success: function (data) {
                        for (let index = 0; index < data.results.length; index++) {
                            const element = data.results[index];
                            element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
                        }
                        this.getView().setModel(
                            new JSONModel(data.results),
                            "oModelforMaterial"
                        );
                    }.bind(this),
                    error: function (sError) { }.bind(this),
                });
            },

            onSuggest: function (oEvent) {
                var sTerm = oEvent.getParameter("suggestValue");
                var aFilters = [];
                aFilters.push(
                    new Filter("Ddtext", FilterOperator.Contains, sTerm.toString())
                );
                aFilters.push(
                    new Filter("DomvalueL", FilterOperator.Contains, sTerm.toString())
                );
                if (sTerm) {
                    var Filters = new Filter({
                        filters: aFilters,
                        and: false,
                    });
                }
                oEvent.getSource().getBinding("suggestionItems").filter(Filters);
            },

            onSearch: function () {
                var aFilters = [];
                var oFilterModel = this.getView().getModel("oFilterModel");
                var fromDate = oFilterModel.getProperty("/fromDate");
                var toDate = oFilterModel.getProperty("/toDate");
                var user = oFilterModel.getProperty("/user");
                var salesOffice = oFilterModel.getProperty("/salesOffice");
                var product = oFilterModel.getProperty("/product");
                var custSalesGroup = oFilterModel.getProperty("/custSalesGroup");

                if (salesOffice && salesOffice.includes("-")) {
                    salesOffice = salesOffice.split("-")[0].trim();
                }
                if (custSalesGroup && custSalesGroup.includes("-")) {
                    custSalesGroup = custSalesGroup.split("-")[0].trim();
                }
                if (product && product.includes("-")) {
                    product = product.split("-")[0].trim();
                }

                if (!fromDate && !toDate) {
                    MessageBox.error("Please enter valid date range");
                    return;
                } else if (fromDate && !toDate) {
                    oFilterModel.setProperty("/toDate", fromDate);
                    toDate = fromDate;
                } else if (!fromDate && toDate) {
                    oFilterModel.setProperty("/fromDate", toDate);
                    fromDate = toDate;
                }

                if (fromDate > toDate) {
                    MessageBox.error("To date should not be greater than From date.");
                    return;
                }

                if (toDate || fromDate) {
                    aFilters.push(
                        new sap.ui.model.Filter(
                            [
                                new sap.ui.model.Filter({
                                    path: "Audat",
                                    operator: "BT",
                                    value1: fromDate,
                                    value2: toDate,
                                }),
                            ],
                            false
                        )
                    );
                }
                if (product) {
                    let formattedProduct = product.toString().padStart(18, "0");
                    aFilters.push(
                        new sap.ui.model.Filter(
                            [
                                new sap.ui.model.Filter({
                                    path: "Matnr",
                                    operator: "EQ",
                                    value1: formattedProduct,
                                }),
                            ],
                            false
                        )
                    );
                }

                if (salesOffice) {
                    aFilters.push(
                        new sap.ui.model.Filter(
                            [
                                new sap.ui.model.Filter({
                                    path: "Vkbur",
                                    operator: "EQ",
                                    value1: salesOffice,
                                }),
                            ],
                            false
                        )
                    );
                }
                if (custSalesGroup) {
                    aFilters.push(
                        new sap.ui.model.Filter(
                            [
                                new sap.ui.model.Filter({
                                    path: "Vkgrp",
                                    operator: "EQ",
                                    value1: custSalesGroup,
                                }),
                            ],
                            false
                        )
                    );
                }
                this.getData(aFilters);
            },

            onFilterClear: function () {
                var oFilterModel = this.getView().getModel("oFilterModel");
                oFilterModel.setData({
                    fromDate: "",
                    toDate: "",
                    user: "",
                    salesOffice: "",
                    product: "",
                    custSalesGroup: ""
                });

                var oTable = this.getView().byId("SOTable");
                var oBinding = oTable.getBinding("items");

                if (oBinding) {
                    oBinding.filter([]);
                }
                var oFormModel = this.getView().getModel("oFormModel");
                if (oFormModel) {
                    oFormModel.setData({ data: [] });
                }
            },

            onClearResults: function () {
                var oFormModel = this.getView().getModel("oFormModel");
                if (oFormModel) {
                    oFormModel.setData({ data: [] });
                }
            },
            onInputChange: function (oEvent) {
                var oInput = oEvent.getSource();
                var sValue = oEvent.getParameter("value");
                var oBinding = oInput.getBinding("suggestionItems");
                var aContexts = oBinding.getContexts();
                var bValid = false;
      
                // Check if the entered value exists in the suggestions
                for (var i = 0; i < aContexts.length; i++) {
                  if (aContexts[i].getObject().text === sValue) {
                    bValid = true;
                    break;
                  }
                }
      
                if (!bValid && sValue !== "") {
                  // Input is invalid (not in suggestions and not empty)
                  oInput.setValueState("Error");
                  oInput.setValue("");
                  sap.m.MessageToast.show(
                    "Please select a valid entry from the suggestions."
                  );
                } else {
                  // Input is valid (either in suggestions or empty)
                  oInput.setValueState("None");
                  oInput.setValueStateText("");
                }
              },
        });
    });