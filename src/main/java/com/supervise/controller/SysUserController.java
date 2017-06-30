package com.supervise.controller;

import com.supervise.common.util.MyJsonUtil;
import com.supervise.common.util.PageUtil;
import com.supervise.common.util.Pagination;
import com.supervise.domain.SysRole;
import com.supervise.domain.SysUser;
import com.supervise.dto.UserDto;
import com.supervise.dto.UserSearchConditions;
import com.supervise.exception.BusinessException;
import com.supervise.service.OrganizationService;
import com.supervise.service.SysRoleService;
import com.supervise.service.SysUserService;
import com.supervise.specification.SysUserSpecification;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Arrays;

/**
 * Created by HISTO on 2017/6/29.
 */
@Controller("sysUserController")
@RequestMapping("/be/user")
public class SysUserController extends BaseController {
    @Autowired
    SysUserService sysUserService;
    @Autowired
    OrganizationService organizationService;
    @Autowired
    SysRoleService sysRoleService;

    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public String getSysUsersIndexAndSearch(
            @ModelAttribute UserSearchConditions userSearchConditions, BindingResult bindingResult,
            ModelMap modelMap) throws BusinessException {
        if (bindingResult.hasErrors()) {
            throw new BusinessException("提交数据异常！");
        }
        modelMap.addAttribute("userSearchConditions", userSearchConditions);
        Sort sort = new Sort(Sort.Direction.DESC, "id");
        PageRequest pageRequest = PageUtil.getPageRequest(userSearchConditions.getCurrentPage(),
                userSearchConditions.getPageSize(), sort);
        SysUserSpecification spec = new SysUserSpecification(userSearchConditions);

        Page<SysUser> sysUserPage = sysUserService.getBySpec(spec, pageRequest);

        Pagination page = super.pageableToPagination(sysUserPage);
        modelMap.addAttribute("pagination", page);
        modelMap.addAttribute("users", sysUserPage.getContent());

        preparePageData(modelMap);

        return "be/sysuser";
    }

    @RequestMapping(value = "/detail", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject getSysUser(@RequestParam("uId") Long id) throws BusinessException {
        UserDto sysUserDto = sysUserService.getUserDtoById(id);
        JSONObject json = JSONObject.fromObject(sysUserDto, MyJsonUtil.getConfig(true));
        return json;
    }

    @RequestMapping(value = {"/create", "/edit"}, method = RequestMethod.POST)
    @ResponseBody
    public BaseResponse createOrUpdateSysUser(@ModelAttribute UserDto userDto, BindingResult result) throws
            BusinessException {
        if (result.hasErrors()) {
            throw new BusinessException(result.getFieldErrors().get(0).getDefaultMessage());
        }

        BaseResponse rsp = new BaseResponse();
        sysUserService.createOrUpdate(userDto);
        return rsp;
    }

    @RequestMapping(value = "/reset-password", method = RequestMethod.POST)
    @ResponseBody
    public BaseResponse resetPassword(@RequestParam Long userId) throws BusinessException {
        BaseResponse res = new BaseResponse();
        sysUserService.resetPwd(userId);
        return res;
    }

    private void preparePageData(ModelMap modelMap) {
        modelMap.addAttribute("createSysUserDto", new UserDto());
        modelMap.addAttribute("editSysUserDto", new UserDto());
        modelMap.addAttribute("roleList", sysRoleService.getAllSysRoles());
        modelMap.addAttribute("orgDtoList", organizationService.getOrganizationDtos());
//        //搜索条件中的机构列表
        modelMap.addAttribute("organizations", organizationService.getTopLevelOrgs());
    }

}
