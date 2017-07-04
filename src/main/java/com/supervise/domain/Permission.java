package com.supervise.domain;

import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by HISTO on 2017/6/14.
 */
@Entity
@Table(name = "Permission")
public class Permission extends SuperEntity {
    /**权限（功能）名称*/
    @NotBlank
    private String name;

    /**权限代码*/
    @NotBlank
    @Column(unique=true)
    private String code;

    /**权限类型*/
    @NotNull
    @Column(length = 50)
    @Enumerated(EnumType.STRING)
    private PermissionType permissionType;

    /**权限描述*/
    @Column(length = 500)
    private String permissionDescription;

    /**资源*/
    @ManyToMany(cascade = {CascadeType.REFRESH,CascadeType.MERGE,CascadeType.PERSIST}, fetch = FetchType.LAZY)
    @JoinTable(name = "Permission_SysResource",
            joinColumns = {@JoinColumn(name = "PERMISSION_ID")},
            inverseJoinColumns = {@JoinColumn(name = "SYSRESOURCE_ID")})
    private List<SysResource> resources = new ArrayList<SysResource>();

    /**角色*/
    @ManyToMany(mappedBy = "permissions")
    private List<SysRole> roles = new ArrayList<SysRole>();

    public Permission() {
        super();
    }

    public enum PermissionType {
        COMMON    					("00", "通用权限"),
        ORGANIZATION              	("02", "机构管理"),
        USER          				("03", "用户管理"),
        ROLE   						("04", "角色管理"),
        PERMISSION   				("05", "权限管理"),
        RESOURCE     				("06", "资源管理"),
        ACCOUNT     				("07", "账户管理"),
        MENU						("08", "菜单管理"),
        FIELD                       ("19", "字段控制");

        private String code;
        private String desc;

        PermissionType(String code, String desc) {
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
        public static String getDescByCode(String code) {
            for (PermissionType c: PermissionType.values()) {
                if (c.getCode().equals(code)) {
                    return c.getDesc();
                }
            }
            return null;
        }

        public static PermissionType getByCode(String code) {
            for (PermissionType type: PermissionType.values()) {
                if (type.getCode().equals(code)) {
                    return type;
                }
            }
            return null;
        }
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPermissionDescription() {
        return permissionDescription;
    }

    public void setPermissionDescription(String permissionDescription) {
        this.permissionDescription = permissionDescription;
    }

    public List<SysResource> getResources() {
        return resources;
    }

    public void setResources(List<SysResource> resources) {
        this.resources = resources;
    }

    public List<SysRole> getRoles() {
        return roles;
    }

    public void setRoles(List<SysRole> roles) {
        this.roles = roles;
    }

    public PermissionType getPermissionType() {
        return permissionType;
    }

    public void setPermissionType(PermissionType permissionType) {
        this.permissionType = permissionType;
    }
}
