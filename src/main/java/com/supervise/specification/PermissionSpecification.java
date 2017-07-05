package com.supervise.specification;

import com.supervise.domain.Permission;
import com.supervise.dto.PermissionSearchConditions;
import org.apache.commons.lang.StringUtils;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by HISTO on 2017/7/4.
 */
public class PermissionSpecification implements Specification<Permission> {
    private String name;
    private String code;
    private Permission.PermissionType permissionType;

    public PermissionSpecification(PermissionSearchConditions searchConditions) {
        super();
        this.name = searchConditions.getName();
        this.code = searchConditions.getCode();
        this.permissionType = Permission.PermissionType.getByCode(searchConditions.getPermissionType());
    }

    public PermissionSpecification(String name, String code, Permission.PermissionType permissionType) {
        super();
        this.name = name;
        this.code = code;
        this.permissionType = permissionType;
    }

    @Override
    public Predicate toPredicate(Root<Permission> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        List<Predicate> list = new ArrayList<Predicate>();

        if (StringUtils.isNotBlank(name)) {
            list.add(cb.like(root.get("name").as(String.class), "%" + name + "%"));
        }
        if (StringUtils.isNotBlank(code)) {
            list.add(cb.like(root.get("code").as(String.class), "%" + code + "%"));
        }
        if (null != permissionType) {
            list.add(cb.equal(root.get("permissionType"), permissionType));
        }

        Predicate[] p = new Predicate[list.size()];
        return cb.and(list.toArray(p));
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Permission.PermissionType getPermissionType() {
        return permissionType;
    }

    public void setPermissionType(Permission.PermissionType permissionType) {
        this.permissionType = permissionType;
    }
}
