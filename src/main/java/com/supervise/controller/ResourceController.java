package com.supervise.controller;

import com.supervise.common.util.MyJsonUtil;
import com.supervise.common.util.PageUtil;
import com.supervise.common.util.Pagination;
import com.supervise.domain.SysResource;
import com.supervise.domain.SysResourceRepository;
import com.supervise.dto.ResourceSearchConditions;
import com.supervise.dto.SysResourceDto;
import com.supervise.exception.BusinessException;
import com.supervise.service.ResourceService;
import com.supervise.specification.ResourceSpecification;
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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.validation.Valid;

/**
 * Created by HISTO on 2017/7/5.
 */
@Controller("resourceController")
@RequestMapping("/be/resource")
public class ResourceController extends BaseController {
    @Autowired
    SysResourceRepository sysResourceRepository;
    @Autowired
    ResourceService resourceService;

    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public String resourceIndexAndSearch(
            @ModelAttribute ResourceSearchConditions searchConditions, BindingResult result,
            ModelMap modelMap) throws BusinessException {
        if (result.hasErrors()) {
            throw new BusinessException(result.getFieldErrors().get(0).getDefaultMessage());
        }

        modelMap.addAttribute("resourceSearchConditions", searchConditions);

        Sort sort = new Sort(Sort.Direction.DESC, "createTime");

        PageRequest pageRequest = PageUtil.getPageRequest(searchConditions.getCurrentPage(),
                searchConditions.getPageSize(), sort);
        ResourceSpecification specification = new ResourceSpecification(searchConditions);
        Page<SysResource> resourcePage = sysResourceRepository.findAll(specification, pageRequest);

        Pagination page = super.pageableToPagination(resourcePage);
        modelMap.addAttribute("pagination", page);
        modelMap.addAttribute("resources", resourcePage.getContent());
        modelMap.addAttribute("createSysResourceDto", new SysResourceDto());
        modelMap.addAttribute("editSysResourceDto", new SysResourceDto());
        modelMap.addAttribute("resourceTypeList", SysResource.SysResourceType.values());

        return "be/resource";
    }

    @ResponseBody
    @RequestMapping(value = {"/create", "/edit"}, method = RequestMethod.POST)
    public BaseResponse createSysResource(@Valid @ModelAttribute SysResourceDto sysResourceDto, BindingResult result)
            throws BusinessException {
        if (result.hasErrors()) {
            throw new BusinessException(result.getFieldErrors().get(0).getDefaultMessage());
        }

        BaseResponse rsp = new BaseResponse();
        resourceService.saveOrUpdate(sysResourceDto);
        return rsp;
    }

    @ResponseBody
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    public BaseResponse delete(@RequestParam Long id) throws Exception {
        BaseResponse rsp = new BaseResponse();
        resourceService.deleteResource(id);
        return rsp;
    }

    @ResponseBody
    @RequestMapping(value = "/detail", method = RequestMethod.POST)
    public JSONObject resourceDetail(HttpServletRequest request, HttpServletResponse response, HttpSession session, ModelMap model, @RequestParam Long id) throws Exception {
        JSONObject json = new JSONObject();
        SysResource sysResource = sysResourceRepository.findOne(id);
        SysResourceDto sysResourceDto = new SysResourceDto(sysResource);
        try {
            json = JSONObject.fromObject(sysResourceDto, MyJsonUtil.getConfig(false));
        } catch (Exception e) {
            json.put("error", e.getMessage());
        }
        return json;
    }
}
