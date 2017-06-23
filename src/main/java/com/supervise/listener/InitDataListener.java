package com.supervise.listener;

import com.supervise.common.constant.Constants;
import com.supervise.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

/**
 * 容器启动时初始化数据
 */
public class InitDataListener implements ServletContextListener {

	@Override
	public void contextInitialized(ServletContextEvent contextEvent) {
		// spring 上下文
		ApplicationContext appContext = WebApplicationContextUtils.getWebApplicationContext(contextEvent.getServletContext());

		ResourceService resourceService = (ResourceService) appContext.getBean("resourceService");
		ServletContext servletContext = contextEvent.getServletContext();
		servletContext.setAttribute(Constants.URL_PERMISSION_MAP, resourceService.getSysResourceAndPermissionMapping());
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
	}

}
