package com.supervise.dto;

import com.supervise.domain.Organization;

import java.util.List;

/**
 * Created by HISTO on 2017/6/30.
 */
public class OrganizationDto extends Dto {
    private String name;
    private String leader;
    private Long leaderId;
    private String address;
    private String level;
    private String description;
    private boolean hasFather;
    private Long parentId;
    private List<Organization> subOrganization;

    public OrganizationDto() {}

    public OrganizationDto(Organization org) {
        super(org);
        this.name = org.getName();
        this.address = org.getAddress();
        this.description = org.getDescription();
        if (org.getParent() != null) {
            this.setHasFather(true);
            this.parentId = org.getParent().getId();
        } else {
            this.setHasFather(false);
        }
        this.subOrganization = org.getSubOrg();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLeader() {
        return leader;
    }

    public void setLeader(String leader) {
        this.leader = leader;
    }

    public Long getLeaderId() {
        return leaderId;
    }

    public void setLeaderId(Long leaderId) {
        this.leaderId = leaderId;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isHasFather() {
        return hasFather;
    }

    public void setHasFather(boolean hasFather) {
        this.hasFather = hasFather;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public List<Organization> getSubOrganization() {
        return subOrganization;
    }

    public void setSubOrganization(List<Organization> subOrganization) {
        this.subOrganization = subOrganization;
    }
}
