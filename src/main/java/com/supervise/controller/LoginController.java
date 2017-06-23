package com.supervise.controller;

import com.supervise.domain.SysUser;
import com.supervise.exception.BusinessException;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author Nathaniel
 */
@Controller("adminLoginController")
@RequestMapping("/be")
public class LoginController {

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String loginForm(ModelMap modelMap) {
        modelMap.addAttribute("loginForm", new SysUser());
        return "be/login";
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public String login(
            @ModelAttribute("loginForm")SysUser sysUser,
            ModelMap modelMap) throws BusinessException {
        UsernamePasswordToken token = new UsernamePasswordToken(sysUser.getUserName(), sysUser.getPassword());
        Subject currentUser = SecurityUtils.getSubject();
        try {
            currentUser.login(token);
        } catch (AuthenticationException ae) {
            modelMap.addAttribute("error", "用户名或密码错误");
            return "be/login";
        }
        return "redirect:/be/index";
    }

    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logout() {
        Subject currentUser = SecurityUtils.getSubject();
        currentUser.logout();
        return "redirect:/be/login";
    }

}

