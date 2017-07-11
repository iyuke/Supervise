package com.supervise.common.util;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Date;

/**
 * Created by HISTO on 2017/7/10.
 */
public class ReflectionUtil {
    public static String getObjectAllAttributes(Object obj) {
        if (null == obj) {
            return "";
        }

        StringBuffer sb = new StringBuffer();
        try {
            if(isBaseDataTypeOrBaseWrapDataType(obj.getClass())){
                return String.valueOf(obj);
            }
            getPropertyString(obj, sb);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return sb.toString();
    }

    /**
     * 判断一个类是否为基本数据类型。
     * @param clazz 要判断的类。
     * @return true 表示为基本数据类型。
     */
    private static boolean isBaseDataTypeOrBaseWrapDataType(Class clazz) throws Exception {
        return
                (clazz.equals(String.class) ||
                        clazz.equals(Integer.class) ||
                        clazz.equals(Byte.class) ||
                        clazz.equals(Long.class) ||
                        clazz.equals(Double.class) ||
                        clazz.equals(Float.class) ||
                        clazz.equals(Character.class) ||
                        clazz.equals(Short.class) ||
                        clazz.equals(BigDecimal.class) ||
                        clazz.equals(BigInteger.class) ||
                        clazz.equals(Boolean.class) ||
                        clazz.equals(Date.class) ||
                        clazz.isPrimitive()
                );
    }

    private static String getPropertyString(Object entityName, StringBuffer sb) throws Exception {
        Class<?> c = entityName.getClass();
        Field field[] = c.getDeclaredFields();
        Object value = null;
        String classname = "";
        Object tempObj = null;
        sb.append("\n------ " + " begin ------\n");
        sb.append("Class: " + c.toString() + "\n");
        for (Field f : field) {
            sb.append(f.getName());
            sb.append(" : ");
            // TODO value is always null
            if (null != value) {
                if (value.getClass().isArray()) {
                    for (int i = 0; i < Array.getLength(value); i++) {
                        tempObj = Array.get(value, i);
                        if (tempObj.getClass().isPrimitive()) {
                            sb.append(tempObj.toString());
                        } else if (tempObj instanceof String) {
                            sb.append(tempObj.toString());
                        } else if (tempObj instanceof Date) {
                            sb.append(tempObj.toString());
                        } else if (tempObj instanceof Number) {
                            sb.append(tempObj.toString());
                        } else {
                            getPropertyString(tempObj, sb);
                        }
                    }
                }
                classname = value.getClass().getName();
                if (classname.indexOf("com.cignacmb.core.model.") > -1) {
                    getPropertyString(value, sb);
                }

            }
            sb.append(value);
            sb.append("\n");
        }
        sb.append("------ " + " end ------\n");
        return sb.toString();
    }
}
