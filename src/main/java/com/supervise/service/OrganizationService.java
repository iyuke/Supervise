package com.supervise.service;

import com.supervise.domain.Organization;
import com.supervise.dto.OrganizationDto;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by HISTO on 2017/6/29.
 */
public interface OrganizationService {
    @Transactional(readOnly = true)
    List<OrganizationDto> getOrganizationDtos();

    @Transactional(readOnly = true)
    List<Organization> getTopLevelOrgs();

    @Transactional
    Organization getById(long id);
}
