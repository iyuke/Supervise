package com.supervise.service;

import com.supervise.dto.SysResourceDto;
import com.supervise.dto.SysResourceGroupDto;
import com.supervise.exception.BusinessException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Created by HISTO on 2017/6/20.
 */
public interface ResourceService {

    /**
     * 获取url和权限的映射关系
     * Map<key, value>
     *     key 资源的url
     *     value 资源关联的权限列表
     * @return
     */
    @Transactional(readOnly = true)
    Map<String, List<String>> getSysResourceAndPermissionMapping();

    @Transactional(readOnly = true)
    List<SysResourceGroupDto> getSysResourceGroupDtoList();
    @Transactional
    void refreshSessionSysResourceAndPermissionMapping();
    @Transactional
    boolean deleteResource(Long id) throws BusinessException;
    @Transactional
    void saveOrUpdate(SysResourceDto sysResourceDto) throws BusinessException;
    @Transactional
    boolean isExistUrl(String url);
}
