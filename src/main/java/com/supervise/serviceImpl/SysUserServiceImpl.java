package com.supervise.serviceImpl;

import com.supervise.common.constant.Constants;
import com.supervise.common.util.EncryptUtil;
import com.supervise.domain.Organization;
import com.supervise.domain.SysRole;
import com.supervise.domain.SysUser;
import com.supervise.domain.SysUserRepository;
import com.supervise.dto.UserDto;
import com.supervise.exception.BusinessException;
import com.supervise.service.OrganizationService;
import com.supervise.service.SysRoleService;
import com.supervise.service.SysUserService;
import com.supervise.specification.SysUserSpecification;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by HISTO on 2017/6/14.
 */
@Service("sysUserService")
public class SysUserServiceImpl implements SysUserService {
    @Autowired
    SysUserRepository userRepository;
    @Autowired
    SysRoleService sysRoleService;
    @Autowired
    OrganizationService organizationService;

    @Override
    public SysUser getUserByUsername(String username) {
        SysUser user = userRepository.findByUserName(username);
        return user;
    }

    public String getUserPassword(Long id) {
        return userRepository.findPasswordById(id);
    }

    @Override
    public Page<SysUser> getBySpec(SysUserSpecification spec, Pageable pageable) {
        Page<SysUser> sysUsers = userRepository.findAll(spec, pageable);
        List<SysUser> sysUserList = sysUsers.getContent();
        for (SysUser sysUser : sysUserList) {
            sysUser.setOrganizationsName(null == sysUser.getOrganization() ? "" : sysUser.getOrganization().getName());
        }
        return sysUsers;
    }

    @Override
    public SysUser createOrUpdate(UserDto userDto) throws BusinessException {
        if (CollectionUtils.isEmpty(userDto.getUserRoleList())) {
            throw new BusinessException("用户角色不能为空！");
        }
        // 判断用户名是否为空，为空则生成随机字符串；不为空则判断是否用户名已存在
        if (StringUtils.isBlank(userDto.getUserName())) {
            throw new BusinessException("用户名不能为空！");
        }
        if (userDto.getId() == null) {
            if (isExistUsername(userDto.getUserName())) {
                throw new BusinessException("用户名已存在！");
            }
        }

        SysUser sysUser = new SysUser(userDto);
        if (userDto.getId() != null) {
            sysUser.setId(userDto.getId());
        }
        if (userDto.getParentUserId() == null) {
            sysUser.setLeader(null);
        } else {
            sysUser.setLeader(userRepository.findOne(userDto.getParentUserId()));
        }

        List<SysRole> sysRoles = sysRoleService.getSysRolesByIds(userDto.getUserRoleList());
        sysUser.setSysRoles(sysRoles);
        if (userDto.getOrganizationId() != null) {
            Organization organization = organizationService.getById(userDto.getOrganizationId());
            sysUser.setOrganization(organization);
        }
        sysUser.setPassword(EncryptUtil.encryptAsString(Constants.DEFAULT_PASSWORD));

        SysUser user = userRepository.save(sysUser);
        return user;
    }

    @Override
    public boolean isExistUsername(String username) {
        SysUser user = userRepository.findByUserName(username);
        return null != user;
    }

    @Override
    public UserDto getUserDtoById(Long id) {
        SysUser user = userRepository.findOne(id);
        UserDto userDto = new UserDto(user);
        return userDto;
    }

    @Override
    public void resetPwd(Long userId) {
        SysUser user = userRepository.findOne(userId);
        // 重置用户密码
        user.setPassword(EncryptUtil.encryptAsString(Constants.DEFAULT_PASSWORD));
        userRepository.save(user);
    }
}
