var api = frameElement.api,oper = api.data.oper,id=api.data.rowId,
    url=rootPath+ "/scm/product",
    $_form=$("#base_form"),
    addNew=false;
var model = avalon.define({
	$id:'view',
	data:{id:"", page: '', rowNum: '',category_type:"", category_m: "", len: "",kuan: "",heigh: "",category:"",category_name:"",category_namea:"",name:"",billsn:"",stock_warn:0,model:"",status:1, material: 1,unit:"",unit_name:"",sale_price:0,purchase_price:0,remark:"",brand:"",spec:"",weight:"",moq:"",cycle:"",expired:"",expiredremind:"",packunit:"",packunit_name:"",packformat:"",lwh:"",sellpoint:"",imgurl:"",customer_id:"",customer_name:""},
    showPrice: null,
    selectM: function (v) {
        Public.ajaxPost(url + "/catory_b.json", {id: v}, function (data) {
            //console.log(data);
        }, function (data) {
            //console.log(data)
        } )
    },
    setStatus:function(v){
		model.data.status=v;
	},
    setMaterial: function (v) {
    	console.log(v);
        model.data.category_type = v;
        if(v == 0){
            model.showPrice = false;
        } else {
            model.showPrice = true;
        }
    },
	init:function(){
		model.data={id:"", category_type:"", len: "" ,kuan: "",heigh: "",category:"",category_name:"",category_namea:"",name:"",billsn:"",stock_warn:0,model:"",material: 1,status:1,unit:"",unit_name:"",sale_price:0,purchase_price:0,remark:"",brand:"",spec:"",weight:"",moq:"",cycle:"",expired:"",expiredremind:"",packunit:"",packunit_name:"",packformat:"",lwh:"",sellpoint:"",imgurl:"",customer_id:"",customer_name:""};
	},

	customerList:[],custComboV:false,
	chooseCust:function(e){
    	model.data.customer_id=e.id;
    	model.data.customer_name=e.name;
    	model.custComboV=false;
    },
    qryCustomer:function(v){//自动完成查询客户
    	model.custComboV=true;
    	Public.ajaxPost(rootPath+"/crm/customer/dataGrid.json",{keyword:v,_sortField:"realname",_sort:"asc",type:0},function(json){
    		model.customerList=json.data.list;
    	});
    },
    s11: function(){
        var m = $("#category_m");
        var s = m.val();
        //console.log(s);
        Public.comboTree(m,{offset:{top:0,left:518},url:url+'/catory_b.json', postData:{id: s, ok: 2},
            callback:{
                beforeClick : function(e, t) {
                    m.val(t.name);
                    model.data.category= t.id;
                    model.data.categor_m = t.id;
                    m.hide();
                }
            }
        });
        //THISPAGE.initEvent();
    }
});
model.data.$watch("$all",function(name,a,b){
	if(a==null){
		model.data[name]="";
	}
});
var THISPAGE = {
	init : function() {

		this.initDom();
		this.initBtn();
	},
	initDom : function() {
		if(id!=undefined&&id!=''&&id!='undefined'){
			Public.ajaxPost(rootPath+"/scm/product/qryOp.json",{id:id}, function(json){
				if(json.status==200){
					console.log(200);
                    console.log(json);
					avalon.mix(model.data,json.data);
					model.data.unit_name=parent.parent.SYSTEM.custParame[json.data.unit].name;
					model.data.packunit_name= json.data.moq;
					model.data.category_name=parent.parent.SYSTEM.custParame[json.data.category].name;
					model.data.category_namea=parent.parent.SYSTEM.custParame[json.data.category_m].name;
					model.data.category_type = json.data.category_type;
					THISPAGE.initEvent();
				}else{
					parent.Public.tips({type: 1, content : json.msg});
				}
			});
		}else{
			THISPAGE.initEvent();
		}
		$("#upfile_btn").uploadify({
			height        : 30,
			swf           : rootPath+'/assets/js/plugins/uploadify/uploadify.swf',
			uploader      : rootPath+'/file/up',
			width         : 220,
			buttonText:'上传图片',//浏览文件',
			fileTypeDesc   : '支持格式:jpg/gif/jpeg/png/bmp.',
		    fileTypeExts: '*.jpg;*.gif;*.jpeg;*.png;*.bmp',//允许的格式
			onUploadSuccess:function(file, data, response) {
				eval("var json="+data+";");
				if(json.error==0){
					$("#imgurl").val(json.url);

				}else{
					parent.parent.Public.tips({
						content :json.msg ,type:1
					});
				}
			}
		});
	},
	initBtn:function(){
		var e = "add" ==  api.data.oper ? [ "<i class='fa fa-save mrb'></i>保存", "关闭" ] : [ "<i class='fa fa-save mrb'></i>确定", "取消" ];
		api.button({
			id : "confirm",
			name : e[0],
			focus :true,
			callback : function() {
				addNew=false;
				$_form.trigger("validate");
				return false
			}
		}, {
			id : "saveAndNew",
			name : "<i class='fa fa-save mrb'></i>保存并新建",
			focus :false,
			callback : function() {
				$_form.trigger("validate");
				addNew=true;
				return false
			}
		}, {
			id : "cancel",
			name : e[1]
		})
	},
	initEvent:function(){
		/**类别combo START*/
		var r = $("#category_sel");
		var i=Public.comboTree(r,{offset:{top:0,left:124},url:rootPath+'/scm/product/catory_b.json',postData:{type:0},
				callback:{
					beforeClick : function(e, t) {
                        
                        $("#category_m").val(t.id);
						r.val(t.name);
                        model.data.category= t.id;
                        //model.data.categor_m = t.id;
                        i.hide();
                        Public.ajaxPost(url+"/catory_b.json",{id: model.data.category},function(json){
                            console.log('json'+JSON.stringify(json));
                            var m = $("#category_sela");
                            var n=Public.comboTree(m,{offset:{top:0,left:518},url:url+'/catory_b.json', postData: { id: json.data[0].parent_id },
                                callback:{
                                    beforeClick : function(e, t) {
                                    
                                        m.val(t.name);
//                                        model.data.category= t.id;
                                        model.data.category_m = t.id;
//                                        model.data.category_name = t.name;
                                        n.hide();
                                        $('.comboDiv').hide();
                                    }
                                }
                            });

                        });
					}
				}
			});


		
		/**类别combo END*/
		/**计量单位combo START*/
		var r1 = $("#unit_sel");
		var i1=Public.comboTree(r1,{offset:{top:0,left:94},url:rootPath+'/sso/parame/tree.json',postData:{type:1},
					callback : {
						beforeClick : function(e, t) {
							r1.val(t.name);model.data.unit=t.id;i1.hide();
						}
					}
				});
        //anxu
		//var r2 = $("#unit_sel2");
		//var i2=Public.comboTree(r2,{offset:{top:0,left:100},url:rootPath+'/sso/parame/tree.json',postData:{type:1},
		//			callback : {
		//				beforeClick : function(e, t) {
		//					r2.val(t.name);model.data.packunit=t.id;i2.hide();
		//				}
		//			}
		//		});
		/**计量单位combo END*/
		this.initValidator();
	},
	initValidator:function() {
		$_form.validator({
			messages : {
				required : "请填写{0}"
			},
			display : function(e) {
				return $(e).closest(".row-item").find("label").text()
			},
			valid : function() {
				postData();
			},
			ignore : ":hidden",
			theme : "yellow_bottom",
			timely : 1,
			stopOnError : true
		});
	}
};
function postData(){
	var e = "add" == oper ? "新增商品" : "修改商品";
	if(model.data.category=="")
	{
		parent.parent.Public.tips({type : 1,content : "类别未选择！"});
		return;
	}
	if(model.data.unit=="")
	{
		parent.parent.Public.tips({type : 1,content : "计量单位未选择！"});
		return;
	}
	Public.ajaxPost(rootPath+"/scm/product/save.json",model.data.$model, function(t) {
		if (200 == t.status) {
			parent.parent.Public.tips({
				content : e + "成功！"
			});
			if(addNew){
				model.init();
			}else{
				model.data.id=t.data.id;
				model.data.billsn=t.data.sn;
			}
            //anxu
            parent.THISPAGE.reloadData(
                {
                    sortname : "update_time",
                    sortorder : "desc"
                }
            );
            //parent.THISPAGE.loadGrid();
		} else
			parent.parent.Public.tips({
				type : 1,
				content : e + "失败！" + t.msg
			});
	});
}



THISPAGE.init();