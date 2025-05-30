/* global QUnit */
// https://api.qunitjs.com/config/autostart/
QUnit.config.autostart = false;

sap.ui.require([
	"matixcomlogsomlog/zsomlog/test/unit/AllTests"
], function (Controller) {
	"use strict";
	QUnit.start();
});