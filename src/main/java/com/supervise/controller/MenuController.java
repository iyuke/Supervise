package com.supervise.controller;

import com.supervise.common.util.MyJsonUtil;
import com.supervise.dto.MenuDto;
import com.supervise.exception.BusinessException;
import com.supervise.service.MenuService;
import net.sf.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * Created by HISTO on 2017/6/29.
 */
@Controller
@RequestMapping("/be")
public class MenuController extends BaseController {
    @Autowired
    private MenuService menuService;

    @RequestMapping(value = "/menu", method = RequestMethod.GET)
    @ResponseBody
    public JSONArray menuNavigator(HttpSession httpSession) throws BusinessException {
        String userName = getCurrentUserName();
        List<MenuDto> menuDtoList = (List<MenuDto>) httpSession.getAttribute(userName);
        if(null == menuDtoList) {
            menuDtoList = menuService.getDtoListByUsername(userName);
            httpSession.setAttribute(userName, menuDtoList);
        }
        JSONArray jsonArray = JSONArray.fromObject(menuDtoList, MyJsonUtil.getConfig(true));
        return jsonArray;
    }

}
