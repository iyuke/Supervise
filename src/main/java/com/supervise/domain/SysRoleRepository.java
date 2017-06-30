package com.supervise.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Created by HISTO on 2017/6/28.
 */
public interface SysRoleRepository  extends JpaRepository<SysRole, Long> {
    List<SysRole> findBySysUsers_UserName(String userName);

    @Query("from SysRole  where id in (:idList)")
    List<SysRole> findSysRolesByIds(@Param("idList") List<Long> idList);
}
