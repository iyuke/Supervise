package com.supervise.exception;

import com.supervise.controller.BaseResponse;
import net.sf.json.JSONObject;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;


public class MyExceptionResolver extends SimpleMappingExceptionResolver {
	private static final Log log = LogFactory.getLog(MyExceptionResolver.class);

	@ExceptionHandler(value = Exception.class)
	@Override
	protected ModelAndView doResolveException(HttpServletRequest request,
                                              HttpServletResponse response, Object handler, Exception ex) {
		if(null == ex) {
			return null;
		}
		String viewName = determineViewName(ex, request);
		if (viewName == null || "".equals(viewName)) {
			viewName = "error";
		}

		log.error(ex.getLocalizedMessage(),ex);
		// JSP格式返回
		if (!(request.getHeader("accept").indexOf("application/json") > -1 || (request
				.getHeader("X-Requested-With")!= null && request
				.getHeader("X-Requested-With").indexOf("XMLHttpRequest") > -1))) {
			// 如果不是异步请求
			Integer statusCode = determineStatusCode(request, viewName);
			if (statusCode != null) {
				applyStatusCodeIfPossible(request, response, statusCode);
			}
			//页面获取exception时，内容包含异常类信息（com...BusinessException）
//				return getModelAndView(viewName, ex, request);
			ModelAndView mv = new ModelAndView(viewName);
			mv.addObject("exception", ex.getMessage());
			return mv;
		} else {
			// JSON格式返回
			try {
				PrintWriter writer = response.getWriter();
				if (ex instanceof BusinessException) {
					response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
					//TODO 业务异常统一封装后，以正常的response code返回
//						response.setStatus(HttpServletResponse.SC_OK);
					BaseResponse baseResponse = new BaseResponse();
					baseResponse.setCode(((BusinessException) ex).getCode());
					baseResponse.setMessage(ex.getMessage());
					JSONObject json = JSONObject.fromObject(baseResponse);
					writer.write(json.toString());
				} else {
					response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
					writer.write("SYSTEM ERROR");
				}
				writer.flush();
			} catch (IOException e) {
				e.printStackTrace();
			}
			return null;
		}
	}

}