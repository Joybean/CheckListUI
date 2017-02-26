sap.ui.define([
	"sme/perf/ui/controller/BaseController",
	'sap/m/UploadCollectionParameter',
	'sap/m/MessageToast',
	"sap/m/MessageBox"
], function (BaseController, UploadCollectionParameter, MessageToast, MessageBox) {
	"use strict";
	return BaseController.extend("sme.perf.ui.controller.TestRequestAttachment", {
		
		mAttachmentModel: new sap.ui.model.json.JSONModel(),
		
		onInit: function () {
			this.getRouter().getRoute("testrequestattachment").attachMatched(this.onRouteMatched, this);
		},
		
		onRouteMatched: function(oEvent){
			var oArgs = oEvent.getParameter("arguments");
			var oRequestId = oArgs.requestId;
			var oView = this.getView();
			oView.setModel(this.mAttachmentModel, "attachmentModel");
			this.mAttachmentModel.setData({testRequestId: oRequestId});
			this.initAttachmentList();
		},
		
		initAttachmentList: function(){
			var that = this;
			$.ajax({
				url: that.getServiceUrl("/TestRequestAttachment/List/") + that.mAttachmentModel.getData().testRequestId,
				type: 'GET',
				contentType: 'application/json; charset=utf-8',
				success: function(result){
					var oData = that.mAttachmentModel.getData();
					oData.attachmentList = result;
					that.mAttachmentModel.setData(oData);
				},
				error: function(msg){
					MessageBox.error("Error resposne from server!", {
						title: "Error",
						actions:[MessageBox.Action.OK],
						defaultAction: MessageBox.Action.OK,
						details: JSON.stringify(msg, null, 4)
					});
				}
			})
		},
		onItemPress: function(oEvent){
			var oAttachment = oEvent.getParameters().listItem.getBindingContext("attachmentModel").getObject();
			var oAttachmentUrl = this.getServiceUrl('/Download/Attachment/?requestId=') +  
				+ oAttachment.testRequestId + '&fileName=' + oAttachment.fileName;
			window.open(oAttachmentUrl);
		},
		onNew: function(oEvent){
			var oUploadUrl = this.getServiceUrl('/UploadAttachment.html/?requestId=') + this.mAttachmentModel.getData().testRequestId;
			window.open(oUploadUrl);
		},
		onRefresh: function(oEvent){
			this.initAttachmentList();
		}
	});
});
