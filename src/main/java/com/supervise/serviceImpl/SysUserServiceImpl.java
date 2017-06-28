package com.supervise.serviceImpl;

import com.supervise.domain.SysUser;
import com.supervise.domain.SysUserRepository;
import com.supervise.service.SysUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by HISTO on 2017/6/14.
 */
@Service("sysUserService")
public class SysUserServiceImpl implements SysUserService {
    @Autowired
    SysUserRepository userRepository;

    @Override
    public SysUser getUserByUsername(String username) {
        SysUser user = userRepository.findByUserName(username);
        return user;
    }

    public String getUserPassword(Long id) {
        return userRepository.findPasswordById(id);
    }
}
