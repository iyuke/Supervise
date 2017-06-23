package com.supervise.exception;

import org.springframework.web.servlet.HandlerExceptionResolver;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by HISTO on 2017/6/14.
 */
public class MyExceptionHandler implements HandlerExceptionResolver {
    public ModelAndView resolveException(HttpServletRequest request,
                                         HttpServletResponse response,
                                         Object o, Exception ex) {
        Map<String, Object> model = new HashMap<String, Object>();
        model.put("ex", ex);
        //是否异步请求
        if (!(request.getHeader("accept").indexOf("application/json") > -1 || (request
                .getHeader("X-Requested-With")!= null && request
                .getHeader("X-Requested-With").indexOf("XMLHttpRequest") > -1))) {
            // 根据不同错误转向不同页面
            if(ex instanceof SystemException) {
                response.setStatus(1001);//业务异常返回 1001
                return new ModelAndView("WEB-INF/jsp/exception/error-system", model);
            }else if(ex instanceof ParameterException) {
                response.setStatus(1002);//参数异常返回 1002
                return new ModelAndView("WEB-INF/jsp/exception/error-parameter", model);
            } else {
                response.setStatus(1000);//其他异常返回 1000
                return new ModelAndView("WEB-INF/error", model);
            }
        }else{
            try {
                if(ex instanceof SystemException) {
                    response.setStatus(1001);//业务异常返回 1001
                }else if(ex instanceof ParameterException) {
                    response.setStatus(1002);//参数异常返回 1002
                } else {
                    response.setStatus(1000);//其他异常返回 1000
                }
                PrintWriter writer = response.getWriter();
                writer.write(ex.getMessage());
                writer.flush();
            } catch (IOException e) {
                model.put("ex", e);
                return new ModelAndView("WEB-INF/error", model);
            }
            return null;
        }
    }
}
