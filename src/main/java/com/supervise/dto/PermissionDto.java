package com.supervise.dto;

import com.supervise.domain.Permission;
import com.supervise.domain.SysResource;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by HISTO on 2017/6/30.
 */
public class PermissionDto extends Dto {
    private static final long serialVersionUID = 1L;
    private String name;
    private String code;
    private String permissionType;
    private String permissionDescription;
    private List<Long> resourceIdList;

    public PermissionDto() {
        super();
    }

    public PermissionDto(Permission permission) {
        super();
        this.id = permission.getId();
        this.code = permission.getCode();
        this.name = permission.getName();
        this.resourceIdList = new ArrayList<Long>();
        this.permissionType = permission.getPermissionType().getCode();
        this.permissionDescription = permission.getPermissionDescription();
        for (SysResource s : permission.getResources()) {
            this.resourceIdList.add(s.getId());
        }
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPermissionType() {
        return permissionType;
    }

    public void setPermissionType(String permissionType) {
        this.permissionType = permissionType;
    }

    public String getPermissionDescription() {
        return permissionDescription;
    }

    public void setPermissionDescription(String permissionDescription) {
        this.permissionDescription = permissionDescription;
    }

    public List<Long> getResourceIdList() {
        return resourceIdList;
    }

    public void setResourceIdList(List<Long> resourceIdList) {
        this.resourceIdList = resourceIdList;
    }
}
