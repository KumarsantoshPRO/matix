/* global QUnit */
// https://api.qunitjs.com/config/autostart/
QUnit.config.autostart = false;

sap.ui.require([
	"zproskmatix/zsk_matix_testapp/test/unit/AllTests"
], function (Controller) {
	"use strict";
	QUnit.start();
});