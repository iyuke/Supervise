package com.supervise.serviceImpl;

import com.supervise.domain.Permission;
import com.supervise.domain.PermissionRepository;
import com.supervise.domain.SysResource;
import com.supervise.domain.SysResourceRepository;
import com.supervise.domain.SysRole;
import com.supervise.domain.SysRoleRepository;
import com.supervise.dto.PermissionDto;
import com.supervise.dto.PermissionGroupDto;
import com.supervise.exception.BusinessException;
import com.supervise.service.PermissionService;
import com.supervise.service.ResourceService;
import com.supervise.service.SysRoleService;
import org.apache.commons.collections.CollectionUtils;
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
    ResourceService resourceService;
    @Autowired
    PermissionRepository permissionRepository;
    @Autowired
    SysResourceRepository sysResourceRepository;
    @Autowired
    SysRoleRepository sysRoleRepository;

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

    @Override
    public void saveOrUpdate(PermissionDto permissionDto) throws BusinessException {
        Permission permission;
        boolean isNewFieldPermission = false;

        Permission.PermissionType permissionType = Permission.PermissionType.getByCode(
                permissionDto.getPermissionType());
        if (null == permissionType) {
            throw new BusinessException("未知权限类型！");
        }
        if (permissionDto.getId() == null) {
            permission = new Permission();
        } else {
            permission = permissionRepository.findOne(permissionDto.getId());
        }
        //如果是字段控制，并且是新建而不是编辑的状态
        if (Permission.PermissionType.FIELD.equals(permissionType) &&
                !permissionType.equals(permission.getPermissionType())) {
            isNewFieldPermission = true;
        }
        if (null == permission.getCode() || !permissionDto.getCode().equals(permission.getCode())) {
            if (isExistPermissionCode(permissionDto.getCode())) {
                throw new BusinessException("权限代码已存在！");
            }
        }

        permission.setName(permissionDto.getName());
        permission.setCode(permissionDto.getCode());
        permission.setPermissionType(permissionType);
        permission.setPermissionDescription(permissionDto.getPermissionDescription());

        List<Long> resourceIdList = permissionDto.getResourceIdList();
        if (resourceIdList != null) {
            List<SysResource> resources = sysResourceRepository.findSysResourcesByIds(resourceIdList);
            permission.setResources(resources);
        }
        permission = permissionRepository.saveAndFlush(permission);

        if (isNewFieldPermission) {
            setPermissionToAllRoles(permission);
        }

        resourceService.refreshSessionSysResourceAndPermissionMapping();
    }

    @Override
    public boolean isExistPermissionCode(String code) {
        Permission permission = getByCode(code);
        if (permission != null) {
            return true;
        }
        return false;
    }

    @Override
    public Permission getByCode(String code) {
        return  permissionRepository.findByCode(code);
    }

    @Override
    public PermissionDto getDtoById(Long id) {
        Permission permission = permissionRepository.findOne(id);
        if (permission == null) {
            return null;
        } else {
            PermissionDto permissionDto = new PermissionDto(permission);
            return permissionDto;
        }
    }

    @Override
    public boolean deletePermission(Long id) throws BusinessException {
        Permission permission = permissionRepository.findOne(id);
        if (null == permission) {
            throw new BusinessException("权限不存在！");
        }
        if (CollectionUtils.isNotEmpty(permission.getRoles())) {
            throw new BusinessException("权限已被使用，无法删除！");
        }
        permissionRepository.delete(permission);
        return true;
    }

    @Override
    public void setPermissionToAllRoles(Permission permission) {
        if (null == permission) {
            return;
        }
        List<SysRole> allRoles = sysRoleRepository.findAll();
        for (SysRole role : allRoles) {
            List<Permission> permissionList = role.getPermissions();
            Set<Permission> permissionSet = new HashSet<Permission>(permissionList);
            permissionSet.add(permission);
            permissionList = new ArrayList<Permission>(permissionSet);
            role.setPermissions(permissionList);
        }
        sysRoleRepository.save(allRoles);
    }

}
