package com.supervise.controller;

import com.supervise.common.util.MyJsonUtil;
import com.supervise.common.util.PageUtil;
import com.supervise.common.util.Pagination;
import com.supervise.domain.Permission;
import com.supervise.domain.PermissionRepository;
import com.supervise.dto.PermissionDto;
import com.supervise.dto.PermissionSearchConditions;
import com.supervise.exception.BusinessException;
import com.supervise.service.PermissionService;
import com.supervise.service.ResourceService;
import com.supervise.specification.PermissionSpecification;
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

import javax.validation.Valid;

/**
 * Created by HISTO on 2017/7/4.
 */
@Controller("permissionController")
@RequestMapping("/be/permission")
public class PermissionController extends BaseController {
    @Autowired
    PermissionRepository permissionRepository;
    @Autowired
    ResourceService resourceService;
    @Autowired
    PermissionService permissionService;

    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public String permissionIndexAndSearch(
            @ModelAttribute PermissionSearchConditions searchConditions, BindingResult bindingResult,
            ModelMap modelMap) throws BusinessException {
        if (bindingResult.hasErrors()) {
            throw new BusinessException("数据提交失败！");
        }

        Sort sort = new Sort(Sort.Direction.DESC, "createTime");

        PageRequest pageRequest = PageUtil.getPageRequest(searchConditions.getCurrentPage(),
                searchConditions.getPageSize(), sort);

        modelMap.addAttribute("permissionSearchConditions", searchConditions);

        PermissionSpecification specification = new PermissionSpecification(searchConditions);

        Page<Permission> permissionPage = permissionRepository.findAll(specification, pageRequest);

        Pagination page = super.pageableToPagination(permissionPage);

        modelMap.addAttribute("permissions", permissionPage.getContent());
        modelMap.addAttribute("pagination", page);
        modelMap.addAttribute("createPermissionDto", new PermissionDto());
        modelMap.addAttribute("editPermissionDto", new PermissionDto());
        modelMap.addAttribute("permissionTypeList", Permission.PermissionType.values());
        modelMap.addAttribute("sysResourceGroupDtoList", resourceService.getSysResourceGroupDtoList());

        return "be/permission";
    }

    @ResponseBody
    @RequestMapping(value = {"/create", "/edit"}, method = RequestMethod.POST)
    public BaseResponse createPermission(@Valid @ModelAttribute PermissionDto permissionDto, BindingResult result)
            throws BusinessException {
        if (result.hasErrors()) {
            throw new BusinessException(result.getFieldErrors().get(0).getDefaultMessage());
        }

        BaseResponse rsp = new BaseResponse();
        permissionService.saveOrUpdate(permissionDto);
        return rsp;
    }

    @ResponseBody
    @RequestMapping(value = { "/detail" }, method = { RequestMethod.POST })
    public JSONObject permissionDetail(@RequestParam Long pId) throws BusinessException {
        PermissionDto permissionDto = permissionService.getDtoById(pId);
        JSONObject json = JSONObject.fromObject(permissionDto, MyJsonUtil.getConfig(false));
        return json;
    }

    @ResponseBody
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public BaseResponse delete(@RequestParam Long id) throws BusinessException {
        BaseResponse rsp = new BaseResponse();
        permissionService.deletePermission(id);
        return rsp;
    }

}
