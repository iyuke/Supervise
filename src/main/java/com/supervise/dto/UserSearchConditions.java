package com.supervise.dto;

import com.supervise.common.constant.Constants;

/**
 * Created by HISTO on 2017/6/29.
 */
public class UserSearchConditions {
    private String username;
    private Long organizationId;
    private String roleType;
    private Integer currentPage;
    private Integer pageSize;

    public UserSearchConditions() {
        super();
        this.currentPage = Constants.DEFAULT_PAGE_INDEX;
        this.pageSize = Constants.DEFAULT_PAGE_SIZE;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public String getRoleType() {
        return roleType;
    }

    public void setRoleType(String roleType) {
        this.roleType = roleType;
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
