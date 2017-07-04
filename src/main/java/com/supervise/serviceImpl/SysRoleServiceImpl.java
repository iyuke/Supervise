package com.supervise.serviceImpl;

import com.supervise.domain.Permission;
import com.supervise.domain.SysRole;
import com.supervise.domain.SysRoleRepository;
import com.supervise.dto.SysRoleDto;
import com.supervise.exception.BusinessException;
import com.supervise.service.MenuService;
import com.supervise.service.PermissionService;
import com.supervise.service.SysRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by HISTO on 2017/6/14.
 */
@Service("sysRoleService")
public class SysRoleServiceImpl implements SysRoleService {
    @Autowired
    SysRoleRepository sysRoleRepository;
    @Autowired
    PermissionService permissionService;
    @Autowired
    MenuService menuService;

    @Override
    @Cacheable(value = "userRoles", key = "#userName")
    public List<SysRole> getByUserName(String userName) {
        List<SysRole> sysRoleList = sysRoleRepository.findBySysUsers_UserName(userName);
        for (SysRole sysRole : sysRoleList) {
            sysRole.getPermissions().size();
        }
        return sysRoleList;
    }

    @Override
    public List<SysRole> getSysRolesByIds(List<Long> idList) {
        return sysRoleRepository.findSysRolesByIds(idList);
    }

    @Override
    public List<SysRole> getAllSysRoles() {
        return sysRoleRepository.findAll();
    }

    @Override
    public SysRole getById(String roleId) {
        SysRole sysRole = sysRoleRepository.findOne(Long.valueOf(roleId));
        sysRole.getPermissions().size();
        return sysRole;
    }

    @Override
    public void createOrUpdateRole(SysRoleDto roleDto) throws BusinessException {
        SysRole sysRole = new SysRole(roleDto);
        setRolePermissionAndMenu(sysRole, roleDto);
        if (roleDto.getId() == null) {
            if (sysRoleRepository.findByRoleCode(roleDto.getRoleCode()) != null) {
                throw new BusinessException("角色代码已存在");
            }

            if (sysRoleRepository.findByRoleName(roleDto.getRoleName()) != null) {
                throw new BusinessException("角色名称已存在");
            }
        }
        sysRoleRepository.save(sysRole);
    }

    private void setRolePermissionAndMenu(SysRole sysRole, SysRoleDto sysRoleDto) {
        List<String> permissionIds = sysRoleDto.getPermissionIdList();
        List<Permission> permissions;
        if (null == permissionIds) {
            permissions = new ArrayList<Permission>();
        } else {
            permissions = permissionService.getPermissionByIdList(permissionIds);
        }
        sysRole.setPermissions(permissions);
        sysRole.setMenus(menuService.getMenuByPermission(permissions));
    }
}
