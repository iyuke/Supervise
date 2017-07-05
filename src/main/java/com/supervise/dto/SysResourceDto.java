package com.supervise.dto;

import com.supervise.domain.SysResource;

/**
 * Created by HISTO on 2017/7/4.
 */
public class SysResourceDto extends Dto {
    private static final long serialVersionUID = 1L;

    private String resourceName;

    private String url;

    private String resourceType;

    private String resourceDescription;

    public SysResourceDto() {
        super();
    }

    public SysResourceDto(SysResource res) {
        id = res.getId();
        resourceName = res.getResourceName();
        url = res.getUrl();
        resourceType = res.getResourceType().getCode();
        resourceDescription = res.getResourceDescription();
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

    public String getResourceDescription() {
        return resourceDescription;
    }

    public void setResourceDescription(String resourceDescription) {
        this.resourceDescription = resourceDescription;
    }
}
