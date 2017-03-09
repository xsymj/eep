package net.loyin.model.scm;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;

import net.loyin.jfinal.anatation.TableBind;

import com.jfinal.aop.Before;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.tx.Tx;
/**
 * 出入库单产品列表
 * @author 龙影
 */
@TableBind(name="scm_storage_bill_list")
public class StorageBillList extends Model<StorageBillList> {
	private static final long serialVersionUID = 5708102282757729482L;
	public static final String tableName="scm_storage_bill_list";
	public static StorageBillList dao=new StorageBillList();
	@Before(Tx.class)
	public void insert(List<Map<String,Object>> list,String id){
		Db.update("delete from "+tableName+" where id=?",id);
		Object[][]paras=new Object[list.size()][4];
		int i=0;
		for (Map<String, Object> a : list) {
			paras[i][0] = id;
			paras[i][1] = a.get("product_id");
			if (StringUtils.isNotEmpty((String) a.get("amount")))
				paras[i][2] = Float.parseFloat((String) a.get("amount"));
			paras[i][3] = a.get("remark");
			i++;
		}
		Db.batch("INSERT INTO "+tableName+"(id,product_id,amount,remark)VALUES (?,?,?,?)",paras,list.size());
	}
	public List<StorageBillList> list(String id){
		return this.find("select t.*,p.name product_name,p.purchase_price,p.sale_price,p.packformat,p.unit,sp.name unit_name,p.brand,p.billsn,p.model,"
				+ "p.spec from scm_storage_bill_list t left join scm_product p on t.product_id=p.id "
				+ "left join sso_parame sp on p.unit=sp.id where t.id=?",id);
	}
}
