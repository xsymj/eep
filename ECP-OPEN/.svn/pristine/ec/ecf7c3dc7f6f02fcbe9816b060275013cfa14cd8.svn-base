package net.loyin.ctrl.crm;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.loyin.ctrl.AdminBaseController;
import net.loyin.jfinal.anatation.PowerBind;
import net.loyin.jfinal.anatation.RouteBind;
import net.loyin.model.crm.Contacts;
import net.loyin.model.crm.Customer;
import net.loyin.model.crm.CustomerData;
import net.loyin.model.crm.CustomerRecord;
import net.loyin.model.crm.CustomerService;
import net.loyin.model.sso.Parame;
import net.loyin.model.sso.SnCreater;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.jfinal.plugin.activerecord.Page;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.upload.UploadFile;
/**
 * 客户服务管理
 * @author 龙影
 */
@RouteBind(path="custService",sys="客户",model="客户服务")
public class CustServiceCtrl extends AdminBaseController<CustomerService> {
	public CustServiceCtrl(){
		this.modelClass=CustomerService.class;
	}
	public void dataGrid() {
		Map<String,Object> filter=new HashMap<String,Object>();
		filter.put("keyword",this.getPara("keyword"));
		filter.put("start_date",this.getPara("start_date"));
		filter.put("end_date",this.getPara("end_date"));
		this.sortField(filter);
		Page<CustomerService> page = CustomerService.dao.pageGrid(getPageNo(), getPageSize(),filter,this.getParaToInt("qryType",0));
		this.rendJson(true,null, "success", page);
	}
	public void qryOp() {
		getId();
		Map<String,Object> data=new HashMap<String,Object>();
		CustomerService cs=CustomerService.dao.findById(id);
		if (cs != null){
			data.put("customer", cs);
			this.rendJson(true,null, "",data);
		}
		else
			this.rendJson(false,null, "记录不存在！");
	}
	@PowerBind(code="A1_1_E",funcName="编辑")
	public void save() {
		try {
			CustomerService po = (CustomerService) getModel();
			if (po == null) {
				this.rendJson(false,null, "提交数据错误！");
				return;
			}
			Date date=new Date();
			String now=dateTimeFormat.format(date);
			po.put("update_datetime",now);//修改时间
			po.put("create_datetime",now);//创建时间
			po.put("state", 1);
			getId();
			if (StringUtils.isEmpty(id)) {
				po.save();
			}else {
				po.update();
			}
			Map<String,String> d=new HashMap<String,String>();
			d.put("id",id);
			this.rendJson(true,null, "操作成功！",d);
		} catch (Exception e) {
			log.error("保存服务订单异常", e);
			this.rendJson(false,null, "保存数据异常！");
		}
	}
	@PowerBind(code="A1_1_E",funcName="删除")
	public void del() {
		try {
			getId();
			CustomerService.dao.del(id);
			rendJson(true,null,"删除成功！",id);
		} catch (Exception e) {
			log.error("删除异常", e);
			rendJson(false,null,"删除失败！请检查是否被使用！");
		}
	}
	
	
	
}
