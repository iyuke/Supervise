package com.supervise.controller;

import com.supervise.common.util.MyJsonUtil;
import com.supervise.domain.SysRole;
import com.supervise.domain.SysRoleRepository;
import com.supervise.dto.SysRoleDto;
import com.supervise.exception.BusinessException;
import com.supervise.service.PermissionService;
import com.supervise.service.SysRoleService;
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

import java.util.List;

/**
 * Created by HISTO on 2017/6/30.
 */
@Controller
@RequestMapping("/be/role")
public class SysRoleController extends BaseController {
    @Autowired
    SysRoleRepository sysRoleRepository;
    @Autowired
    PermissionService permissionService;
    @Autowired
    SysRoleService sysRoleService;

    @RequestMapping(value="/index", method = RequestMethod.GET)
    public String getSysRoleIndex(ModelMap modelMap) throws BusinessException {
        List<SysRole> roles = sysRoleRepository.findAll();
        modelMap.addAttribute("roles", roles);
        modelMap.addAttribute("roleDtoEdit", new SysRoleDto());
        modelMap.addAttribute("roleDtoCreate", new SysRoleDto());
        modelMap.addAttribute("categoryPermissions", permissionService.getCategoryPermissions());

        return "be/role";
    }

    @RequestMapping(value = "/detail", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject getSysRoleDetail(@RequestParam("roleId") String roleId) throws BusinessException {
        SysRole sysRole = sysRoleService.getById(roleId);
        SysRoleDto sysRoleDto = new SysRoleDto(sysRole);
        JSONObject json = JSONObject.fromObject(sysRoleDto, MyJsonUtil.getConfig(true));
        return json;
    }

    @RequestMapping(value = {"/create", "/edit"}, method = RequestMethod.POST)
    @ResponseBody
    public BaseResponse createOrUpdateRole(@ModelAttribute SysRoleDto roleDto, BindingResult result) throws
            BusinessException {
        if (result.hasErrors()) {
            throw new BusinessException(result.getFieldErrors().get(0).getDefaultMessage());
        }

        BaseResponse rsp = new BaseResponse();
        sysRoleService.createOrUpdateRole(roleDto);
        return rsp;
    }

}
