package com.supervise.service;

import com.supervise.domain.SysUser;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by HISTO on 2017/6/14.
 */
public interface SysUserService {
    @Transactional(readOnly = true)
    SysUser getUserByUsername(String username);

    @Transactional(readOnly = true)
    String getUserPassword(Long id);
}
