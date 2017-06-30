package com.supervise.common.util;

import net.sf.json.JSONNull;
import net.sf.json.JsonConfig;
import net.sf.json.util.PropertyFilter;

import java.util.Date;

/**
 * Created by HISTO on 2017/6/29.
 */
public class MyJsonUtil {

    //忽略value为null的属性
    public static JsonConfig getConfig(Boolean filter){
        JsonConfig config = new JsonConfig();
        config.registerJsonValueProcessor(Date.class , new MyJsonValueProcessor());
        if(filter){
            //忽略value为null的属性
            config.setJsonPropertyFilter(new PropertyFilter(){
                @Override
                public boolean apply(Object source, String name, Object value) {
                    return value == null || value instanceof JSONNull;
                }
            });
        }
        return config;
    }
}
