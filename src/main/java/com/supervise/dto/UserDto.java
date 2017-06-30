package com.supervise.dto;

import com.supervise.domain.Organization;
import com.supervise.domain.SysRole;
import com.supervise.domain.SysUser;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by HISTO on 2017/6/30.
 */
public class UserDto extends Dto {
    private static final long serialVersionUID = 6346331048328807092L;

    protected String userName;
    protected String password;
    protected String mobilePhone;
    protected String email;
    protected String gender;
    protected Integer age;
    protected Date lastLoginDate;
    protected Boolean valid;
    private String duty;
    private String remark;
    private String nation;
    private String nativePlace;
    private String address;
    private Long organizationId;
    private String organizationName;

    private List<Long> userRoleList;
    private List<Long> userOrgList;

    private Long parentUserId;
    private List<Long> subUserIdList = new ArrayList<Long>();

    private UserDto parentUser;
    private List<UserDto> subUserList = new ArrayList<UserDto>();

    public UserDto() {
        super();
    }

    public UserDto(SysUser user) {
        super(user);
        this.userName = user.getUserName();
        this.password = user.getPassword();
        this.mobilePhone = user.getMobilePhone();
        this.email = user.getEmail();
        this.gender = user.getGender();
        this.age = user.getAge();
        this.lastLoginDate = user.getLastLoginDate();
        this.valid = user.getValid();
        this.duty = user.getDuty();
        this.remark = user.getRemark();
        this.nation = user.getNation();
        this.nativePlace = user.getNativePlace();
        this.address = user.getAddress();
        this.organizationId = null == user.getOrganization() ? null : user.getOrganization().getId();
        this.organizationName = null == user.getOrganization() ? null : user.getOrganization().getName();


        List<Long> userRoleList = new ArrayList<Long>(user.getSysRoles().size());
        for (SysRole role : user.getSysRoles()) {
            userRoleList.add(role.getId());
        }
        this.setUserRoleList(userRoleList);

        this.parentUserId = user.getLeader() != null ? user.getLeader().getId() : null;
        for (SysUser sysUser : user.getMembers()) {
            this.subUserIdList.add(sysUser.getId());
        }

    }

    public static List<UserDto> convertSysUserToUserDto(List<SysUser> sysUserList) {
        List<UserDto> userDtoList = new ArrayList<UserDto>();
        for (SysUser sysUser : sysUserList) {
            userDtoList.add(new UserDto(sysUser));
        }
        return userDtoList;
    }

    public static long getSerialVersionUID() {
        return serialVersionUID;
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

    public String getDuty() {
        return duty;
    }

    public void setDuty(String duty) {
        this.duty = duty;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
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

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public List<Long> getUserRoleList() {
        return userRoleList;
    }

    public void setUserRoleList(List<Long> userRoleList) {
        this.userRoleList = userRoleList;
    }

    public List<Long> getUserOrgList() {
        return userOrgList;
    }

    public void setUserOrgList(List<Long> userOrgList) {
        this.userOrgList = userOrgList;
    }

    public Long getParentUserId() {
        return parentUserId;
    }

    public void setParentUserId(Long parentUserId) {
        this.parentUserId = parentUserId;
    }

    public List<Long> getSubUserIdList() {
        return subUserIdList;
    }

    public void setSubUserIdList(List<Long> subUserIdList) {
        this.subUserIdList = subUserIdList;
    }

    public UserDto getParentUser() {
        return parentUser;
    }

    public void setParentUser(UserDto parentUser) {
        this.parentUser = parentUser;
    }

    public List<UserDto> getSubUserList() {
        return subUserList;
    }

    public void setSubUserList(List<UserDto> subUserList) {
        this.subUserList = subUserList;
    }
}
