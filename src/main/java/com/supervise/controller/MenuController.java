package com.supervise.controller;

import com.supervise.common.util.MyJsonUtil;
import com.supervise.domain.Menu;
import com.supervise.dto.MenuDto;
import com.supervise.exception.BusinessException;
import com.supervise.service.MenuService;
import com.supervise.service.ResourceService;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
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
    @Autowired
    ResourceService resourceService;

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

    @RequestMapping(value = "/menu/index", method = RequestMethod.GET)
    public String getMenuIndexPage(ModelMap modelMap) {
        modelMap.addAttribute("createMenuDto", new MenuDto());
        modelMap.addAttribute("editMenuDto", new MenuDto());
        modelMap.addAttribute("sysResourceGroupDtoList",
                resourceService.getSysResourceGroupDtoList());
        modelMap.addAttribute("levelList", Menu.Level_List);
        modelMap.addAttribute("menus", menuService.getMenuByLevel("1"));

        return "be/menu";
    }

    @RequestMapping(value = {"/menu/create", "/menu/edit"}, method = RequestMethod.POST)
    @ResponseBody
    public BaseResponse createOrUpdateMenu(@ModelAttribute MenuDto menuDto, BindingResult result) throws
            BusinessException {
        if(result.hasErrors()) {
            throw new BusinessException(result.getFieldErrors().get(0).getDefaultMessage());
        }

        BaseResponse rsp = new BaseResponse();
        menuService.createOrUpdate(menuDto);
        return rsp;
    }

    @RequestMapping(value = "/menu/detail", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject getMenuDetail(@RequestParam Long menuId) {
        MenuDto menuDto = menuService.getDtoById(menuId);
        JSONObject jsonObject = JSONObject.fromObject(menuDto, MyJsonUtil.getConfig(true));
        return jsonObject;
    }

    @RequestMapping(value = "/menu/delete", method = RequestMethod.POST)
    @ResponseBody
    public BaseResponse deleteMenu(@RequestParam Long menuId) throws BusinessException {
        BaseResponse rsp = new BaseResponse();
        menuService.delete(menuId);
        return rsp;
    }

    @RequestMapping(value = "/menu/level", method = RequestMethod.POST)
    @ResponseBody
    public JSONArray getMenuByLevel(@RequestParam("level") String level) {
        List<MenuDto> menuDtos = menuService.getDtoListByLevel(level);
        JSONArray jsonArray = JSONArray.fromObject(menuDtos, MyJsonUtil.getConfig(true));
        return jsonArray;
    }

}
