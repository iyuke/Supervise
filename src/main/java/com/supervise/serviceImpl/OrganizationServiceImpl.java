package com.supervise.serviceImpl;

import com.supervise.domain.Organization;
import com.supervise.domain.OrganizationRepository;
import com.supervise.dto.OrganizationDto;
import com.supervise.service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by HISTO on 2017/6/29.
 */
@Service("organizationService")
public class OrganizationServiceImpl implements OrganizationService {
    @Autowired
    OrganizationRepository organizationRepository;

    @Override
    public List<OrganizationDto> getOrganizationDtos() {
        List<Organization> organizationList = organizationRepository.findTopLevelOrgs();
        return convertToDto(organizationList);
    }

    @Override
    public List<Organization> getTopLevelOrgs() {
        List<Organization> organizationList = organizationRepository.findTopLevelOrgs();
        return organizationList;
    }

    @Override
    public Organization getById(long id) {
        Organization organization = organizationRepository.findOne(id);
        return organization;
    }

    private List<OrganizationDto> convertToDto(List<Organization> organizations) {
        List<OrganizationDto> organizationDtoList = new ArrayList<OrganizationDto>();
        for (Organization org : organizations) {
            OrganizationDto organizationDto = new OrganizationDto(org);
            organizationDtoList.add(organizationDto);
        }
        return organizationDtoList;
    }

}
