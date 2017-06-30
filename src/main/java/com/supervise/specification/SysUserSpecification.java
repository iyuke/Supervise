package com.supervise.specification;

import com.supervise.domain.SysRole;
import com.supervise.domain.SysUser;
import com.supervise.dto.UserSearchConditions;
import org.apache.commons.lang.StringUtils;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.ListJoin;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by HISTO on 2017/6/29.
 */
public class SysUserSpecification implements Specification<SysUser> {

    private String roleType;

    private String userName;

    private Long organizationId;

    public SysUserSpecification() {
    }

    public SysUserSpecification(UserSearchConditions searchConditions) {
        super();
        this.roleType = searchConditions.getRoleType();
        this.userName = searchConditions.getUsername();
        this.organizationId = searchConditions.getOrganizationId();
    }

    @Override
    public Predicate toPredicate(Root<SysUser> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        List<Predicate> list = new ArrayList<Predicate>(1);
        if (StringUtils.isNotBlank(roleType)) {
            ListJoin<SysUser, SysRole> join = root.join(root.getModel().getDeclaredList("sysRoles", SysRole.class), JoinType.LEFT);
            Predicate predicate = cb.equal(join.get("roleCode").as(String.class), roleType);
            list.add(predicate);
        }
        if (StringUtils.isNotBlank(userName)) {
            list.add(cb.like(root.get("userName").as(String.class), "%" + userName + "%"));
        }
        if (organizationId != null) {
            list.add(cb.equal(root.get("organization").get("id"), organizationId));
        }

        Predicate[] p = new Predicate[list.size()];
        return cb.and(list.toArray(p));
    }

    public String getRoleType() {
        return roleType;
    }

    public void setRoleType(String roleType) {
        this.roleType = roleType;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
