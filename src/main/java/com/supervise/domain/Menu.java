package com.supervise.domain;

import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.ArrayList;
import java.util.List;

/**
 * 左侧菜单栏
 *
 * Created by Nathaniel.
 */
@Entity
@Table(name = "Menu")
public class Menu extends SuperEntity {
    public static String[] Level_List = new String[]{"1", "2", "3"};

    /**菜单名称*/
    @NotBlank(message = "菜单名称不能为空")
    @Column(nullable = false)
    private String name;

    /**菜单URL*/
    private String href;

    /**菜单级别*/
    @NotBlank(message = "菜单级别不能为空")
    private String level;

    /**是否是链接*/
    private Boolean isLink;

    /**父菜单*/
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PARENT_ID")
    private Menu parent;

    /**排序*/
    @NotBlank(message = "菜单优先级不能为空")
    private String priority;

    /**描述*/
    private String description;

    /**代码*/
    private String code;

    /**子菜单*/
    @OneToMany(mappedBy = "parent")
    private List<Menu> subMenus = new ArrayList<Menu>();

    /**角色*/
    @ManyToMany(mappedBy = "menus")
    private List<SysRole> roles = new ArrayList<SysRole>();

    public Menu() {
        super();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHref() {
        return href;
    }

    public void setHref(String href) {
        this.href = href;
    }

    public List<Menu> getSubMenus() {
        return subMenus;
    }

    public void setSubMenus(List<Menu> subMenus) {
        this.subMenus = subMenus;
    }

    public List<SysRole> getRoles() {
        return roles;
    }

    public void setRoles(List<SysRole> roles) {
        this.roles = roles;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Boolean isLink() {
        return isLink;
    }

    public void setIsLink(Boolean isLink) {
        this.isLink = isLink;
    }

    public Menu getParent() {
        return parent;
    }

    public void setParent(Menu parent) {
        this.parent = parent;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Override
    public boolean equals(Object obj) {
        if(this == obj) return true;
        if(!(obj instanceof Menu)) return false;
        if(!this.getName().equals(((Menu) obj).getName())) return false;
//        if(!this.getHref().equals(((Menu) obj).getHref())) return false;
        if(!this.getLevel().equals(((Menu) obj).getLevel())) return false;
        if(!this.getPriority().equals(((Menu) obj).getPriority())) return false;
//        if(this.isLink() ^ ((Menu) obj).isLink()) return false;
//        if(!this.getDescription().equals(((Menu) obj).getDescription())) return false;
//        if(!this.getCode().equals(((Menu) obj).getCode())) return false;
        return true;
    }

    @Override
    public int hashCode() {
        int result = 17;
        result = 31 * result + this.getName().hashCode();
//        result = 31 * result + this.getHref().hashCode();
        result = 31 * result + this.getLevel().hashCode();
        result = 31 * result + this.getPriority().hashCode();
//        result = 31 * result + (this.isLink()?1:0);
//        result = 31 * result + this.getDescription().hashCode();
//        result = 31 * result + this.getCode().hashCode();
        return result;
    }
}
