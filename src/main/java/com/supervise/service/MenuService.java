package com.supervise.service;

import com.supervise.domain.Menu;
import com.supervise.domain.Permission;
import com.supervise.domain.SysRole;
import com.supervise.dto.MenuDto;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by HISTO on 2017/6/29.
 */
public interface MenuService {
    @Transactional(readOnly = true)
    List<MenuDto> getDtoListByUsername(String userName);

    @Transactional(readOnly = true)
    List<Menu> getMenuByRoleList(List<SysRole> roleList);

    @Transactional(readOnly = true)
    List<MenuDto> convertToDto(List<Menu> menus);

    @Transactional(readOnly = true)
    List<Menu> getMenuByPermission(List<Permission> permissions);
}
