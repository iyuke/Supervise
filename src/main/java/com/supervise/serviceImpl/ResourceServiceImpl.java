package com.supervise.serviceImpl;

import com.supervise.common.constant.Constants;
import com.supervise.domain.Permission;
import com.supervise.domain.SysResource;
import com.supervise.domain.SysResourceRepository;
import com.supervise.dto.SysResourceDto;
import com.supervise.dto.SysResourceGroupDto;
import com.supervise.exception.BusinessException;
import com.supervise.service.ResourceService;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by HISTO on 2017/6/20.
 */
@Service("resourceService")
@Transactional
public class ResourceServiceImpl implements ResourceService {
    @Autowired
    SysResourceRepository sysResourceRepository;


    @Override
    public void saveOrUpdate(SysResourceDto sysResourceDto) throws BusinessException {
        SysResource.SysResourceType sysResourceType = SysResource.SysResourceType.getByCode(
                sysResourceDto.getResourceType());
        if (null == sysResourceType) {
            throw new BusinessException("未知资源类型！");
        }

        SysResource newSysResource;
        if (sysResourceDto.getId() == null) {
            newSysResource = new SysResource();
        } else {
            newSysResource = sysResourceRepository.findOne(sysResourceDto.getId());
        }
        if (null == newSysResource.getUrl() || !newSysResource.getUrl().equals(sysResourceDto.getUrl())) {
            if (isExistUrl(sysResourceDto.getUrl())) {
                throw new BusinessException("URL已存在！");
            }
        }
        newSysResource.setResourceName(sysResourceDto.getResourceName());
        newSysResource.setResourceDescription(sysResourceDto.getResourceDescription());
        newSysResource.setUrl(sysResourceDto.getUrl());
        newSysResource.setResourceType(sysResourceType);
        sysResourceRepository.save(newSysResource);

        refreshSessionSysResourceAndPermissionMapping();
    }

    @Override
    public boolean isExistUrl(String url) {
        SysResource sysResource = sysResourceRepository.findByUrl(url);
        if (null != sysResource) {
            return true;
        }
        return false;
    }

    //初始化时候存放一个url资源对应多个权限
    @Override
    public Map<String, List<String>> getSysResourceAndPermissionMapping() {
        List<SysResource> list = sysResourceRepository.findAll();
        Map<String, List<String>> urlPermissionMap = new ConcurrentHashMap<String, List<String>>(list.size());
        for (SysResource sysResource : list) {
            List<String> permissionList = new ArrayList<String>(sysResource.getPermissions().size());
            for (Permission permission : sysResource.getPermissions()) {
                permissionList.add(permission.getCode());
            }
            urlPermissionMap.put(sysResource.getUrl(), permissionList);
        }
        return urlPermissionMap;
    }

    @Override
    public List<SysResourceGroupDto> getSysResourceGroupDtoList() {

        List<SysResource> groupList = sysResourceRepository.findSysResourceGroup();
        List<SysResourceGroupDto> sysResourceGroupDtoList = new ArrayList<SysResourceGroupDto>(groupList.size());

        for (SysResource sysResource : groupList) {
            SysResourceGroupDto group = new SysResourceGroupDto();

            group.setResourceTypeCode(sysResource.getResourceType().getCode());
            group.setResourceTypeName(sysResource.getResourceType().getDesc());

            List<SysResource> sysResourceList = sysResourceRepository.findSysResourcesByType(sysResource.getResourceType());
            List<SysResourceDto> sysResourceDtoList = new ArrayList<SysResourceDto>();
            for (SysResource resource : sysResourceList) {
                SysResourceDto sysResourceDto = new SysResourceDto(resource);
                sysResourceDtoList.add(sysResourceDto);
            }
            group.setSysResourceDtoList(sysResourceDtoList);
            sysResourceGroupDtoList.add(group);
        }
        return sysResourceGroupDtoList;
    }

    @Override
    public void refreshSessionSysResourceAndPermissionMapping() {
        HttpSession session = getCurrentSession();
        ServletContext application = session.getServletContext();
        application.setAttribute(Constants.URL_PERMISSION_MAP, getSysResourceAndPermissionMapping());
    }

    @Override
    public boolean deleteResource(Long id) throws BusinessException {
        SysResource resource = sysResourceRepository.findOne(id);
        if (null == resource) {
            throw new BusinessException("资源不存在！");
        }
        if (CollectionUtils.isNotEmpty(resource.getPermissions())) {
            throw new BusinessException("资源已被使用，无法删除！");
        }
        sysResourceRepository.delete(resource);
        return true;
    }

    @Override
    public String getUrlById(Long id) throws BusinessException {
        SysResource sysResource = sysResourceRepository.findOne(id);
        if (null == sysResource) {
            throw new BusinessException("未找到资源！");
        }
        return sysResource.getUrl();
    }

    public static HttpSession getCurrentSession() {
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        return attr.getRequest().getSession(true);
    }
}
