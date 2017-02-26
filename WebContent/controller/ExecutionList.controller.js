sap.ui.define([
	"sme/perf/ui/controller/BaseController",
	"sap/m/MessageBox"
], function (BaseController, MessageBox) {
	"use strict";
	return BaseController.extend("sme.perf.ui.controller.ExecutionList", {
		
		_mExecutionListModel: new sap.ui.model.json.JSONModel(),
		
		onInit: function () {
			this.getRouter().getRoute("executionlist").attachMatched(this.onRouteMatched, this);

		},
		onRouteMatched: function(oEvent){
			var oView = this.getView();
			this._mScenarioListModel = new sap.ui.model.json.JSONModel();
			oView.setModel(this._mExecutionListModel, "executionListModel");
			
			var oArgs = oEvent.getParameter("arguments");
			this.refresh();
		},
		onNew: function(){
			this.getRouter().navTo("executiondetail");
		},
		onItemPress: function(oEvent){
			var executionId = oEvent.getParameters().listItem.getBindingContext("executionListModel").getProperty("id");
			this.getRouter().navTo("executiondetail", {executionId: executionId});
		},
		refresh: function(clearHistory){
			var that=this;
	        clearHistory = (typeof clearHistory !== 'undefined') ? clearHistory : false;
	        if (clearHistory) {
	            this.getView().byId("table").getBinding("items").filter()
	        }
	        else {
				$.ajax({
					url: this.getServiceUrl('/Execution/List'),
					type: 'GET',
					contentType: 'application/json; charset=utf-8',
					success: function(result){
						that._mExecutionListModel.setData(result);
					},
					error: function(msg){
						MessageBox.error("Error resposne from server!", {
							title: "Error",
							actions:[MessageBox.Action.OK],
							defaultAction: MessageBox.Action.OK,
							details: JSON.stringify(msg, null, 4)
						});
					},
					beforeSend: function(){
						that.getView().setBusy(true);
					},
					complete: function(){
						that.getView().setBusy(false);
					}
				});
	        }
		},
		search: function(values){
			var that = this;
	        var filters = [];
	        for (var i = 0; i < values.length; i++) {
	            filters.push(that.createFilter(values[i]));
	        }
	        that.getView().byId("table").getBinding("items").filter(new sap.ui.model.Filter({ filters: filters, and: true }));
		},
	    createFilter: function (keyword) {
	        var keywordAsNumber = parseInt(keyword);
	        var filters = [
	            new sap.ui.model.Filter("name", sap.ui.model.FilterOperator.Contains, keyword)
	        ];
	        if (!isNaN(keywordAsNumber)) {
	            filters.push(new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.EQ, keywordAsNumber));
	        };
	        return new sap.ui.model.Filter({
	            filters: filters,
	            and: false
	        });
	    },
	    onRunBtnPress: function(oEvent){
    		var that = this;
    		var customDataList = oEvent.getSource().getCustomData();
    		var executionId = 0;
	    	for(var i=0 ; i<customDataList.length ; i++){
	    		var customData = customDataList[i];
	    		if(customData.getKey() == 'executionId'){
	    			executionId = customData.getValue();
	    			break;
	    		}
	    	}
    		sap.m.MessageBox.confirm("Do you confirm to run the execution?", {
    			onClose: function(oAction){
    				if(oAction == sap.m.MessageBox.Action.OK){
    					that.runExecution(executionId);
    				}
    			}
    		});
	    },
	    onLogBtnPress: function(oEvent){
    		var that = this;
    		var customDataList = oEvent.getSource().getCustomData();
    		var executionId = 0;
	    	for(var i=0 ; i<customDataList.length ; i++){
	    		var customData = customDataList[i];
	    		if(customData.getKey() == 'executionId'){
	    			executionId = customData.getValue();
	    			break;
	    		}
	    	}
			var oLogUrl = this.getServiceUrl('/Download/ExcutionLog/') + executionId;
			window.open(oLogUrl);
	    },
	    runExecution: function(executionId){
			if(executionId == 0){
				return;
			}
			var that = this;
			$.ajax({
				url: this.getServiceUrl("/Execution/Run/")+executionId,
				type: 'GET',
				contentType: 'application/json;charset=utf-8',
				success: function(result){
					var oData = that._mExecutionListModel.getData();
					if(oData && oData.length > 0){
						for(var i=0 ; i<oData.length ; i++){
							if(oData[i].id == result.id){
								oData[i] = result;
							}
						}
					}
					that._mExecutionListModel.setData(oData);
				},
				error: function(msg){
					MessageBox.show("Error resposne from server!", {
						icon: MessageBox.Icon.ERROR,
						title: "Error",
						actions:[MessageBox.Action.OK],
						defaultAction: MessageBox.Action.OK,
						details: JSON.stringify(msg, null, "\t")
					});
				}
			});
	    },
	    onExportBtnPress: function(oEvent){
    		var that = this;
    		var customDataList = oEvent.getSource().getCustomData();
    		var executionId = 0;
	    	for(var i=0 ; i<customDataList.length ; i++){
	    		var customData = customDataList[i];
	    		if(customData.getKey() == 'executionId'){
	    			executionId = customData.getValue();
	    			break;
	    		}
	    	}
			var oLogUrl = this.getServiceUrl('/Download/ExecutionExport/') + executionId;
			window.open(oLogUrl);
	    },
	    onImportBtnPress: function(oEvent){
    		var that = this;
    		var customDataList = oEvent.getSource().getCustomData();
    		var executionId = 0;
	    	for(var i=0 ; i<customDataList.length ; i++){
	    		var customData = customDataList[i];
	    		if(customData.getKey() == 'executionId'){
	    			executionId = customData.getValue();
	    			break;
	    		}
	    	}
			var oUploadUrl = this.getServiceUrl('/UploadExecutionResult.html/?executionId=') + executionId;
			window.open(oUploadUrl);
	    },
	    onDurationBtnPress: function(oEvent){
    		var customDataList = oEvent.getSource().getCustomData();
    		var executionId = 0;
	    	for(var i=0 ; i<customDataList.length ; i++){
	    		var customData = customDataList[i];
	    		if(customData.getKey() == 'executionId'){
	    			executionId = customData.getValue();
	    			break;
	    		}
	    	}
			if(0 != executionId){
				this.getRouter().navTo("executionrundetail", {executionId: executionId});
			}			
	    }
	});
});
