package com.supervise.specification;

import com.supervise.domain.SysResource;
import com.supervise.dto.ResourceSearchConditions;
import org.apache.commons.lang.StringUtils;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by HISTO on 2017/7/5.
 */
public class ResourceSpecification implements Specification<SysResource> {


    private String resourceName;
    private String url;
    private SysResource.SysResourceType resourceType;

    public ResourceSpecification(String resourceName, String url) {
        super();
        this.resourceName = resourceName;
        this.url = url;
    }

    public ResourceSpecification(ResourceSearchConditions searchConditions) {
        super();
        this.resourceName = searchConditions.getResourceName();
        this.url = searchConditions.getUrl();
        this.resourceType = SysResource.SysResourceType.getByCode(searchConditions.resourceType);
    }

    @Override
    public Predicate toPredicate(Root<SysResource> root, CriteriaQuery<?> query, CriteriaBuilder cb) {
        List<Predicate> list = new ArrayList<Predicate>();

        if (StringUtils.isNotBlank(resourceName)) {
            list.add(cb.like(root.get("resourceName").as(String.class), "%" + resourceName + "%"));
        }
        if (StringUtils.isNotBlank(url)) {
            list.add(cb.like(root.get("url").as(String.class), "%" + url + "%"));
        }
        if (null != resourceType) {
            list.add(cb.equal(root.get("resourceType"), resourceType));
        }

        Predicate[] p = new Predicate[list.size()];
        return cb.and(list.toArray(p));
    }

    public String getResourceName() {
        return resourceName;
    }

    public void setResourceName(String resourceName) {
        this.resourceName = resourceName;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public SysResource.SysResourceType getResourceType() {
        return resourceType;
    }

    public void setResourceType(SysResource.SysResourceType resourceType) {
        this.resourceType = resourceType;
    }
}

