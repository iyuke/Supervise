package com.supervise.domain;

import com.supervise.domain.SysResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Created by HISTO on 2017/6/20.
 */
public interface SysResourceRepository extends JpaRepository<SysResource, Long>,JpaSpecificationExecutor<SysResource> {
    @Query("from SysResource s group by resourceType")
    List<SysResource> findSysResourceGroup();

    @Query("from SysResource s where resourceType =:resourceType")
    List<SysResource> findSysResourcesByType(@Param("resourceType") SysResource.SysResourceType resourceType);

    @Query("from SysResource s where id in (:idList)")
    List<SysResource> findSysResourcesByIds(@Param("idList") List<Long> idList);

    @Query("from SysResource s where url = :url")
    SysResource findByUrl(@Param("url") String url);

}

