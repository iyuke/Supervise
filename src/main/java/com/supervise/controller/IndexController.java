package com.supervise.controller;

import com.supervise.domain.SysRole;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author Nathaniel
 */
@Controller("adminIndexController")
@RequestMapping("/be")
public class IndexController extends BaseController {

    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public String adminIndex(ModelMap modelMap) throws Exception {
        modelMap.addAttribute("roles", SysRole.RoleType.values());
        return "be/index";
    }

}
