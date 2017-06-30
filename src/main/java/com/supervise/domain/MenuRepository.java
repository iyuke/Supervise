package com.supervise.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Created by HISTO on 2017/6/29.
 */
public interface MenuRepository extends JpaRepository<Menu, Long> {
    @Query("from Menu m where m.level = :level order by m.priority")
    List<Menu> findByLevel(@Param("level") String level);

    List<Menu> findByRolesIn(List<SysRole> roles);
}

