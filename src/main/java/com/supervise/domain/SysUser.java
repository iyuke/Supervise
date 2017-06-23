package com.supervise.domain;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by HISTO on 2017/6/14.
 */
@Entity
@Table(name = "SysUser")
public class SysUser extends SuperEntity {
    /**
     * 用户名
     */
    @Column(length = 20, unique = true)
    private String userName;

    /**
     * 密码
     */
    @Column(length = 1024)
    private String password;

    /**
     * 手机号
     */
    @Column(length = 100)
    @Length(max = 100, message = "手机号长度不能大于100")
    private String mobilePhone;

    /**
     * 邮箱
     */
    @Email
    @Column(length = 100)
    @Length(max = 100, message = "邮箱长度不能大于100")
    private String email;

    /**
     * 性别
     */
    @Column(length = 1)
    private String gender;

    /**
     * 年龄
     */
    @Min(0)
    @Max(200)
    private Integer age;

    /**
     * 职务
     */
    @Length(max = 20, message = "职务长度不能大于20")
    private String duty;

    /**
     * 民族
     */
    private String nation;

    /**
     * 籍贯
     */
    private String nativePlace;

    /**
     * 地址
     */
    private String address;

    /**
     * 备注
     */
    @Column(length = 200)
    private String remark;

    /**
     * 最后登录时间
     */
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastLoginDate;

    /**
     * 用户是否有效
     */
    private Boolean valid = true;

    /**
     * 用户、角色关联关系
     */
    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinTable(name = "SysUser_SysRole",
            joinColumns = {@JoinColumn(name = "SYSUSER_ID")},
            inverseJoinColumns = {@JoinColumn(name = "SYSROLE_ID")})
    private List<SysRole> sysRoles = new ArrayList<SysRole>();

    /**
     * 用户所属组织
     */
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "ORGANIZATION_ID")
    private Organization organization;

    public SysUser() {
        super();
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getMobilePhone() {
        return mobilePhone;
    }

    public void setMobilePhone(String mobilePhone) {
        this.mobilePhone = mobilePhone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getDuty() {
        return duty;
    }

    public void setDuty(String duty) {
        this.duty = duty;
    }

    public String getNation() {
        return nation;
    }

    public void setNation(String nation) {
        this.nation = nation;
    }

    public String getNativePlace() {
        return nativePlace;
    }

    public void setNativePlace(String nativePlace) {
        this.nativePlace = nativePlace;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Date getLastLoginDate() {
        return lastLoginDate;
    }

    public void setLastLoginDate(Date lastLoginDate) {
        this.lastLoginDate = lastLoginDate;
    }

    public Boolean getValid() {
        return valid;
    }

    public void setValid(Boolean valid) {
        this.valid = valid;
    }

    public List<SysRole> getSysRoles() {
        return sysRoles;
    }

    public void setSysRoles(List<SysRole> sysRoles) {
        this.sysRoles = sysRoles;
    }

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }
}
