package com.supervise.domain;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by HISTO on 2017/6/20.
 */
@Entity
@Table(name = "Organization")
public class Organization extends SuperEntity {
    /**
     * 机构名称
     */
    @NotBlank(message = "机构名称不能为空")
    @Length(max = 100, message = "机构名称不能大于100")
    private String name;

    /**
     * 所属机构
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Organization parent;

    /**
     * 所辖机构
     */
    @OneToMany(mappedBy = "parent", fetch = FetchType.EAGER)
    private List<Organization> subOrg = new ArrayList<Organization>();

    /**
     * 地址
     */
    @Length(max = 100, message = "地址长度不能大于100")
    private String address;

    /**
     * 描述
     */
    @Length(max = 200, message = "描述长度不能大于200")
    private String description;

    public Organization() {
        super();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Organization getParent() {
        return parent;
    }

    public void setParent(Organization parent) {
        this.parent = parent;
    }

    public List<Organization> getSubOrg() {
        return subOrg;
    }

    public void setSubOrg(List<Organization> subOrg) {
        this.subOrg = subOrg;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
