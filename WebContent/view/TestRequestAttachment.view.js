sap.ui.jsview("sme.perf.ui.view.TestRequestAttachment", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf view.Template
	*/ 
	getControllerName : function() {
		return "sme.perf.ui.controller.TestRequestAttachment";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf view.Template
	*/ 
	createContent : function(oController) {
 		return new sap.m.Page(this.createId("Page"),{
			title: "{i18n>/testRequestAttachmentTitle}",
			showNavButton: true,
			navButtonPress: function (oEvent) {
			    oController.onNavBack(oEvent);
			},
			content: [
			    new sap.m.Panel({
					headerToolbar: new sap.m.Toolbar({
						content: [
						    new sap.m.Title({
						    	text: "Test Request: {attachmentModel>/testRequestId} ",
						    	titleStyle: sap.ui.core.TitleLevel.H3
						    })
						]
					}),
					content:[
					    new sap.m.List({
			    	    	items:{
			    	    		path: "attachmentModel>/attachmentList",
			    	    		template: new sap.m.StandardListItem({
			    	    			type: sap.m.ListType.Navigation,
			    	    			tooltip: "click to download",
			    	    			title: "{attachmentModel>fileName}",
			    	    			description: {
			    	    				path: "attachmentModel>uploadDate",
			    	    				formatter: oController.formatter.formatDateTimeStringToDateString
			    	    			}
			    	    		})
			    	    	},
					    	itemPress: function(oEvent){
					    		oController.onItemPress(oEvent);
					    	}
			    	    })
					]
				})
			],
			footer:new sap.m.Bar({
            	contentRight:[
					new sap.m.Button({
						text: "Refresh",
						press: function(oEvent){
							oController.onRefresh(oEvent);
						}
					}),
					new sap.m.Button({
						text: "New",
						press: function(oEvent){
							oController.onNew(oEvent);
						}
					})
				]
			})
		});
	}

});