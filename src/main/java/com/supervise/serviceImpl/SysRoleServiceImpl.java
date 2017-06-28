package com.supervise.serviceImpl;

import com.supervise.domain.SysRole;
import com.supervise.domain.SysRoleRepository;
import com.supervise.service.SysRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by HISTO on 2017/6/14.
 */
@Service("sysRoleService")
public class SysRoleServiceImpl implements SysRoleService {
    @Autowired
    SysRoleRepository sysRoleRepository;

    @Override
    @Cacheable(value = "userRoles", key = "#userName")
    public List<SysRole> getByUserName(String userName) {
        List<SysRole> sysRoleList = sysRoleRepository.findBySysUsers_UserName(userName);
        for (SysRole sysRole : sysRoleList) {
            sysRole.getPermissions().size();
        }
        return sysRoleList;
    }
}
