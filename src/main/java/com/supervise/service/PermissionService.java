package com.supervise.service;

import com.supervise.domain.Permission;
import com.supervise.dto.PermissionDto;
import com.supervise.dto.PermissionGroupDto;
import com.supervise.exception.BusinessException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by HISTO on 2017/6/14.
 */
public interface PermissionService {

    @Transactional(readOnly = true)
    List<Permission> getByUsername(String username);

    @Transactional(readOnly = true)
    List<Permission> getPermissionByIdList(List<String> ids);

    @Transactional(readOnly = true)
    List<PermissionGroupDto> getCategoryPermissions();

    @Transactional
    void saveOrUpdate(PermissionDto permissionDto) throws BusinessException;

    @Transactional(readOnly = true)
    boolean isExistPermissionCode(String code);

    @Transactional(readOnly = true)
    Permission getByCode(String code);

    @Transactional(readOnly = true)
    PermissionDto getDtoById(Long id);

    @Transactional
    boolean deletePermission(Long id) throws BusinessException;

    @Transactional
    void setPermissionToAllRoles(Permission permission);
}
