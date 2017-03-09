package com.alibaba.druid.util;

import com.taobao.api.ApiException;
import com.taobao.api.DefaultTaobaoClient;
import com.taobao.api.TaobaoClient;
import com.taobao.api.request.AlibabaAliqinFcSmsNumSendRequest;
import com.taobao.api.response.AlibabaAliqinFcSmsNumSendResponse;

public class MessageTest {
	
	public static void main(String[] args) throws ApiException{
		String url = "http://gw.api.taobao.com/router/rest";
		String appkey = "23655254";
		String secret = "d420aed339446e389e6452506f48e3ef";
		String sms_free_sign_name = "安旭";
		String rec_num = "18611611926";
		String sms_template_code = "SMS_16756165";
		TaobaoClient client = new DefaultTaobaoClient(url, appkey, secret);
		AlibabaAliqinFcSmsNumSendRequest req = new AlibabaAliqinFcSmsNumSendRequest();
		req.setExtend("123456");
		req.setSmsType("normal");
		req.setSmsFreeSignName(sms_free_sign_name);
		req.setSmsParamString("{\"code\":\"1234\",\"product\":\"123123\"}");
		req.setRecNum(rec_num);
		req.setSmsTemplateCode(sms_template_code);
		AlibabaAliqinFcSmsNumSendResponse rsp = client.execute(req);
		System.out.println(rsp.getBody());
	}
}
