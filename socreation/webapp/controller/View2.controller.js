sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/format/DateFormat",
  ],
  function (Controller, JSONModel, DateFormat) {
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

          var headerPayload = {
            DocType: "ZRAO",
            ReqDateH: "2025-03-16T00:00:00",
            Ref1: "40000000",
            SalesOrg: "1000",
            Pmnttrms: "",
            DistrChan: "10",
            Incoterms1: "",
            Incoterms2: "FOB",
            Division: "UR",
            PriceDate: "2025-03-16T00:00:00",
            PurchNoC: "PURCH_NO_C",
            DocDate: "",
            Lrdat: "2025-03-12T00:00:00",
            Lrno: "",
            Vhlnr: "",
            ZtruckCap: "",
            Tdlnr: "",
            ET_SO_AUTO_CREATION_ORDER_ITEM: [],

            ET_SO_AUTO_CREATION_PARTNERSET: [
              {
                PartnRole: "SP",
                PartnNumb: "500073",
              },

              {
                PartnRole: "SH",
                PartnNumb: "500073",
              },
            ],

            ET_SO_AUTO_CREATION_SCHEDULESE: [],
          };
          this.getView().setModel(
            new JSONModel(headerPayload),
            "oModelForHeader"
          );
          this.itemNo = 10;
          var dataFortable = {
            results: [
              {
                ItmNumber: this.itemNo.toString(),
                TargetQu: "TON",
                Material: "4400000001",
                Batch: "24022025",
                Plant: "1000",
                StoreLoc: "1024",
                TargetQty: "9.000",
              },
            ],
          };

          this.getView().setModel(
            new JSONModel(dataFortable),
            "oModelForItems"
          );
        },

        onRouteMatched: function (oEvent) {
          var SONo = oEvent.getParameter("arguments").SONo;
          var title = "ZFAC-Factory Order WC - Sales order";
        },
        onAddNewItemPress: function () {
          this.itemNo = this.itemNo + 10;
          var JSONData = this.getView().getModel("oModelForItems").getData();
          JSONData.results.push({
            ItmNumber: this.itemNo.toString(),
            TargetQu: "TON",
            Material: "4400000001",
            Batch: "24022025",
            Plant: "1000",
            StoreLoc: "1024",
            TargetQty: "9.000",
          });
          this.getView()
            .getModel("oModelForItems")
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
        onSubmit: function () {
          var oHeadPayload = this.getView()
            .getModel("oModelForHeader")
            .getData();
          var aItemPayload = this.getView()
            .getModel("oModelForItems")
            .getData();

          oHeadPayload.ET_SO_AUTO_CREATION_ORDER_ITEM = aItemPayload.results;
          var payload = oHeadPayload;

          const oDateFormat = DateFormat.getDateTimeInstance(
            {
              pattern: "yyyy-MM-dd'T'HH:mm:ss",
            },
            sap.ui.getCore().getConfiguration().getLocale()
          ); // You can also use a specific locale

          const myDate = new Date();
          payload.DocDate = oDateFormat.format(payload.DocDate);

          for (
            let index = 0;
            index < oHeadPayload.ET_SO_AUTO_CREATION_ORDER_ITEM.length;
            index++
          ) {
            const element = oHeadPayload.ET_SO_AUTO_CREATION_ORDER_ITEM[index];
            payload.ET_SO_AUTO_CREATION_SCHEDULESE.push({
              ItmNumber: element.ItmNumber,
              ReqDate: oDateFormat.format(myDate),
              ReqQty: element.TargetQty,
            });
          }

          var sPath = "/Es_So_Auto_Creation_Head";

          this.getView()
            .getModel()
            .create(sPath, payload, {
              success: function (oData, response) {}.bind(this),
              error: function (sError) {}.bind(this),
            });
        },
      }
    );
  }
);
