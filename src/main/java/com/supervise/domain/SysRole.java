package com.supervise.domain;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import org.hibernate.validator.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by HISTO on 2017/6/14.
 */
@Entity
@Table(name = "SysRole")
public class SysRole extends SuperEntity {
    /**角色代码*/
    @NotBlank(message = "角色代码不能为空")
    @Column(length = 50, unique = true)
    private String roleCode;

    /**角色名*/
    @NotBlank(message = "角色名称不能为空")
    @Column(length = 50, unique = true)
    private String roleName;

    /**角色、资源关联关系*/
    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinTable(name = "SysRole_Permission",
            joinColumns = {@JoinColumn(name = "SYSROLE_ID")},
            inverseJoinColumns = {@JoinColumn(name = "PERMISSION_ID")})
    private List<Permission> permissions = new ArrayList<Permission>();

    /**角色、用户关联关系*/
    @ManyToMany(mappedBy = "sysRoles")
    private List<SysUser> sysUsers = new ArrayList<SysUser>();

    /**菜单*/
    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinTable(name = "SysRole_Menu",
            joinColumns = {@JoinColumn(name = "SYSROLE_ID")},
            inverseJoinColumns = {@JoinColumn(name = "MENU_ID")})
    private List<Menu> menus = new ArrayList<Menu>();

    public enum RoleType {
        ADMIN		   ("ADMIN", "系统管理员"),
        SELLER		   ("SELLER", "销售人员"),
        AGENT		   ("AGENT", "运营人员"),
        DEVELOPER	   ("DEVELOPER", "开发者");

        private String code;
        private String desc;

        RoleType(String code, String desc) {
            this.code = code;
            this.desc = desc;
        }

        public String getCode() {
            return code;
        }

        public String getDesc() {
            return desc;
        }

        /**
         * 根据Code获取Desc
         * @param code
         * @return
         */
        public static String getDesc(String code) {
            for (RoleType c: RoleType.values()) {
                if (c.getCode().equals(code)) {
                    return c.getDesc();
                }
            }
            return null;
        }

        /**
         * 根据Code获取RoleCode
         * @param code
         * @return
         */
        public static RoleType getRoleCode(String code) {
            for (RoleType c: RoleType.values()) {
                if (c.getCode().equals(code)) {
                    return c;
                }
            }
            return null;
        }
    }

    public String getRoleCode() {
        return roleCode;
    }

    public void setRoleCode(String roleCode) {
        this.roleCode = roleCode;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public List<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<Permission> permissions) {
        this.permissions = permissions;
    }

    public List<SysUser> getSysUsers() {
        return sysUsers;
    }

    public void setSysUsers(List<SysUser> sysUsers) {
        this.sysUsers = sysUsers;
    }

    public List<Menu> getMenus() {
        return menus;
    }

    public void setMenus(List<Menu> menus) {
        this.menus = menus;
    }
}
