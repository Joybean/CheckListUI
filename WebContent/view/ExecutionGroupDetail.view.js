sap.ui.jsview("sme.perf.ui.view.ExecutionGroupDetail", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf view.Template
	*/ 
	getControllerName : function() {
		return "sme.perf.ui.controller.ExecutionGroupDetail";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf view.Template
	*/ 
	createContent : function(oController) {
 		return new sap.m.Page({
			title: "Execution Group Detail",
			showNavButton: true,
			navButtonPress: function (oEvent) {
			    oController.onNavBack(oEvent);
			},
			content: [
			    new sap.ui.layout.form.SimpleForm({
			    	editable: true,
			    	layout: "ResponsiveGridLayout",
			    	content: [
			    	    new sap.m.Label({text: "Name"}),
			    	    new sap.m.Input({
			    	    	value: "{executionGroupModel>/name}"
			    	    }),
			    	    new sap.m.Label({text: "Execution ID List"}),
			    	    new sap.m.Input({
			    	    	value: "{executionGroupModel>/executionIdList}"
			    	    })
			    	]
			    })
			],
			footer:new sap.m.Bar({
            	contentRight:[
  					new sap.m.Button({
						text: "Duplicate",
						press: function(oEvent){
							oController.onDuplicate(oEvent);
						}
					}),
					new sap.m.Button({
						text: "Save",
						press: function(oEvent){
							oController.onSave(oEvent);
						}
					})
				]
			})
		});
	}

});