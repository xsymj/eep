var api = frameElement.api,
    oper = api.data.oper,
    id=api.data.id,
    custParame=SYSTEM.custParame,
    typeList=custParame.typeList,
    $_form=$("#base_form"),
    addNew=false,type=parent.type,
    billType=parent.billType;
    console.log(custParame);
var model = avalon.define({
    billType:billType,fillOrder:false,buyOrder:false,returnOrder:false,meterialOrder:false,transfersOrder:false,receiveOrder:false,saleOrder:false,salereturnOrder:false,
	$id:'ctrl',
    parameList:typeList,
    type:type,
	data:{
        id:"",
        creater_name: "",
        consignee_phone: "",
        consignee_name: "",
        address: "",
        agreement: "",
        is_deleted:0,
        submit_status:0,
        remark:"",
        order_id:'',
        ordersn:'',
        type:'',
        bill_date:SYSTEM.date,
        billsn:"自动生成",
        head_id:SYSTEM.user.id,
        head_name:SYSTEM.user.realname,
        depot_id:'',
        name:'',
        status:"",
        ordertype:type,
        start_date:"",
        end_date:"",
        sign_date:SYSTEM.date,
        delivery_date:SYSTEM.date,
        pact:"",
        audit_status:0,
        contacts_phone:"", contacts_id:"", contacts_name:"",
        customer_id:"",customer_name:"",
        productlistlength:1,
        rebate:0,
        rebate_amt:0,order_amt:0,
        productlist:[
            {
                amount:0,remark:'',
                amt: 0,description: "",specifications:"",pack:"",
                id: "",product_id: "",unit:"",
                brand:"",spec:"",billsn:"",packformat:"",
                product_name: "",model:"",purchase_price:0,quoted_price:0,
				sale_price:0,zhamt:0,zkl:0,tax_rate:0,tax:0
            }
        ]},
	depotList:[],
    totalAmount:0,nprint:true,
	sumzhamt:0,sumAmount:0,
    sumAmt:0,sumTax:0,sumPTax:0,
	userList:[],
	init:function(){
		//if(id!=undefined&&id!=''&&id!='undefined'){
        if(id){
            Public.ajaxPost(rootPath+"/scm/storageBill/qryOp.json",{id:id}, function(json){
                console.log(id);
                console.log(json);
                if(json.status==200){
                    avalon.mix(model.data,json.data);
                    //var sum = 0;
                    //json.data.productlist.forEach(function (item) {
                    //    sum += item.amount;
                    //});
                    //model.data.amount = sum;
                    if(model.data.productlistlength==undefined||model.data.productlistlength==0){
                        model.data.productlistlength=1;
                        model.data.productlist=[{amount:0,product_id: "",unit:"",product_name: ""}];
                    }
                    jisuan();
                }else{
                    parent.Public.tips({type: 1, content : json.msg});
                }
			});
		}
	},
	printRpt:function(){
		model.nprint=false;
		window.print();
		model.nprint=true;
	}
});

function jisuan(){//计算合计
	model.sumzhamt=0;
	model.sumAmount=0;
	model.sumAmt=0;
	model.sumTax=0;
	model.sumPTax=0;
	for(var i=0;i<model.data.productlist.length;i++){
		var el=model.data.productlist[i];
		model.sumzhamt=new Number(model.sumzhamt)+new Number(el.zhamt);
		model.sumAmount=new Number(model.sumAmount)+new Number(el.amount);
		//model.sumAmt=new Number(model.sumAmt)+new Number(el.amt);
        model.sumAmt+=new Number(el.sale_price)*new Number(el.amount);
        console.log(model.sumAmt);
		model.sumTax=new Number(model.sumTax)+new Number(el.tax);
	}
	model.sumPTax=model.sumAmt+model.sumTax;
};
model.data.$watch("type",function(a,b){
	if(a==0){
		model.buyOrder=true;
	}else{
		model.buyOrder=false;
	}
});
model.data.$watch("type",function(a,b){
	if(a==1){
		model.meterialOrder=true;
	}else{
		model.meterialOrder=false;
	}
});
model.data.$watch("type",function(a,b){
	if(a==2){
		model.transfersOrder=true;
	}else{
		model.transfersOrder=false;
	}
});
model.data.$watch("type",function(a,b){
	if(a==3){
		model.receiveOrder=true;
	}else{
		model.receiveOrder=false;
	}
});
model.data.$watch("type",function(a,b){
	if(a==4){
		model.saleOrder=true;
	}else{
		model.saleOrder=false;
	}
});
model.data.$watch("type",function(a,b){
	if(a==5){
		model.returnOrder=true;
	}else{
		model.returnOrder=false;
	}
});
model.data.$watch("type",function(a,b){
	if(a==6){
		model.salereturnOrder=true;
	}else{
		model.salereturnOrder=false;
	}
});
model.init();