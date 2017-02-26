sap.ui.define([
	"sme/perf/ui/controller/BaseController",
	"sap/m/MessageBox"
], function (BaseController, MessageBox) {
	"use strict";
	return BaseController.extend("sme.perf.ui.controller.ExecutionGroupDetail", {
		
		mExecutionGroupModel: new sap.ui.model.json.JSONModel(),
		
		onInit: function () {
			this.getRouter().getRoute("executiongroupdetail").attachMatched(this.onRouteMatched, this);
		},
		onRouteMatched: function(oEvent){
			var oArgs = oEvent.getParameter("arguments");
			var oView = this.getView();
			oView.setModel(this.mExecutionGroupModel, "executionGroupModel");
			if(oArgs.executionGroupId){
				this.getExecutionGroup(oArgs.executionGroupId);
			}
		},
		getExecutionGroup: function(executionGroupId){
			var that = this;
			$.ajax({
				url: this.getServiceUrl("/ExecutionGroup/Get/") + executionGroupId,
				type: 'GET',
				contentType: 'application/json',
				success: function(result){
					that.mExecutionGroupModel.setData(result);
				},
				error: function(msg){
					MessageBox.error("Error resposne from server!", {
						title: "Error",
						actions:[MessageBox.Action.OK],
						defaultAction: MessageBox.Action.OK,
						details: JSON.stringify(msg, null, 4)
					});
				}
			});
		},
		onSave: function(oEvent){
			var that = this;
			var oData = this.mExecutionGroupModel.getData();
			if(oData.id){	//have id, then update
				$.ajax({
					url: this.getServiceUrl("/ExecutionGroup/Update/"),
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify(oData),
					success: function(result){
						that.mExecutionGroupModel.setData(result);
						that.showMessage("Saved");
					},
					error: function(msg){
						MessageBox.error("Error resposne from server!", {
							title: "Error",
							actions:[MessageBox.Action.OK],
							defaultAction: MessageBox.Action.OK,
							details: JSON.stringify(msg, null, 4)
						});
					}
				});
			}
			else{	//id is null, then add a new one
				$.ajax({
					url: this.getServiceUrl("/ExecutionGroup/Add/"),
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify(oData),
					success: function(result){
						that.mExecutionGroupModel.setData(result);
					},
					error: function(msg){
						MessageBox.error("Error resposne from server!", {
							title: "Error",
							actions:[MessageBox.Action.OK],
							defaultAction: MessageBox.Action.OK,
							details: JSON.stringify(msg, null, 4)
						});
					}
				});
			}
		},
		onDuplicate: function(oEvent){
			var that = this;
			var oData = this.mExecutionGroupModel.getData();
			if(oData.id){	//have id, then update
				$.ajax({
					url: this.getServiceUrl("/ExecutionGroup/Duplicate/")+oData.id,
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify(oData),
					success: function(result){
						that.mExecutionGroupModel.setData(result);
						that.showMessage("Duplicated");
					},
					error: function(msg){
						MessageBox.error("Error resposne from server!", {
							title: "Error",
							actions:[MessageBox.Action.OK],
							defaultAction: MessageBox.Action.OK,
							details: JSON.stringify(msg, null, 4)
						});
					}
				});
			}
			else{	//id is null, then add a new one
				this.showMessage("Save it before duplicate.");
			}
		}
	});
});
