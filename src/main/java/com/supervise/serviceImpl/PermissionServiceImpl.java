package com.supervise.serviceImpl;

import com.supervise.domain.Permission;
import com.supervise.domain.PermissionRepository;
import com.supervise.domain.SysRole;
import com.supervise.dto.PermissionDto;
import com.supervise.dto.PermissionGroupDto;
import com.supervise.service.PermissionService;
import com.supervise.service.SysRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by HISTO on 2017/6/14.
 */
@Service("permissionService")
public class PermissionServiceImpl implements PermissionService {
    @Autowired
    SysRoleService roleService;
    @Autowired
    PermissionRepository permissionRepository;

    public List<Permission> getByUsername(String username) {
        Set<Permission> permissions = new HashSet<Permission>();
        for (SysRole role : roleService.getByUserName(username)) {
            permissions.addAll(role.getPermissions());
        }
        return new ArrayList<Permission>(permissions);
    }

    @Override
    public List<Permission> getPermissionByIdList(List<String> ids) {
        List<Long> idList = new ArrayList<Long>();
        for(String id:ids) {
            idList.add(Long.valueOf(id));
        }
        if (idList.isEmpty()) {
            return new ArrayList<Permission>();
        }
        List<Permission> permissions = permissionRepository.findByIdIn(idList);
        if(null == permissions)
            return new ArrayList<Permission>();
        for(Permission permission:permissions) {
            permission.getResources().size();
        }
        return permissions;
    }

    @Override
    public List<PermissionGroupDto> getCategoryPermissions() {
        List<Permission> groupList = permissionRepository.findPermissionGroup();
        List<PermissionGroupDto> permissionGroupDtoList = new ArrayList<PermissionGroupDto>(groupList.size());

        for (Permission permission : groupList) {
            PermissionGroupDto group = new PermissionGroupDto();
            group.setCode(permission.getPermissionType().getCode());
            group.setDesc(permission.getPermissionType().getDesc());
            List<Permission> permissionList = permissionRepository.findPermissionByType(permission.getPermissionType());
            List<PermissionDto> permissionDtoList = new ArrayList<PermissionDto>();
            for (Permission p : permissionList) {
                PermissionDto sysResourceDto = new PermissionDto(p);
                permissionDtoList.add(sysResourceDto);
            }
            group.setPermissionDtoList(permissionDtoList);
            permissionGroupDtoList.add(group);
        }
        return permissionGroupDtoList;
    }
}
