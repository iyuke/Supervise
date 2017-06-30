package com.supervise.dto;

import com.supervise.domain.Menu;

/**
 * Created by HISTO on 2017/6/29.
 */
public class MenuDto extends Dto {
    private static final long serialVersionUID = 3637541334451391130L;

    private String name;
    private String href;
    private String level;
    private Boolean isLink;
    private Long parentId;
    private String parentName;
    private String priority;
    private String description;
    private String code;
    private Boolean hasChild;

    public MenuDto() {
        super();
    }

    public MenuDto(Menu menu) {
        super();
        this.id = menu.getId();
        this.name = menu.getName();
        this.href = menu.getHref();
        this.level = menu.getLevel();
        this.isLink = menu.isLink();
        this.parentId = menu.getParent()==null ? -1 : menu.getParent().getId();
        this.parentName = menu.getParent()==null ? "" : menu.getParent().getName();
        this.priority = menu.getPriority();
        this.description = menu.getDescription();
        this.code = menu.getCode();
        this.hasChild = menu.getSubMenus() != null && menu.getSubMenus().size() > 0;
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

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Boolean getIsLink() {
        return isLink;
    }

    public void setIsLink(Boolean isLink) {
        this.isLink = isLink;
    }

    public Long getParentId() { return parentId; }

    public void setParentId(Long id) { this.parentId = id; }

    public String getParentName() {
        return parentName;
    }

    public void setParentName(String parentName) {
        this.parentName = parentName;
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

    public Boolean getHasChild() {
        return hasChild;
    }

    public void setHasChild(Boolean hasChild) {
        this.hasChild = hasChild;
    }
}
