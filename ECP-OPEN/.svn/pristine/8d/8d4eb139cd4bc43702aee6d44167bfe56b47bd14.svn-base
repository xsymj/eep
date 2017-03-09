/**
 * 微信公众平台开发模式(JAVA) SDK
 * (c) 2012-2013 ____′↘夏悸 <wmails@126.cn>, MIT Licensed
 * http://www.jeasyuicn.com/wechat
 */
package com.gson.inf;

import com.gson.bean.InMessage;
import com.gson.bean.OutMessage;
import com.gson.bean.TextOutMessage;

public class DefaultMessageProcessingHandlerImpl implements MessageProcessingHandler{

	private OutMessage outMessage;
	
	public void allType(InMessage msg){
		TextOutMessage out = new TextOutMessage();
		out.setContent("您的消息已经收到！");
		setOutMessage(out);
	}
	
	public void textTypeMsg(InMessage msg) {
	}

	public void locationTypeMsg(InMessage msg) {
	}

	public void imageTypeMsg(InMessage msg) {
	}
	
	public void videoTypeMsg(InMessage msg) {
	}
	
	public void voiceTypeMsg(InMessage msg) {
	}

	public void linkTypeMsg(InMessage msg) {
	}
	
	public void verifyTypeMsg(InMessage msg) {}

	public void eventTypeMsg(InMessage msg) {
	}
	
	public void setOutMessage(OutMessage outMessage) {
		this.outMessage = outMessage;
	}
	
	public void afterProcess(InMessage inMessage,OutMessage outMessage) {
	}
	
	public OutMessage getOutMessage() {
		return outMessage;
	}
}
