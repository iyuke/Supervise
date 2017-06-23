package com.supervise.filter;

import org.springframework.web.filter.GenericFilterBean;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.regex.Pattern;

public abstract class IgnorableFilter extends GenericFilterBean {
    private String[] ignore = new String[0];

    public void setIgnore(String[] ignore) {
        this.ignore = ignore.clone();
    }

    protected boolean isIgnored(ServletRequest request) throws IOException, ServletException {
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        String requestURI = httpServletRequest.getRequestURI();
        for (String pattern : ignore) {
            if (Pattern.compile(pattern).matcher(requestURI).matches()) {
                return true;
            }
        }
        return false;
    }

//    public static void main(String[] args) {
//        String pattern = "http://be.lufax.app.*$";
//        String requestURI = "http://be.lufax.app/be-fa/service/event/trx-new";
//        System.out.println(Pattern.compile(pattern).matcher(requestURI).matches());
//    }
}
