package com.supervise.service;

import com.supervise.domain.Permission;
import com.supervise.dto.PermissionGroupDto;
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
}
