var url=rootPath+ "/crm/custService", gridQryUrl = url+"/dataGrid.json",type=["供应商","企业","个人","经销商"];
var model = avalon.define({$id:'view',
	query:{
		keyword:"",start_date:SYSTEM.beginDate,end_date:SYSTEM.endDate,type:-1,qryType:-1,status:0,is_deleted:0,record:"",uid:""
	},expoutUrl:"",
	fastQryText:"快速查询",
	fastQry:[
	       {text:"我创建的",sl:false},
	       {text:"我负责的",sl:false},
	       {text:"下属创建的",sl:false},
	       {text:"下属负责的",sl:false},
	       {text:"",sl:true},
	       {text:"一周未跟进",sl:false},
	       {text:"半月未跟进",sl:false},
	       {text:"一直未跟进",sl:false},
	       {text:"",sl:true},
	       {text:"已购买",sl:false},
	       {text:"未购买",sl:false}],
	showMenu:function(code){
		return SYSTEM.rights[code]==true;
	},
	
	reloadData:function() {
		$("#grid").jqGrid("setGridParam", {
			url:gridQryUrl,
			datatype:"json",mtype:'POST',
			postData:model.query.$model
		}).trigger("reloadGrid");
	},
	resetQry:function(){
		model.query={keyword:"",start_date:SYSTEM.beginDate,end_date:SYSTEM.endDate,status:"",ordertype:type};
		model.reloadData();
	},
	qry:function(type){
		model.query.qryType=type;
		if(type==100){
			model.query.is_deleted=1;
			model.fastQryText="回收站";
		}else{
			model.fastQryText=model.fastQry[type].text;
			model.query.is_deleted=0;
		}
		THISPAGE.reloadData();
	},
	init:function(){
		model.query={
				keyword:"",start_date:SYSTEM.beginDate,end_date:SYSTEM.endDate,type:-1,qryType:-1,status:0,is_deleted:0,uid:""
		};
        $(".ui-datepicker-input").datepicker();
	},
});
var THISPAGE = {
	init:function() {
		this.loadGrid();
		this.addEvent();
		model.init();
	},
	view:function(id) {
		$.dialog({
			id:"moreCon",
			width:850,
			height:600,
			min:true,
			max:true,
			title:"查看客户",
			button:[ {
				name:"关闭"
			} ],
			resize:true,
			lock:true,
			content:"url:" + url + "/view",
			data:{
				id:id
			}
		});
	},
	loadGrid:function() {
		function t(val, opt, row) {
			if(row.state==1){
				var html_con = '<div class="operating" data-id="'
					+ row.id
					+ '"><span class="fa fa-eye mrb" title="查看"></span><span class="fa fa-trash-o mrb" title="删除"></span>'+(row.is_deleted==1?'<span class="fa fa-reply mrb" title="恢复" ></span>':'')+'</div>';
			}
			else{
				var html_con = '<div class="operating" data-id="'
					+ row.id
					+ '"><span class="fa fa-eye mrb" title="查看"></span><span class="fa fa-trash-o mrb" title="删除"></span><span class="fa fa-deal mrb" title="修改">处理</span>'+(row.is_deleted==1?'<span class="fa fa-reply mrb" title="恢复" ></span>':'')+'</div>';
			}
			
			
			return html_con;
		}
		function fmtAmt(v) {
			return Public.numToCurrency(v);
		}
		var i = Public.setGrid();
		$("#grid").jqGrid({
			url:gridQryUrl,
			postData:model.query.$model,
			datatype:"json",
			mtype:'POST',
			autowidth:true,
			height:i.h,
			altRows:true,
			gridview:true,
			rownumbers:true,
			multiselect:true,
			multiboxonly:true,
			colModel:[ {
				name:"operating",
				label:"操作",
				fixed:true,
				width:100,
				formatter:t,
				align:"center",
				title:false
			}, {
				name:"state",hidden:type==4,//报价单
				label:"订单状态",sortable:true,
				align:"center",formatter:function(v){var state_=["<font color='red'>未处理</font>","<font color='green'>已处理</font>","已处理"];return state_[v];},
				width:100,sortable:true,
				title:false
			},{
				name:"name",
				label:"姓名",
				align:"center",
				width:100,
				sortable:true,
				title:true
			}, {	
				name:"telephone",
				label:"联系电话",
				align:"center",
				width:100,
				sortable:true,
				title:true
			}, {
				name:"address",
				label:"住址",
				align:"center",
				width:100,sortable:true,
				title:true
			}, {
				name:"create_datetime",
				label:"订单时间",
				align:"center",
				width:140,
				sortable:true,
				title:false
			}, {
				name:"product",
				label:"商品",
				align:"center",
				width:100,
				sortable:true,
				title:true
			}, {
				name:"record",
				label:"备注",
				align:"center",
				width:140,
				sortable:true,
				title:false
			} ],
			cmTemplate:{
				sortable:false,
				title:false
			},
			page:1,
			sortname:"sn",
			sortorder:"desc",
			pager:"#page",
			rowNum:50,
			rowList:[ 50, 100, 200 ],
			viewrecords:true,
			shrinkToFit:false,
			forceFit:false,
			jsonReader:{
				root:"data.list",
				records:"data.totalRow",
				repeatitems:false,
				id:"id"
			},
			loadError:function() {
				parent.Public.tips({
					type:1,
					content:"加载数据异常！"
				})
			},
			ondblClickRow:function(t) {
				$("#" + t).find(".fa-eye").trigger("click")
			}
		});
	},
	reloadData:function() {
		$("#grid").jqGrid("setGridParam", {
			url:gridQryUrl,
			datatype:"json",
			mtype:'POST',
			postData:model.query.$model
		}).trigger("reloadGrid");
	},
	addEvent:function() {
		var t = this;
		$(".grid-wrap").on("click", ".fa-eye", function(t) {
			t.preventDefault();
			var e = $(this).parent().data("id");
			THISPAGE.view(e);
		});
		$(".grid-wrap").on("click", ".fa-deal", function(e) {
			e.preventDefault();
			if (Business.verifyRight("TD_UPDATE")) {
				var t = $(this).parent().data("id");
				handle.operate("edit", t)
			}
		});
		$(".grid-wrap").on("click", ".fa-trash-o", function(t) {
			t.preventDefault();
			if (Business.verifyRight("BU_DELETE")) {
				var e = $(this).parent().data("id");
					handle.del(e);
			}
		});
		$(".grid-wrap").on("click", ".fa-reply", function(t) {
			t.preventDefault();
				var e = $(this).parent().data("id");
					handle.reply(e);
		});
		$("#search").click(function() {
			THISPAGE.reloadData()
		});
		$("#refresh").click(function() {                                                                                                                                                                                     
			model.init();
			THISPAGE.reloadData() 
		});
		$("#moreCon").click(function() {
			$.dialog({
				id:"moreCon",
				width:480,
				height:300,
				min:false,
				max:false,
				title:"高级搜索",
				button:[ {
					name:"<i class='fa fa-search'></i>查询",
					focus:true,
					callback:function() {
						THISPAGE.reloadData();
					}
				}, {
					name:"取消"
				} ],
				resize:false,
				content:"url:" + url + "/moreSearch",
				data:model.query.$model
			})
		});
		$("#add").click(function(t) {
			t.preventDefault();
			if (Business.verifyRight("TF_ADD")) {
				handle.operate('add');
			}
		});
		$("#btn-batchDel").click(function(e) {
			e.preventDefault();
			if (Business.verifyRight("BU_DELETE")) {
				var t = $("#grid").jqGrid("getGridParam", "selarrrow");
				if(t.length){
					if(model.query.qryType==100)
						handle.del(t.join());
					else
						handle.trash(t.join());
				}else
					parent.Public.tips({type:2,content:"请选择需要删除的客户"});
			}
		});
		$("#btn-batchAllot").click(function(e) {
			e.preventDefault();
			if (Business.verifyRight("BU_DELETE")) {
				var t = $("#grid").jqGrid("getGridParam", "selarrrow");
				if(t.length){
						handle.allot(t.join());
				}else
					parent.Public.tips({type:2,content:"请选择需要分配的客户"});
			}
		});
		$("#btn-batchReply").click(function(e) {
			e.preventDefault();
				var t = $("#grid").jqGrid("getGridParam", "selarrrow");
				if(t.length){
						handle.reply(t.join());
				}else
					parent.Public.tips({type:2,content:"请选择需要恢复的客户"});
		});
		$("#toPool").click(function(e) {
			e.preventDefault();
			if (Business.verifyRight("KH_TOPOOL")) {
				var t = $("#grid").jqGrid("getGridParam", "selarrrow");
				t.length ? handle.toPool(t.join()):parent.Public.tips({
					type:2,
					content:"请选择需要放入客户池的客户"
				})
			}
		});
		$(window).resize(function() {
			Public.resizeGrid()
		})
	}
};
var handle = {
	operate:function(e, t) {
		if ("add" == e)
			var i = "新增订单", r = {
				oper:e,
				callback:this.callback
			};
		else
			var i = "处理订单", r = {
				oper:e,
				id:t,
				callback:this.callback
			};
		$.dialog({
			title:i,
			content:"url:" + url + "/edit",
			data:r,
			width:850,
			height:600,
			max:true,
			min:false,
			cache:false,
			resize:true,
			lock:true
		})
	},
	del:function(e) {
		$.dialog.confirm("删除的客户将不能恢复，请确认是否删除？", function() {
			Public.ajaxPost(url + "/del.json", {
				id:e
			}, function(t) {
				if (t && 200 == t.status) {
					
					parent.Public.tips({
						type:2,
						content:t.msg
					});
					THISPAGE.reloadData();
				} else
					parent.Public.tips({
						type:1,
						content:"删除客户失败！" + t.msg
					})
			})
		})
	},
	toPool:function(e) {
		$.dialog.confirm("请确认是否放入客户池？", function() {
			Public.ajaxPost(url + "/toPool.json", {
				id:e
			}, function(t) {
				if (t && 200 == t.status) {
					
					parent.Public.tips({
						type:2,
						content:t.msg
					});
					THISPAGE.reloadData();
				} else
					parent.Public.tips({
						type:1,
						content:"批量放入客户池失败！" + t.msg
					})
			})
		})
	},
	reply:function(e) {
		Public.ajaxPost(url + "/reply.json", {id:e}, function(t) {
				if (t && 200 == t.status) {
					parent.Public.tips({type:2,content:t.msg});
					THISPAGE.reloadData();
				} else
					parent.Public.tips({type:1,content:"恢复客户失败！" + t.msg
					});
			});
	},
	trash:function(e) {
			Public.ajaxPost(url + "/trash", {id:e}, function(t) {
				if (t && 200 == t.status) {
					parent.Public.tips({type:2,content:t.msg});
					THISPAGE.reloadData();
				} else
					parent.Public.tips({type:1,content:"删除客户失败！" + t.msg});
			});
	},
	allot:function(id) {
		var uid="";
		$.dialog({
			title:"分配人员",
			content:'<b>分配给：</b><input type="text" class="ui-input" readonly="readonly" id="allotToUid">',
			init:function(){
				var r=$("#allotToUid");
				var i=Public.comboTree(r,{width:260,offset:{left:80},url:rootPath+'/sso/user/userTree.json?type=2',callback:{
					beforeClick:function(e, t) {
						if(t.type==10){
							r.val(t.name);uid=t.id;
							i.hide();
						}
					}}
				});
			},
			button:[{name:"确定",focus:true,callback:function(){
				if(uid==""){
					parent.Public.tips({type:1,content:"未选择分配人员！"});
					return false;
				}
				Public.ajaxPost(url + "/allot", {id:id,uid:uid,type:2}, function(t) {
					if (t && 200 == t.status) {
						parent.Public.tips({type:2,content:t.msg});
						THISPAGE.reloadData();
					} else
						parent.Public.tips({type:1,content:"分配客户失败！" + t.msg});
				});
			}},{name:"关闭"}],
			width:200,height:10,max:false,	min:false,resize:false});
	}
}
THISPAGE.init();