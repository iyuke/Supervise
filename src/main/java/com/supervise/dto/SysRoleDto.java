package com.supervise.dto;

import com.supervise.domain.Permission;
import com.supervise.domain.SysRole;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by HISTO on 2017/6/30.
 */
public class SysRoleDto extends Dto {
    private String roleName;
    private String roleCode;
    private List<String> permissionIdList;

    public SysRoleDto() {
        super();
    }

    public SysRoleDto(SysRole sysRole) {
        super();
        this.id = sysRole.getId();
        this.roleName = sysRole.getRoleName();
        this.roleCode = sysRole.getRoleCode();
        this.permissionIdList = new ArrayList<String>();
        for(Permission p:sysRole.getPermissions()) {
            this.permissionIdList.add(String.valueOf(p.getId()));
        }
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleCode() {
        return roleCode;
    }

    public void setRoleCode(String roleCode) {
        this.roleCode = roleCode;
    }

    public List<String> getPermissionIdList() {
        return permissionIdList;
    }

    public void setPermissionIdList(List<String> permissionIdList) {
        this.permissionIdList = permissionIdList;
    }
}
