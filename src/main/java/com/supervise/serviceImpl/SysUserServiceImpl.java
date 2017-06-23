package com.supervise.serviceImpl;

import com.supervise.domain.SysUser;
import com.supervise.service.SysUserService;
import org.springframework.stereotype.Service;

/**
 * Created by HISTO on 2017/6/14.
 */
@Service("sysUserService")
public class SysUserServiceImpl implements SysUserService {
    public SysUser getUserByUsername(String username) {
        return null;
    }

    public String getUserPassword(Long id) {
        return null;
    }
}
