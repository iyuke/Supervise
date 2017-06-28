package com.supervise.filter;

import com.supervise.common.constant.Constants;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.subject.Subject;

import javax.servlet.FilterChain;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

public class UserAuthorityFilter extends IgnorableFilter {

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        String requestURL = req.getRequestURI();
        int beginIndex = req.getContextPath().length();
        String contextPath = req.getContextPath();
        String requestURI = getRequestURI(requestURL.substring(beginIndex + 1));

        if (isIgnored(request)) {
            chain.doFilter(request, response);
            return;
        }
        if (requestURL.equals("/Supervise") || requestURL.equals("/Supervise/") ||
                requestURL.equals("/Supervise/be") || requestURL.equals("/Supervise/be/")) {
            res.sendRedirect(req.getContextPath() + "/be/index");
            return;
        }
        int excludeStrIndex = requestURI.toLowerCase().indexOf(";jsessionid=");
        if (excludeStrIndex > 0) {
            requestURI = requestURI.substring(0, excludeStrIndex);
            ((HttpServletResponse) response).sendRedirect("/Supervise/" + requestURI);
            return;
        }

        ServletContext application = req.getSession(true).getServletContext();
        Map<String, List<String>> urlPermissionMap = (Map<String, List<String>>) application.getAttribute(Constants.URL_PERMISSION_MAP);

        Subject subject = SecurityUtils.getSubject();
        //前面登入时已经认证，用的是Servlet默认的Session
        if (subject.isAuthenticated()) {
            List<String> permissions = urlPermissionMap.get(requestURI);
            boolean isPermitted = false;
            if (null == permissions) {
                if (!isRequestedByAjax(req)) { // 非ajax页面跳转
                    // normal request
                    res.sendRedirect(req.getContextPath() + "/" + Constants.ERROR_PAGE_404);
                    return;
                } else {
                    //ajax 返回未授权错误的json
                    dealAjaxRequest(response, "404");
                    return;
                }
            } else {
                for (String permission : permissions) {
                    //通过url找到对应的权限，验证权限是否isPermitted,在这里会调用UserRealm中的授权信息
                    if (subject.isPermitted(permission)) {
                        isPermitted = true;
                        break;
                    }
                }
            }
            if (!isPermitted) {
                res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                //没有授权，提示错误
                if (!isRequestedByAjax(req)) { // 非ajax页面跳转
                    // normal request
                    res.sendRedirect(req.getContextPath() + "/" + Constants.ERROR_PAGE_401);
                    return;
                } else {
                    //ajax 返回未授权错误的json
                    dealAjaxRequest(response, "401");
                    return;
                }
            }
            chain.doFilter(request, response);
        } else {
            if (!isRequestedByAjax(req)) { // 非ajax页面跳转
                res.sendRedirect(req.getContextPath() + "/be/login");
                return;
            } else {
                dealAjaxRequest(response, "300");
                return;
            }//未登录
        }
    }

    private void dealAjaxRequest(ServletResponse response, String type) {
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json; charset=utf-8");
        PrintWriter out = null;
        try {
            out = response.getWriter();
            if ("401".equalsIgnoreCase(type)) {
                out.append("没有操作权限！");
            } else if ("300".equalsIgnoreCase(type)) {
                out.append("请登录！");
            } else {
                out.append("未找到资源！");
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (out != null) {
                out.close();
            }
        }
    }

    private String getRequestURI(String uri) {
        String result = uri;
        if (uri.lastIndexOf(".") > 0) {
            result = uri.substring(0, uri.lastIndexOf("/"));
        }
        return result;
    }

    private boolean isRequestedByAjax(HttpServletRequest httpServletRequest) {
        return "XMLHttpRequest".equals(httpServletRequest.getHeader("X-Requested-With"));
    }
}