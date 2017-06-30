package com.supervise.service;

import com.supervise.domain.SysRole;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by HISTO on 2017/6/14.
 */
public interface SysRoleService {
    /**
     * 获取用户角色
     * @param userName
     * @return
     */
    @Transactional(readOnly = true)
    List<SysRole> getByUserName(String userName);

    @Transactional(readOnly = true)
    List<SysRole> getSysRolesByIds(List<Long> idList);

    @Transactional(readOnly = true)
    List<SysRole> getAllSysRoles();
}
