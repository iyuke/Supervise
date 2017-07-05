package com.supervise.dto;

/**
 * Created by HISTO on 2017/7/5.
 */
public class ResourceSearchConditions extends Dto {
    public String resourceName;
    public String url;
    public String resourceType;
    public Integer currentPage;
    public Integer pageSize;

    public ResourceSearchConditions() {
        super();
    }

    public ResourceSearchConditions(String resourceName, String url, String resourceType, Integer currentPage,
                                    Integer pageSize) {
        super();
        this.resourceName = resourceName;
        this.url = url;
        this.resourceType = resourceType;
        this.currentPage = currentPage;
        this.pageSize = pageSize;
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
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
