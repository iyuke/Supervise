package com.supervise.serviceImpl;

import com.supervise.domain.Permission;
import com.supervise.domain.SysRole;
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

    public List<Permission> getByUsername(String username) {
        Set<Permission> permissions = new HashSet<Permission>();
        for (SysRole role : roleService.getByUserName(username)) {
            permissions.addAll(role.getPermissions());
        }
        return new ArrayList<Permission>(permissions);
    }
}
