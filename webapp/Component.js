/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "hr/executive/dashboard/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("hr.executive.dashboard.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

// // Component.js -> init
// var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZHCM_EXE_DASHBOARD_SRV/");
// this.setModel(oModel);
                
            }
        });
    }
);