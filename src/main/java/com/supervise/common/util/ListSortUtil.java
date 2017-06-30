package com.supervise.common.util;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * List按照指定字段排序工具
 *
 * @param <T>
 * Created by Nathaniel on 2015/7/30.
 */
public class ListSortUtil<T> {

    /**
     *
     * @param targetList  目标排序List
     * @param sortField  排序字段（实体类属性名）
     * @param sortMode  排序方式（asc or desc）
     */
    public void sort(List<T> targetList, final String sortField, final String sortMode) {

        Collections.sort(targetList, new Comparator<T>() {
            @Override
            public int compare(T o1, T o2) {
                int retVal = 0;
                //首字母大写
                String newStr = sortField.substring(0,1).toUpperCase() + sortField.replaceFirst("\\w", "");
                //生成getter方法名
                String methodStr = "get" + newStr;

                try {
                    Method method1 = o1.getClass().getMethod(methodStr, null);
                    Method method2 = o2.getClass().getMethod(methodStr, null);
                    if(sortMode != null && "desc".equals(sortMode.toLowerCase())) {
                        retVal = method2.invoke(o2, null).toString().compareTo(method1.invoke(o1, null).toString());
                    } else {
                        retVal = method1.invoke(o1, null).toString().compareTo(method2.invoke(o2, null).toString());
                    }
                } catch (NoSuchMethodException e) {
                    e.printStackTrace();
                } catch (InvocationTargetException e) {
                    e.printStackTrace();
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }

                return retVal;
            }
        });
    }
}
