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
        return Controller.extend("matix.com.log.somlog.zsomlog.controller.View1", {
            onInit: function () {
                var oFilterModel = new sap.ui.model.json.JSONModel({
                    fromDate: "",
                    toDate: "",
                    supplyingPlant: "",
                    receivingPlant: "",
                    product: ""
                });
                this.getView().setModel(oFilterModel, "oFilterModel");
                this.plantSuggestions();
                this.materialSuggestions();

            },
            getData: function (aFilters) {
                var oFormModel = new JSONModel();
                this.getView().setModel(oFormModel, "oFormModel");
                var oFormModel = this.getView().getModel("oFormModel");
                this.getView().setBusy(true);
                this.oModel = this.getOwnerComponent().getModel("ZSFA_GET_STO_MIGO_LOG_SRV");
                // aFilters.push(new sap.ui.model.Filter([new sap.ui.model.Filter("DocType", sap.ui.model.FilterOperator.EQ, oFormModel.DocType)], false));
                this.oModel.read("/Et_Sto_Migo_Log", {
                    filters: aFilters,
                    success: function (oData) {
                        this.getView().setBusy(false);
                        oData.results.forEach((item, index) => {
                            item.SINo = index + 1;
                        });
                        oFormModel.setData(oData.results);
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

            plantSuggestions: function () {
                var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";
                var oModel = new sap.ui.model.odata.ODataModel(sService, true);
                var oFilterSP = new sap.ui.model.Filter({
                    path: "Domname",
                    operator: "EQ",
                    value1: "WERKS",
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
                            "oModelforPlant"
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
                var supplyingPlant = oFilterModel.getProperty("/supplyingPlant");
                var receivingPlant = oFilterModel.getProperty("/receivingPlant");
                var product = oFilterModel.getProperty("/product");

                if (supplyingPlant && supplyingPlant.includes("-")) {
                    supplyingPlant = supplyingPlant.split("-")[0].trim();
                }
                if (receivingPlant && receivingPlant.includes("-")) {
                    receivingPlant = receivingPlant.split("-")[0].trim();
                }
                if (product && product.includes("-")) {
                    product = product.split("-")[0].trim();
                }

                if (!fromDate && !toDate) {
                    MessageBox.error("Please enter valid date range");
                    return;
                }else if(fromDate && !toDate){
                    oFilterModel.setProperty("/toDate", fromDate);
                    toDate = fromDate;
                }else if (!fromDate && toDate){
                    oFilterModel.setProperty("/fromDate", toDate);
                    fromDate = toDate;
                }

                if(fromDate > toDate){
                    MessageBox.error("To date should not be greater than From date.");
                    return;
                }

                if (supplyingPlant) {
                    aFilters.push(
                        new sap.ui.model.Filter(
                            [
                                new sap.ui.model.Filter({
                                    path: "SupplyingPlantCode",
                                    operator: "EQ",
                                    value1: supplyingPlant,
                                }),
                            ],
                            false
                        )
                    );
                }
                if (receivingPlant) {
                    aFilters.push(
                        new sap.ui.model.Filter(
                            [
                                new sap.ui.model.Filter({
                                    path: "ReceivingPlantCode",
                                    operator: "EQ",
                                    value1: receivingPlant,
                                }),
                            ],
                            false
                        )
                    );
                }
                if (toDate || fromDate) {
                    aFilters.push(
                        new sap.ui.model.Filter(
                            [
                                new sap.ui.model.Filter({
                                    path: "CreatedOn",
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
                    // console.log(formattedProduct);
                    aFilters.push(
                        new sap.ui.model.Filter(
                            [
                                new sap.ui.model.Filter({
                                    path: "MaterialsNo",
                                    operator: "EQ",
                                    value1: formattedProduct,
                                }),
                            ],
                            false
                        )
                    );
                }
                // console.log("Applied Filters:", aFilters);
                this.getData(aFilters);

            },


            onFilterClear: function () {
                var oFilterModel = this.getView().getModel("oFilterModel");
                oFilterModel.setData({
                    fromDate: "",
                    toDate: "",
                    supplyingPlant: "",
                    receivingPlant: "",
                    product: ""
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
            }
        });
    });