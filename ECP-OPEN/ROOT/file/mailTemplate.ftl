<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>北京毫米装饰</title>
		<style type="text/css">
			.mailHeader img {
				width: 80px;
				float: left;
			}
			.mailHeader h1 {
				text-align: center;
				font-size: 20px;
				padding-top: 10px;
				padding-right: 40px;
			}
			.mailHeader span {
				float: right;
			}
			table {
				border-spacing: 0;
				border-collapse: collapse;
				background-color: transparent;
			}
			.table1 td,
			.table2 td,
			.table2 th {
				border: 1px solid #333;
				height: 36px;
				line-height: 36px;
				font-size: 14px;
			}
			.productTr th,
			.productTr {
				text-align: center;
			}
			.table2 {
				margin-top: 20px;
			}
			.footerInfo {
				padding-left: 60%;
				padding-top: 10px;
			}
			.footerH {
				padding-top: 50px;
			}
			.productTr th,
			.productTr {
				text-align: center;
			}
			.auditInfo {
				width: 100%;
				padding-top: 20px;
				font-size: 14px;
			}
			.auditInfo p {
				width: 20%;
				display: inline;
				float: left;
			}
		</style>
	</head>
	<body>
		<div class="mailHeader">
			<h1>材料采购订单</h1>
			<span>订单编号：${billsn}</span>
		</div>
		<table style="width:100%;" class="table1">
			<tbody>
				<tr>
					<td width="50%" align="left">
						<span>采购方（甲方）</span>：
						<span>${company_name}</span>
					</td>
					<td width="50%" align="left">
						<span>供货方（乙方）：</span>
						<span>${customer_name}</span>
					</td>
				</tr>
				<tr>
					<td width="50%" align="left">
						<span>联系人：</span>
						<span>${head_name}</span>
					</td>
					<td width="50%" align="left">
						<span>联系人：</span>
						<span>${contacts_name}</span>
					</td>
				</tr>
				<tr>
					<td width="50%" align="left">
						<span>联系电话：</span>
						<span>${head_mobile}</span>
					</td>
					<td width="50%" align="left">
						<span>联系电话：</span>
						<span>${contacts_phone}</span>
					</td>
				</tr>
				<tr>
					<td colspan="5" align="left">
						<span>收货地址：</span>
						<span>${address}</span>
					</td>
				</tr>
			</tbody>
		</table>

		<table class="table2">
			<thead>
				<tr class="productTr">
					<th width="50px">序号</th>
					<th width="167px">编码</th>
					<th width="167px">名称</th>
					<th width="167px">品牌</th>
					<th width="167px">型号</th>
					<th width="167px">规格</th>
					<th width="167px">单位</th>
					<th width="167px">采购价</th>
					<th width="167px">数量</th>
					<th width="167px">金额</th>
					<th width="167px">包装规格</th>
					<th width="167px">备注</th>
				</tr>
			</thead>
			<tbody style="max-height:400px;">
				<#assign sum=0>
				<#list productlist as pro>
				<tr class="productTr">
					<td width="50px">${pro_index+1}</td>
					<td>${pro.billsn}</td>
					<td>${pro.product_name}</td>
					<td>${pro.brand!""}</td>
					<td>${pro.model!""}</td>
					<td>${pro.spec!""}</td>
					<td>${pro.unitname}</td>
					<td>${pro.sale_price}</td>
					<td>${pro.amount}</td>
					<td>${pro.amt}</td>
					<td>${pro.packformat!""}</td>
					<td>${pro.description!""}</td>
					<#if pro.amt??>
					<#assign sum=sum +pro.amt>
					</#if>
					</#list>
				</tr>
			</tbody>
			<tfoot>
				<tr>
					<td align="left" colspan="5"><b>合计：</b></td>
					<td colspan="8" align="center">${sum}</td>
				</tr>
			</tfoot>
		</table>
		<div>
			<p>备注：</p>
			<br>
			<p>下单日期：aaa<span style="padding-right:10%;float:right">供货周期：</span></p>
			<p class="footerInfo footerH">供货方签字：</p>
			<p class="footerInfo">日期：</p>
			<p class="footerInfo">盖章：</p>
		</div>
	</body>
</html>