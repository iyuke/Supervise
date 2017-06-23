package com.supervise.serviceImpl;

import com.supervise.domain.SysRole;
import com.supervise.service.SysRoleService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by HISTO on 2017/6/14.
 */
@Service("sysRoleService")
public class SysRoleServiceImpl implements SysRoleService {
    public List<SysRole> getByUserName(String userName) {
        return null;
    }
}
