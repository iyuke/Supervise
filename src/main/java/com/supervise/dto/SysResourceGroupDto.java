package com.supervise.dto;

import com.supervise.domain.SysResource;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by HISTO on 2017/7/4.
 */
public class SysResourceGroupDto extends Dto {
    private static final long serialVersionUID = 1L;

    private String resourceTypeCode;
    private String resourceTypeName;

    private List<SysResourceDto> sysResourceDtoList = new ArrayList<SysResourceDto>();

    public SysResourceGroupDto() {
        super();
    }

    public SysResourceGroupDto(SysResource res) {
        resourceTypeCode = res.getResourceType().getCode();
        resourceTypeName = res.getResourceType().getDesc();
    }

    public String getResourceTypeCode() {
        return resourceTypeCode;
    }

    public void setResourceTypeCode(String resourceTypeCode) {
        this.resourceTypeCode = resourceTypeCode;
    }

    public String getResourceTypeName() {
        return resourceTypeName;
    }

    public void setResourceTypeName(String resourceTypeName) {
        this.resourceTypeName = resourceTypeName;
    }

    public List<SysResourceDto> getSysResourceDtoList() {
        return sysResourceDtoList;
    }

    public void setSysResourceDtoList(List<SysResourceDto> sysResourceDtoList) {
        this.sysResourceDtoList = sysResourceDtoList;
    }

}
