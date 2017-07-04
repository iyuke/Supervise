package com.supervise.dto;

import java.util.List;

/**
 * Created by HISTO on 2017/6/30.
 */
public class PermissionGroupDto extends Dto {
    private String code;
    private String desc;
    private List<PermissionDto> permissionDtoList;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public List<PermissionDto> getPermissionDtoList() {
        return permissionDtoList;
    }

    public void setPermissionDtoList(List<PermissionDto> permissionDtoList) {
        this.permissionDtoList = permissionDtoList;
    }

    public PermissionGroupDto() {
        super();
    }

}
