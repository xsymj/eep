package net.loyin.model.crm;

import com.jfinal.plugin.activerecord.Model;

import net.loyin.jfinal.anatation.TableBind;

@TableBind(name="scm_customer_product")
public class CustomerProduct extends Model<CustomerProduct> {
	private static final long serialVersionUID = -1974122280599644721L;
	public static final String tableName="crm_customer_product";
	public static CustomerProduct dao = new CustomerProduct();
	
}
