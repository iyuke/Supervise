package com.supervise.controller;

import com.supervise.common.util.DateUtil;
import com.supervise.domain.SysUser;
import com.supervise.exception.BusinessException;
import com.supervise.service.SysUserService;
import org.apache.shiro.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;

import java.beans.PropertyEditorSupport;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by HISTO on 2017/6/28.
 */
public class BaseController {
    @Autowired
    protected SysUserService userService;

    protected ConcurrentHashMap<String, SysUser> loginUserMap = new ConcurrentHashMap();

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        dateFormat.setLenient(false);
        binder.registerCustomEditor(Date.class, new PropertyEditorSupport() {
            public void setAsText(String value) {
                if (null == value || value.equals("")) {
                    setValue(null);
                } else {
                    setValue(DateUtil.parseDate(value));
                }
            }

            public String getAsText() {
                return DateUtil.getDate((Date) getValue());
            }
        });
    }

    protected String getCurrentUserName() {
        return String.valueOf(SecurityUtils.getSubject().getPrincipal());
    }

    protected SysUser getCurrentUser() throws BusinessException {
        String userName = String.valueOf(SecurityUtils.getSubject().getPrincipal());
        SysUser user = loginUserMap.get(userName);
        if (null == user) {
            user = userService.getUserByUsername(userName);
            if (null == user) {
                throw new BusinessException("Cannot find user by userName=" + userName);
            }
            loginUserMap.put(userName, user);
            return user;
        }
        return user;
    }
}
