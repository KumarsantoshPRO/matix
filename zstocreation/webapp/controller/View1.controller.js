sap.ui.define(
    ["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageBox",
        "sap/ui/core/format/DateFormat",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator, MessageBox, DateFormat) {
        "use strict";
        return Controller.extend("matix.com.stp.stocreation.zstocreation.controller.View1", {
            onInit: function () {
                var oData = {
                    items: []
                };
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "oModelForTable");
                var oViewModel = new JSONModel({
                    autoInvoice: false,
                    submit: false
                });
                this.getView().setModel(oViewModel, "oViewModel");
                var oFormModel = new JSONModel();
                this.getView().setModel(oFormModel, "oFormModel");
                var oFormModel = this.getView().getModel("oFormModel");
                //Global variable to format the date
                this.oDateFormat = DateFormat.getDateTimeInstance(
                    {
                        pattern: "yyyy-MM-dd'T'HH:mm:ss",
                    },
                    sap.ui.getCore().getConfiguration().getLocale()
                );
                this.getDataset();
                this.PoItem = "00010";
                this.OrderTypeSuggestions();
                this.plantSuggestions();
                this.materialSuggestions();
            },
            getDataset: function () {
                var oFormModel = this.getView().getModel("oFormModel");
                this.getView().setBusy(true);
                this.oModel = this.getOwnerComponent().getModel("ZSFA_STOCK_TRANSFER_PROCESS_SRV");
                var aFilters = [];
                // aFilters.push(new sap.ui.model.Filter([new sap.ui.model.Filter("DocType", sap.ui.model.FilterOperator.EQ, oFormModel.DocType)], false));
                this.oModel.read("/Et_stock_transfer_headSet", {
                    // filters: aFilters,
                    urlParameters: {
                        $expand: "Et_stock_transfer_itemSet",
                    },
                    success: function (oData) {
                        this.getView().setBusy(false);
                        debugger;
                        oData.results[0].DocDate =  new Date();
                        oFormModel.setData(oData.results[0]);
                        oData.results[0].Et_stock_transfer_itemSet.results[0].PoItem = "10"
                        this.getView().setModel(new JSONModel(oData.results[0].Et_stock_transfer_itemSet), "oModelForTable");
                        // console.log(oData);
                    }.bind(this),
                    error: function (error) {
                        this.getView().setBusy(false);
                    }.bind(this),
                });
            },
            OrderTypeSuggestions: function () {
                var orderType = new JSONModel([{
                    key: "ZST1",
                    text: "ZST1-Road STO",
                }, {
                    key: "ZSTO",
                    text: "ZSTO-Rail STO",
                },]);
                this.getView().setModel(orderType, "orderType");
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
                this.getView().setBusy(true);
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
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (sError) {
                        this.getView().setBusy(false);
                    }.bind(this),
                });

            },
            destinationPlantSelected: function (oEvent) {
                var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";
                var oModel = new sap.ui.model.odata.ODataModel(sService, true);
                var oFilterSP = new sap.ui.model.Filter({
                    path: "Domname",
                    operator: "EQ",
                    value1: "WERKS",
                });

                var sPath = "/Es_F4_ValueSet";
                this.getView().setBusy(true);
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
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (sError) {
                        this.getView().setBusy(false);
                    }.bind(this),
                });


            },
            storageLocationSuggestions: function (oEvent) {
                var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";
                var oModel = new sap.ui.model.odata.ODataModel(sService, true);
                // var sSelectedPlant = this.getView().getModel("oFormModel").getProperty("/SupplPlnt");
                var sSelectedPlant = oEvent.getParameter("selectedItem").getProperty("text")
                var oFilterSP = new sap.ui.model.Filter({
                    path: "Domname",
                    operator: "EQ",
                    value1: "T001L",
                });
                var oFilterPlant = new sap.ui.model.Filter({
                    path: "Domname2",
                    operator: "EQ",
                    value1: sSelectedPlant.split("-")[0],
                });

                var sPath = "/Es_F4_ValueSet";
                this.getView().setBusy(true);
                oModel.read(sPath, {
                    filters: [oFilterSP, oFilterPlant],
                    success: function (data) {
                        this.getView().getModel("oFormModel").setProperty("/SupplVend", "");
                        for (let index = 0; index < data.results.length; index++) {
                            const element = data.results[index];
                            element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
                        }
                        this.getView().setModel(
                            new JSONModel(data.results),
                            "oModelforStrglocation"
                        );
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (sError) {
                        this.getView().setBusy(false);
                    }.bind(this),
                });
                if ((sSelectedPlant.split("-")[0]) === "1000") {
                    this.getView().getModel("oViewModel").setProperty("/submit", true);
                    this.getView().getModel("oViewModel").setProperty("/autoInvoice", false);
                } else {
                    this.getView().getModel("oViewModel").setProperty("/submit", false);
                    this.getView().getModel("oViewModel").setProperty("/autoInvoice", true);
                }
            },
            locationCodeSuggestions: function (oEvent) {
                var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";
                var oModel = new sap.ui.model.odata.ODataModel(sService, true);
                var sPath = oEvent.getSource().getParent().getBindingContextPath() + "/Plant";
                var destiPlant = this.getView().getModel("oModelForTable").getProperty(sPath);
                var destiPlant = oEvent.getParameter("selectedItem").getProperty("text")
                var oFilterSP = new sap.ui.model.Filter({
                    path: "Domname",
                    operator: "EQ",
                    value1: "T001L",
                });
                var oFilterPlant = new sap.ui.model.Filter({
                    path: "Domname2",
                    operator: "EQ",
                    value1: destiPlant.split("-")[0],
                });

                var sPath = "/Es_F4_ValueSet";
                this.getView().setBusy(true);
                oModel.read(sPath, {
                    filters: [oFilterSP, oFilterPlant],
                    success: function (data) {
                        var sPath = oEvent.getSource().getParent().getBindingContextPath();
                        var locCode = sPath + "/StgeLoc";
                        var batchNo = sPath + "/Batch";
                        this.getView().getModel("oModelForTable").setProperty(locCode, "");
                        this.getView().getModel("oModelForTable").setProperty(batchNo, "");
                        for (let index = 0; index < data.results.length; index++) {
                            const element = data.results[index];
                            element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
                        }
                        this.getView().setModel(
                            new JSONModel(data.results),
                            "oModelforlocationcode"
                        );
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (sError) {
                        this.getView().setBusy(false);
                    }.bind(this),
                });
            },

            materialSuggestions: function () {
                var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";
                var oModel = new sap.ui.model.odata.ODataModel(sService, true);
                var oFilterSP = new sap.ui.model.Filter({
                    path: "Domname",
                    operator: "EQ",
                    value1: "MATERIAL_STO",
                });

                var sPath = "/Es_F4_ValueSet";
                this.getView().setBusy(true);
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
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (sError) {
                        this.getView().setBusy(false);
                    }.bind(this),
                });
            },
            onMaterialSelectSuggestion: function (oEvent) {
                var aData = this.getView().getModel("oModelforMaterial").getData();
                var material = oEvent.getParameter('selectedItem').getProperty('text').split("-")[0];
                for (let index = 0; index < aData.length; index++) {
                    const element = aData[index];
                    if (element.DomvalueL === material) {
                        var sPath = oEvent.getSource().getParent().getBindingContextPath() + "/PoUnit";
                        this.getView().getModel("oModelForTable").setProperty(sPath, element.Domname3)
                    }
                }
                this.BatchSuggestions(oEvent, material);
            },
            BatchSuggestions: function (oEvent, sMaterial) {

                var sService = "/sap/opu/odata/sap/ZSFA_SALES_PROCESS_SRV";
                var oModel = new sap.ui.model.odata.ODataModel(sService, true);

                // var mPath = oEvent.getSource().getParent().getBindingContextPath() + "/Material";
                // var sMaterial = this.getView().getModel("oModelForTable").getProperty(mPath);

                var sPath = oEvent.getSource().getParent().getBindingContextPath() + "/Plant";
                var destiPlant = this.getView().getModel("oModelForTable").getProperty(sPath);

                var lPath = oEvent.getSource().getParent().getBindingContextPath() + "/StgeLoc";
                var locationCode = this.getView().getModel("oModelForTable").getProperty(lPath);

                var suppPlant = this.getView().getModel("oFormModel").getProperty("/SupplPlnt");
                var storLocation = this.getView().getModel("oFormModel").getProperty("/SupplVend");

                var oFilterSP = new sap.ui.model.Filter({
                    path: "Domname",
                    operator: "EQ",
                    value1: "MCHB",
                });
                var oFilterMaterial = new sap.ui.model.Filter({
                    path: "Domname3",
                    operator: "EQ",
                    value1: sMaterial,
                });
                var oFilterPlant = new sap.ui.model.Filter({
                    path: "Domname1",
                    operator: "EQ",
                    value1: suppPlant.split("-")[0],
                });
                var oFilterLocation = new sap.ui.model.Filter({
                    path: "Domname2",
                    operator: "EQ",
                    value1: storLocation.split("-")[0],
                });


                var sPath = "/Es_F4_ValueSet";
                this.getView().setBusy(true);
                oModel.read(sPath, {
                    filters: [oFilterSP, oFilterPlant, oFilterLocation, oFilterMaterial],
                    success: function (data) {
                        var sPath = oEvent.getSource().getParent().getBindingContextPath();
                        var batchNo = sPath + "/Batch";
                        this.getView().getModel("oModelForTable").setProperty(batchNo, "");
                        for (let index = 0; index < data.results.length; index++) {
                            const element = data.results[index];
                            element.DomvalueL = element.DomvalueL.replace(/^0+/, "");
                        }
                        this.getView().setModel(
                            new JSONModel(data.results),
                            "oModelforBatch"
                        );
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function (sError) {
                        this.getView().setBusy(false);
                    }.bind(this),
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

            onAddNewItemPress: function () {
                this.getView().setBusy(true);
                this.oModel.read("/Et_stock_transfer_headSet", {
                    urlParameters: {
                        $expand: "Et_stock_transfer_itemSet",
                    },

                    success: function (oValue) {
                        var oTableModel = this.getView().getModel("oModelForTable"),
                            aTableData = oTableModel.getProperty("/results") || [];
                        var iLastPoItem = aTableData.length > 0 ? parseInt(aTableData[aTableData.length - 1].PoItem, 10) : 0;
                        var iNextPoItem = (iLastPoItem === 0 ? 10 : iLastPoItem + 10);
                        this.PoItem = iNextPoItem.toString();
                        var oNewRow = {
                            PoItem: this.PoItem,
                            Material: "",
                            Plant: "",
                            StgeLoc: "",
                            Quantity: "",
                            PoUnit: "",
                            Batch: ""
                        };
                        var oTableModel = this.getView().getModel("oModelForTable");
                        var aTableData = oTableModel.getProperty("/results") || [];
                        aTableData.push(oNewRow);
                        oTableModel.setProperty("/results", aTableData);
                        oTableModel.refresh();
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function () {
                        this.getView().setBusy(false);
                    }.bind(this),
                });
            },
            onItemsTableDelete: function () {
                var oTable = this.getView().byId("StoTable");
                var selected = oTable.getSelectedItems();
                var msg;
                if (selected["length"] === 0) {
                    msg = "Please select atleast one row";
                    sap.m.MessageBox.show(msg, {
                        icon: sap.m.MessageBox.Icon.ERROR,
                        title: "Error",
                    });
                } else {
                    var oModel = this.getView().getModel("oModelForTable");
                    var aSelectedItems = oTable.getSelectedItems();
                    var aItems = oModel.getProperty("/results");
                    var aIndices = aSelectedItems.map(item => parseInt(item.getBindingContext("oModelForTable").getPath().split("/")[2]))
                        .sort((a, b) => b - a);
                    aIndices.forEach(iIndex => {
                        if (iIndex >= 0 && iIndex < aItems.length) {
                            aItems.splice(iIndex, 1);
                        }
                    });

                    oModel.setProperty("/items", aItems);
                    oModel.refresh(true);
                    oTable.removeSelections(true);
                }
            },

            onSubmit: function () {
                function formatDate(date) {
                    if (!date) return null;
                    var oDate = new Date(date);
                    return oDate.toISOString().split(".")[0];
                }

                var aTableData = this.getView().getModel("oModelForTable").getData().results,
                    oFormData = this.getView().getModel("oFormModel").getData();
                var sSelectedPlant = this.getView().getModel("oFormModel").getProperty("/SupplPlnt").split("-")[0];
                var oDocType = this.getView().getModel("oFormModel").getProperty("/DocType").split("-")[0];
                var sStorageLocation = this.getView().getModel("oFormModel").getProperty("/SupplVend").split("-")[0];
                var truckcapacity = Number(this.getView().getModel("oFormModel").getProperty("/ZtruckCap")).toFixed(3);

                for (var i = 0; i < aTableData.length; i++) {
                    aTableData[i].Plant = aTableData[i].Plant.split("-")[0];
                    aTableData[i].StgeLoc = aTableData[i].StgeLoc.split("-")[0];
                    aTableData[i].SupplStloc = aTableData[i].StgeLoc.split("-")[0];
                    aTableData[i].Material = aTableData[i].Material.split("-")[0];
                    aTableData[i].Batch = aTableData[i].Batch.split("-")[0];
                    aTableData[i].Quantity = Number(aTableData[i].Quantity).toFixed(3);
                    aTableData[i].PeriodIndExpirationDate = "D";
                    aTableData[i].PoItem = aTableData[i].PoItem;
                }
                oFormData.SupplPlnt = sSelectedPlant;
                oFormData.DocType = oDocType;
                oFormData.SupplVend = sStorageLocation;
                oFormData.CompCode = "1000",
                    oFormData.PurchOrg = "1200",
                    oFormData.PurGroup = "074",
                    oFormData.DocDate = formatDate(oFormData.DocDate);
                oFormData.Lrdat = formatDate(oFormData.DocDate);
                oFormData.Et_stock_transfer_itemSet = aTableData;
                var that = this;
                //Start: Validation
                function headerValidate() {
                    if (!oFormData.DocType) {
                        MessageBox.error("Please enter Oder Type");
                        return false;
                    } else if (!oFormData.SupplPlnt) {
                        MessageBox.error("Please enter Supplying plant");
                        return false;
                    } else if (!oFormData.SupplVend) {
                        MessageBox.error("Please enter Storage Location");
                        return false;
                    } else {
                        return true;
                    }
                }
                function itemValidatate() {
                    for (var i = 0; i < aTableData.length; i++) {
                        if (!aTableData[i].Material) {
                            MessageBox.error("Please enter Material at line no:" + i + 1);
                            return false;
                        } else if (Number(aTableData[i].Quantity) <= 0) {
                            MessageBox.error("Please enter Quantity at line no:" + i + 1);
                            return false;
                        } else if (!aTableData[i].PoUnit) {
                            MessageBox.error("Please enter Unit at line no:" + i + 1);
                            return false;
                        } else if (!aTableData[i].Plant) {
                            MessageBox.error("Please enter Destination Plant at line no:" + i + 1);
                            return false;
                        } else if (!aTableData[i].StgeLoc) {
                            MessageBox.error("Please enter Location Code at line no:" + i + 1);
                            return false;
                        } else if (!aTableData[i].Batch && oFormData.SupplPlnt !== "1000") {
                            MessageBox.error("Please enter Batch at line no:" + i + 1);
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
                var headerValidation = headerValidate();
                var itemValidation = itemValidatate();
                //End: Validation
                if (headerValidation && itemValidation) {
                    this.getView().setBusy(true);
                    this.oModel.create("/Et_stock_transfer_headSet", oFormData, {
                        success: function (data, response) {
                            this.getView().setBusy(false);
                            var message = JSON.parse(
                                response.headers["sap-message"]
                            ).message;

                            MessageBox.information(message, {
                                onClose: function (sAction) {
                                    that.getDataset();
                                }
                            });
                        }.bind(this),
                        error: function (sError) {
                            this.getView().setBusy(false);
                            MessageBox.error(
                                JSON.parse(sError.responseText).error.message.value
                            );
                            // console.log(sError);
                        }.bind(this),
                    });
                }
            },
            onCancel: function () {
                var that = this;
                sap.m.MessageBox.warning(
                    "Do you want to cancel?", {
                    title: "Warning",
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    onClose: function (sAction) {
                        if (sAction === sap.m.MessageBox.Action.OK) {
                            // var oFormModel = that.getView().getModel("oFormModel");
                            // var oTableModel = that.getView().getModel("oModelForTable");
                            that.getDataset();

                        }
                    }
                });

            }
        });
    });