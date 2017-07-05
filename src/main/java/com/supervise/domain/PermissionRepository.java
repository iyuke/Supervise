package com.supervise.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Created by HISTO on 2017/6/30.
 */
public interface PermissionRepository extends JpaRepository<Permission, Long>,JpaSpecificationExecutor<Permission> {
    @Query("from Permission p where p.id in (:ids)")
    List<Permission> findByIdIn(@Param("ids") List<Long> ids);

    @Query("from Permission p group by permissionType")
    List<Permission> findPermissionGroup();

    @Query("from Permission p where permissionType =:permissionType")
    List<Permission> findPermissionByType(@Param("permissionType") Permission.PermissionType permissionType);

    @Query("from Permission p where p.code = :code")
    Permission findByCode(@Param("code") String code);
}
