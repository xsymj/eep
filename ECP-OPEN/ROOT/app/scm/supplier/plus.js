
var api = frameElement.api,
    arr = [],
    oper = api.data.oper,
    id=api.data.id,
    url=rootPath+"/crm/customer",
    $_form=$("#base_form");
    var ok = rootPath + '/scm/customer';
var model = avalon.define({
    $id:'plus',
    data:{},
    contacts: {},
    tabActive:0,
    product: [],
    arr: [],
    selected: [],
    showTab:function(i,b){
        model.tabActive=i;
    },
    f1: function() {
        var product = [];
        for(var i=0; i<model.arr.length; i++){
            var product_item = { id: model.arr[i] };
            product.push(product_item)
        }
        var postData = JSON.stringify({customer_id: model.data.id, products: product });
        Public.ajaxPost(url + '/customProductSave.json', {data: postData}, function (data) {
            console.log(data);
            console.log('555')
            parent.parent.Public.tips({
                type : 0,
                content :  "操作成功"
            });
        }, function (data) {
            console.log(data);
            parent.parent.Public.tips({
                type : 1,
                content :  "操作失败"
            });
        });
    },
    pushArr: function(v) {
        console.log(v);
        if(model.arr.indexOf(v.value) <0 ){
            model.arr.push(v.value);
        } else {
            var index = model.arr.indexOf(v.value);
            model.arr.splice(index, 1);
        }
    }
});

var handle = {
    initData: function () {
        console.log('init');
        this.getData();
        this.initBtn();
        //this.addCheckBox();
    },
    getData: function(){
        Public.ajaxPost(url+"/qryOp.json", {id:id}, function(json){
            if(json.status==200) {
                model.data=json.data.customer;
                if(model.data.head_id==undefined){
                    model.data.head_id="";
                    model.data.head_name="";
                }
                Public.ajaxPost(rootPath+"/scm/product/dataGrid.json",{
                    type: 1,
                    customer_id: id
                }, function(json){
                    console.log(json.data);
                    model.product = json.data;
                    json.data.forEach(function(item){
                        if(item.seclect_id == 1){
                        	console.log('yes');
                            model.arr.push(item.id);
                        }
                    });
                    console.log('sss');
                    console.log(model.arr);
                });
            } else {
                parent.Public.tips({type: 1, content : json.msg});
            }
        });
    },
    initBtn:function(){
        console.log(api.data.oper);
        var e = "add" ==  api.data.oper ? [ "<i class='fa fa-save mrb'></i>保存", "关闭" ] : [ "<i class='fa fa-save mrb'></i>确定", "取消" ];
        api.button({
            id : "confirm",
            name : e[0],
            focus : !0,
            callback : function() {
                //alert('post data');
                model.f1();
                //$_form.trigger("validate");
                return false
            }
        }, {
            id : "cancel",
            name : e[1]
        })
    },
    addCheckBox : function () {

    }
};

handle.initData();
