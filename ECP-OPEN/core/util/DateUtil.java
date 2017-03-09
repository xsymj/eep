package util;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {
	
	
	public static String dateString(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		 return df.format(new Date());
	}
}
