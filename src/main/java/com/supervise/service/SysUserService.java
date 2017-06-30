package com.supervise.service;

import com.supervise.domain.SysRole;
import com.supervise.domain.SysUser;
import com.supervise.dto.UserDto;
import com.supervise.exception.BusinessException;
import com.supervise.specification.SysUserSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by HISTO on 2017/6/14.
 */
public interface SysUserService {
    @Transactional(readOnly = true)
    SysUser getUserByUsername(String username);

    @Transactional(readOnly = true)
    String getUserPassword(Long id);

    @Transactional(readOnly = true)
    Page<SysUser> getBySpec(SysUserSpecification spec, Pageable pageable);

    @Transactional
    SysUser createOrUpdate(UserDto userDto) throws BusinessException;

    @Transactional(readOnly = true)
    boolean isExistUsername(String username);

    @Transactional(readOnly = true)
    UserDto getUserDtoById(Long id);

    @Transactional
    void resetPwd(Long userId);
}
