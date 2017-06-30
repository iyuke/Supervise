package com.supervise.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Created by HISTO on 2017/6/30.
 */
public interface OrganizationRepository extends JpaRepository<Organization, Long>,JpaSpecificationExecutor<Organization> {
    @Query("from Organization p where parent = null order by id")
    List<Organization> findTopLevelOrgs();
}
