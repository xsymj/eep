/**
 * 
 */
/**
 * @author xusiyuan
 *
 */
package util;

import java.util.HashMap;
import java.util.Map;

import com.jfinal.core.Controller;
import com.jfinal.render.JsonRender;
import com.taobao.api.ApiException;
import com.taobao.api.DefaultTaobaoClient;
import com.taobao.api.TaobaoClient;
import com.taobao.api.request.AlibabaAliqinFcSmsNumSendRequest;
import com.taobao.api.response.AlibabaAliqinFcSmsNumSendResponse;

import net.loyin.ctrl.BaseController;
import net.loyin.util.PropertiesContent;

public class MessageUtil extends Controller{
	
	public  void sendMessage(String phone){
		AlibabaAliqinFcSmsNumSendResponse rsp = new AlibabaAliqinFcSmsNumSendResponse();
		try {String url = PropertiesContent.get("sms.url").trim();
		String appkey = PropertiesContent.get("sms.appkey").trim();
		String secret = PropertiesContent.get("sms.secret").trim();
		String sms_free_sign_name  = PropertiesContent.get("sms_free_sign_name").trim();
		String sms_template_code = PropertiesContent.get("sms_template_code").trim();
		TaobaoClient client = new DefaultTaobaoClient(url, appkey, secret);
		AlibabaAliqinFcSmsNumSendRequest req = new AlibabaAliqinFcSmsNumSendRequest();
		req.setExtend("123456");
		req.setSmsType("normal");
		req.setSmsFreeSignName(sms_free_sign_name);
		req.setSmsParamString("{\"code\":\"1234\",\"product\":\"123123\"}");
		req.setRecNum(phone);
		req.setSmsTemplateCode(sms_template_code);
		rsp= client.execute(req);
		System.out.println(rsp.getBody());
		} catch (ApiException e) {
			// TODO Auto-generated catch block
			this.rendJson(false,null, "短信发送失败");
		}
		System.out.println(rsp.getBody());
	}
	/***
	 * 
	 * @param success
	 * @param statusCode 状态码默认为401
	 * @param msg
	 * @param obj 数组 [0]:data [1]:tokenid
	 */
	public void rendJson(boolean success,Integer statusCode,String msg,Object... data){
		Map<String,Object>json=new HashMap<String,Object>();
		json.put("success",success);
		json.put("status",success?200:(statusCode==null?401:statusCode));
		json.put("msg",msg);
		if(data!=null&&data.length>0){
			json.put("data",data[0]);
			if(data.length>1){
				json.put("tokenid",data[1]);
			}
		}
		rendJson(json);
	}
	protected void rendJson(Object json){
		String agent = getRequest().getHeader("User-Agent");
		if(agent.contains("MSIE"))
			this.render(new JsonRender(json).forIE());
		else{
			this.render(new JsonRender(json));
		}
	}
}