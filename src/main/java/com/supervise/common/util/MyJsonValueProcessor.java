package com.supervise.common.util;

import net.sf.json.JsonConfig;
import net.sf.json.processors.JsonValueProcessor;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * 禁止json转换时，时间转化为对象
 */
public class MyJsonValueProcessor implements JsonValueProcessor {
    private String datePattern = "yyyy-MM-dd";
    public MyJsonValueProcessor() {
        super();
    }
    public MyJsonValueProcessor(String format) {
        super();
        this.datePattern = format;
    }
    public Object processArrayValue(Object value, JsonConfig jsonConfig) {
        return process(value);
    }
    public Object processObjectValue(String key, Object value, JsonConfig jsonConfig) {
        return process(value);
    }
    private Object process(Object value) {
        try {
            if (value instanceof Date) {
                SimpleDateFormat sdf = new SimpleDateFormat(datePattern, Locale.UK);
                return sdf.format((Date) value);
            }
            return value == null ? "" : value.toString();
        } catch (Exception e) {
            return "";
        }
    }
    public String getDatePattern() {
        return datePattern;
    }
    public void setDatePattern(String pDatePattern) {
        datePattern = pDatePattern;
    }
}
