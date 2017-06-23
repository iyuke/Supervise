package com.supervise.domain;

import com.supervise.domain.SysResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * Created by HISTO on 2017/6/20.
 */
public interface SysResourceRepository extends JpaRepository<SysResource, Long>,JpaSpecificationExecutor<SysResource> {

}

