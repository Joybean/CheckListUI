sap.ui.jsview("sme.perf.ui.view.ExecutionList", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf view.Template
	*/ 
	getControllerName : function() {
		return "sme.perf.ui.controller.ExecutionList";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf view.Template
	*/ 
	createContent : function(oController) {

        var oSearchField = new sap.m.MultiInput(this.createId("sf"), {
            placeholder: "Search...",
            showValueHelp: true,
            valueHelpRequest: function () {
                oController.refresh();
            },
            tokenChange: function (oEvent) {
                if (oEvent.getParameter("type") == "tokensChanged") {
                    var values = [];
                    var tokens = this.getTokens();
                    for (var i = 0; i < tokens.length; i++) {
                        values.push(tokens[i].getKey());
                    }
                    if (values.length == 0) {
                        oController.refresh(true);
                    }
                    else {
                        oController.operateSearch(values);
                    }
                }
            }
        });

        oSearchField._getValueHelpIcon = function () {
            var c = sap.ui.core.IconPool;
            var t = this;
            if (!this._oValueHelpIcon) {
                var u = c.getIconURI("synchronize");
                this._oValueHelpIcon = c.createControlByURI({
                    id: this.getId() + "__vhi",
                    src: u
                });
                this._oValueHelpIcon.addStyleClass("sapMInputValHelpInner");
                this._oValueHelpIcon.attachPress(function (e) {
                    if (!t.getValueHelpOnly()) {
                        t.fireValueHelpRequest({
                            fromSuggestions: false
                        })
                    }
                })
            }
            return this._oValueHelpIcon
        };

        oSearchField.addValidator(function (args) {
            return args.asyncCallback(new sap.m.Token({ key: args.text, text: args.text }));
        });

        var oTestRequestTable = new sap.m.Table(this.createId('table'), {
            growing: true,
            growingScrollToLoad: false,
            growingThreshold: 50,
            selectionMode: sap.ui.table.SelectionMode.Single,
            columns: [
                      new sap.m.Column({
                          hAlign: "Left",
                          width: "auto",
                          header: new sap.m.Label({
                              text: "ID"
                          })
                      }),
                      new sap.m.Column({
                          hAlign: "Left",
                          width: "30%",
                          header: new sap.m.Label({
                              text: "Name"
                          })
                      }),
                      new sap.m.Column({
                          hAlign: "Left",
                          width: "auto",
                          header: new sap.m.Label({
                              text: "State"
                          })
                      }),
                      new sap.m.Column({
                          hAlign: "Left",
                          width: "10%",
                          header: new sap.m.Label({
                              text: "CreateDate"
                          })
                      }),
                      new sap.m.Column({
                          hAlign: "Left",
                          width: "10%",
                          header: new sap.m.Label({
                              text: "StartDate"
                          })
                      }),
                      new sap.m.Column({
                          hAlign: "Left",
                          width: "10%",
                          header: new sap.m.Label({
                              text: "EndDate"
                          })
                      }),
                      new sap.m.Column({
                          hAlign: "Left",
                          width: "auto",
                          header: new sap.m.Label({
                              text: "Run"
                          })
                      }),
                      new sap.m.Column({
                          hAlign: "Left",
                          width: "auto",
                          header: new sap.m.Label({
                              text: "Stop"
                          })
                      }),
                      new sap.m.Column({
                          hAlign: "Left",
                          width: "auto",
                          header: new sap.m.Label({
                              text: "Log"
                          })
                      }),
                      new sap.m.Column({
                          hAlign: "Left",
                          width: "auto",
                          header: new sap.m.Label({
                              text: "Duration"
                          })
                      }),
                      new sap.m.Column({
                          hAlign: "Left",
                          width: "auto",
                          header: new sap.m.Label({
                              text: "Export"
                          })
                      }),
                      new sap.m.Column({
                          hAlign: "Left",
                          width: "auto",
                          header: new sap.m.Label({
                              text: "Import"
                          })
                      })
                      
            ],
            items: {
                path: "executionListModel>/",
                sorter: new sap.ui.model.Sorter("id", true),
                template: new sap.m.ColumnListItem({
                    type: sap.m.ListType.Navigation,
                    vAlign: sap.ui.core.VerticalAlign.Middle,
                    cells: [
			            new sap.ui.commons.Link({
			                text: "{executionListModel>id}",
			                tooltip: "ID: {executionListModel>id}",
			                wrapping: false,
			                press: function(oEvent){
			                	oController.handleShowDetail(this.getText());
			                }
			            }),
			            new sap.m.Text({
			                text: "{executionListModel>name}",
			                tooltip: "Name: {executionListModel>name}",
			                wrapping: false
			            }),
			            new sap.m.Text({
			                text: "{executionListModel>state}",
			                tooltip: "State: {executionListModel>state}",
			                wrapping: false
			            }),
                        new sap.m.Text({
                        	text: "{executionListModel>createDate}",
			                tooltip: "createDate: {executionListModel>createDate}",
			                wrapping: false
                        }),
                        new sap.m.Text({
                        	text: "{executionListModel>startDate}",
			                tooltip: "StartDate: {executionListModel>startDate}",
			                wrapping: false
                        }),
                        new sap.m.Text({
                        	text: "{executionListModel>endDate}",
			                tooltip: "EndDate: {executionListModel>endDate}",
			                wrapping: false
                        }),
                        new sap.ui.core.Icon({
                        	src: sap.ui.core.IconPool.getIconURI('add-process'),
                        	tooltip: 'Run',
                        	size: '2em',
                        	visible: "{= ${executionListModel>state} === 'New' ? true : false }",
                        	customData: [
								new sap.ui.core.CustomData({
									key: "executionId",
									value: "{executionListModel>id}",
									writeToDom: false
								})
							],
                        	press: function(oEvent){
                        		oController.onRunBtnPress(oEvent);
                        	}
                        }),
                        new sap.ui.core.Icon({
                        	src: sap.ui.core.IconPool.getIconURI('stop'),
                        	tooltip: 'Stop',
                        	size: '2em',
                        	visible: "{= ${executionListModel>state} === 'Running' ? true : false }",
                        	customData: [
								new sap.ui.core.CustomData({
									key: "executionId",
									value: "{executionListModel>id}",
									writeToDom: false
								})
							],
                        	press: function(oEvent){
                        		oController.onStopBtnPress(oEvent);
                        	}
                        }),
//                        new sap.m.Button({
//                        	text: "Run",
//                        	enabled: "{= ${executionListModel>state} === 'New' ? true : false }",
//                        	customData: [
//                        	     new sap.ui.core.CustomData({
//                                	key: "executionId",
//                                	value: "{executionListModel>id}",
//                                	writeToDom: false
//                                })
//                        	],
//                        	press: function(oEvent){
//                        		oController.onRunBtnPress(oEvent);
//                        	}
//                        }),
                        new sap.ui.core.Icon({
                        	src: sap.ui.core.IconPool.getIconURI('notes'),
                        	tooltip: 'Log',
                        	size: '2em',
                        	visible: "{= ${executionListModel>state} === 'New' ? false : true}",
                        	customData: [
								new sap.ui.core.CustomData({
									key: "executionId",
									value: "{executionListModel>id}",
									writeToDom: false
								})
							],
                        	press: function(oEvent){
                        		oController.onLogBtnPress(oEvent);
                        	}
                          }),
//                        new sap.m.Button({
//                        	text: "Log",
//                        	enabled: "{= ${executionListModel>state} === 'New' ? false : true}",
//                        	customData: [
//                        	     new sap.ui.core.CustomData({
//                                	key: "executionId",
//                                	value: "{executionListModel>id}",
//                                	writeToDom: false
//                                })
//                        	],
//                        	press: function(oEvent){
//                        		oController.onLogBtnPress(oEvent);
//                        	}
//                        }),
	                      new sap.ui.core.Icon({
	                      	src: sap.ui.core.IconPool.getIconURI('time-entry-request'),
	                      	tooltip: 'Duration',
	                      	size: '2em',
	                      	visible: "{= ${executionListModel>state} === 'Finished' ? true : false}",
	                      	customData: [
								new sap.ui.core.CustomData({
									key: "executionId",
									value: "{executionListModel>id}",
									writeToDom: false
								})
							],
	                      	press: function(oEvent){
	                      		oController.onDurationBtnPress(oEvent);
	                      	}
                        }),
//                        new sap.m.Button({
//                        	text: "Duration",
//                        	enabled: "{= ${executionListModel>state} === 'Finished' ? true : false}",
//                        	customData: [
//                        	     new sap.ui.core.CustomData({
//                                	key: "executionId",
//                                	value: "{executionListModel>id}",
//                                	writeToDom: false
//                                })
//                        	],
//                        	press: function(oEvent){
//                        		oController.onDurationBtnPress(oEvent);
//                        	}
//                        }),
	                      new sap.ui.core.Icon({
		                      	src: sap.ui.core.IconPool.getIconURI('outbox'),
		                      	tooltip: 'Export',
		                      	size: '2em',
		                      	visible: "{= ${executionListModel>state} === 'New' ? true : false}",
		                      	customData: [
									new sap.ui.core.CustomData({
										key: "executionId",
										value: "{executionListModel>id}",
										writeToDom: false
									})
								],
		                      	press: function(oEvent){
		                      		oController.onExportBtnPress(oEvent);
		                      	}
	                        }),
//                        new sap.m.Button({
//                        	text: "Export",
//                        	enabled: "{= ${executionListModel>state} === 'New' ? true : false}",
//                        	customData: [
//                        	     new sap.ui.core.CustomData({
//                                	key: "executionId",
//                                	value: "{executionListModel>id}",
//                                	writeToDom: false
//                                })
//                        	],
//                        	press: function(oEvent){
//                        		oController.onExportBtnPress(oEvent);
//                        	}
//                        }),
                      new sap.ui.core.Icon({
	                      	src: sap.ui.core.IconPool.getIconURI('inbox'),
	                      	tooltip: 'Import',
	                      	size: '2em',
	                      	visible:  "{= ${executionListModel>state} === 'New' ? true : false}",
	                      	customData: [
								new sap.ui.core.CustomData({
									key: "executionId",
									value: "{executionListModel>id}",
									writeToDom: false
								})
							],
	                      	press: function(oEvent){
	                      		oController.onImportBtnPress(oEvent);
	                      	}
                        })
//                        new sap.m.Button({
//                        	text: "Import",
//                        	enabled: "{= ${executionListModel>state} === 'New' ? true : false}",
//                        	customData: [
//                        	     new sap.ui.core.CustomData({
//                                	key: "executionId",
//                                	value: "{executionListModel>id}",
//                                	writeToDom: false
//                                })
//                        	],
//                        	press: function(oEvent){
//                        		oController.onImportBtnPress(oEvent);
//                        	}
//                        })			            
		            ]
                })
            },
            itemPress: function (oEvent) {
                oController.onItemPress(oEvent);
            }
        });

        //Page
        var page = new sap.m.Page(this.createId("page"), {
            title: "{i18n>executionListTitle}",
            subHeader: new sap.m.Toolbar({
                content: oSearchField
            }),
            content: [
                oTestRequestTable
            ],
            footer: new sap.m.Bar({
            	contentRight:[
            	    new sap.m.Button({
            	    	text: "New",
            	    	press: function(){
            	    		oController.onNew();
            	    	}
            	    })
      	         ]
            })
        })
        return page;
	}

});
