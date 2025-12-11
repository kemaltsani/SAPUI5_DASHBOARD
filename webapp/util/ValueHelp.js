sap.ui.define([
    "sap/m/SelectDialog",
    "sap/m/StandardListItem",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Token"
], function (SelectDialog, StandardListItem, Filter, FilterOperator, Token) {
    "use strict";

    return {

        // ===================================================================================
        // MULTI-SELECT VALUE HELP (Pillar, Company Code)
        // ===================================================================================
        openVH: function (oControl, oModel, mConfig) {

            const sTitle = mConfig.title;
            const sPath = mConfig.entitySet;
            const sKey = mConfig.keyField;
            const sText = mConfig.textField;

            if (!oControl._vhDialog) {

                oControl._vhDialog = new SelectDialog({
                    title: sTitle,
                    multiSelect: true,
                    rememberSelections: true,
                    showFooter: true,
                    busyIndicatorDelay: 0,

                    items: {
                        path: sPath,
                        template: new StandardListItem({
                            title: `{${sText}}`,
                            description: `{${sKey}}`
                        })
                    },

                    search: function (oEvent) {
                        const sQuery = oEvent.getParameter("value");
                        const binding = oEvent.getSource().getBinding("items");

                        const aFilters = [];
                        if (sQuery) {
                            aFilters.push(
                                new Filter({
                                    filters: [
                                        new Filter(sText, FilterOperator.Contains, sQuery),
                                        new Filter(sKey, FilterOperator.Contains, sQuery)
                                    ],
                                    and: false
                                })
                            );
                        }
                        binding.filter(aFilters);
                    },

                    confirm: function (oEvent) {
                        const aSelected = oEvent.getParameter("selectedItems");
                        oControl.removeAllTokens();

                        aSelected.forEach((oItem) => {
                            oControl.addToken(new Token({
                                key: oItem.getDescription(),
                                text: `${oItem.getDescription()} - ${oItem.getTitle()}`
                            }));
                        });
                    }
                });
            }

            oControl._vhDialog.setModel(oModel);

            const binding = oControl._vhDialog.getBinding("items");
            if (binding) {
                binding.filter([]);
                binding.refresh(true);
            }

            oControl._vhDialog.open();
        },

        // ===================================================================================
        // ⭐ SINGLE-SELECT VALUE HELP (Month, Year)
        // ===================================================================================
        openSingleVH: function (oInput, oModel, config) {

            const sTitle = config.title;
            const sPath = config.entitySet;
            const sKey = config.keyField;
            const sText = config.textField;

            const oDialog = new SelectDialog({
                title: sTitle,
                multiSelect: false,     // ⭐ Single Selection Only
                rememberSelections: false,
                busyIndicatorDelay: 0,

                items: {
                    path: sPath,
                    template: new StandardListItem({
                        title: `{${sText}}`,
                        description: `{${sKey}}`,
                        type: "Active"
                    })
                },

                search: function (oEvent) {
                    const sValue = oEvent.getParameter("value");
                    const binding = oEvent.getSource().getBinding("items");

                    const aFilters = [];

                    if (sValue) {
                        aFilters.push(
                            new Filter({
                                filters: [
                                    new Filter(sText, FilterOperator.Contains, sValue),
                                    new Filter(sKey, FilterOperator.Contains, sValue)
                                ],
                                and: false
                            })
                        );
                    }
                    binding.filter(aFilters);
                },

                confirm: (oEvent) => {
                    const oItem = oEvent.getParameter("selectedItem");
                    if (oItem) {
oInput.setValue(oItem.getTitle());        // MonthText (January, February...)
oInput.data("KEY", oItem.getDescription()); // Month number (01..12)

                    }
                }
            });

            oDialog.setModel(oModel);

            // Clean filter on open
            const binding = oDialog.getBinding("items");
            if (binding) binding.filter([]);

            oDialog.open();
        },

        // ===================================================================================
        // STATIC MULTI-SELECT VALUE HELP (unchanged)
        // ===================================================================================
        openStaticVH: function (oMultiInput, aData, config) {
            const { title, keyField, textField } = config;

            if (!oMultiInput._staticVH) {

                oMultiInput._staticVH = new SelectDialog({
                    title: title,
                    multiSelect: true,
                    rememberSelections: true,
                    showFooter: true,
                    busyIndicatorDelay: 0,

                    items: {
                        path: "/items",
                        template: new StandardListItem({
                            title: `{${textField}}`,
                            description: `{${keyField}}`
                        })
                    },

                    search: function (oEvent) {
                        const sValue = oEvent.getParameter("value");
                        const binding = oEvent.getSource().getBinding("items");

                        const aFilters = [];

                        if (sValue) {
                            aFilters.push(
                                new Filter({
                                    filters: [
                                        new Filter(textField, FilterOperator.Contains, sValue),
                                        new Filter(keyField, FilterOperator.Contains, sValue)
                                    ],
                                    and: false
                                })
                            );
                        }
                        binding.filter(aFilters);
                    },

                    confirm: function (oEvent) {
                        const aSelected = oEvent.getParameter("selectedItems") || [];
                        oMultiInput.removeAllTokens();

                        aSelected.forEach(item => {
                            oMultiInput.addToken(
                                new Token({
                                    key: item.getDescription(),
                                    text: item.getTitle()
                                })
                            );
                        });
                    }
                });

                // Footer buttons (Select All / Clear All)
                const footer = new sap.m.Bar({
                    contentLeft: [
                        new sap.m.Button({
                            text: "Select All",
                            type: "Emphasized",
                            press: function () {
                                const dlg = oMultiInput._staticVH;
                                const items = dlg.getItems();

                                dlg._oList.selectAll(true);
                                oMultiInput.removeAllTokens();

                                items.forEach(item => {
                                    oMultiInput.addToken(
                                        new Token({
                                            key: item.getDescription(),
                                            text: item.getTitle()
                                        })
                                    );
                                });
                            }
                        })
                    ],
                    contentRight: [
                        new sap.m.Button({
                            text: "Clear All",
                            type: "Reject",
                            press: function () {
                                const dlg = oMultiInput._staticVH;
                                dlg._oList.removeSelections(true);
                                oMultiInput.removeAllTokens();
                            }
                        })
                    ]
                });

                oMultiInput._staticVH.setCustomFooter(footer);
            }

            const oJson = new sap.ui.model.json.JSONModel({ items: aData });
            oMultiInput._staticVH.setModel(oJson);

            setTimeout(() => {
                const selectedKeys = oMultiInput.getTokens().map(t => t.getKey());
                oMultiInput._staticVH.getItems().forEach(item => {
                    const key = item.getDescription();
                    item.setSelected(selectedKeys.includes(key));
                });
            }, 100);

            oMultiInput._staticVH.open();
        }
    };
});
