package com.supervise.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Created by HISTO on 2017/6/20.
 */
public interface SysUserRepository extends JpaRepository<SysUser, Long>,JpaSpecificationExecutor<SysUser> {

    @Query("from SysUser r where r.userName = :userName")
    SysUser findByUserName(@Param("userName") String userName);

    @Query("select u.password from SysUser u where u.id = :id")
    String findPasswordById(@Param("id") Long id);
}

