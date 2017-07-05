package com.supervise.dto;

/**
 * Created by HISTO on 2017/7/4.
 */
public class PermissionSearchConditions extends Dto {
    public String name;
    public String code;
    public String permissionType;
    public Integer currentPage;
    public Integer pageSize;

    public PermissionSearchConditions() {
        super();
    }

    public PermissionSearchConditions(String name, String code, String permissionType, Integer currentPage,
                                      Integer pageSize) {
        super();
        this.name = name;
        this.code = code;
        this.permissionType = permissionType;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
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

    public Integer getCurrentPage() {
        return currentPage;
    }

    public void setCurrentPage(Integer currentPage) {
        this.currentPage = currentPage;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }
}
