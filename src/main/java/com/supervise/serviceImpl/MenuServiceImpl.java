package com.supervise.serviceImpl;

import com.supervise.common.util.ListSortUtil;
import com.supervise.domain.Menu;
import com.supervise.domain.MenuRepository;
import com.supervise.domain.SysRole;
import com.supervise.dto.MenuDto;
import com.supervise.service.MenuService;
import com.supervise.service.SysRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Created by HISTO on 2017/6/29.
 */
@Service("menuService")
public class MenuServiceImpl implements MenuService {
    @Autowired
    MenuRepository menuRepository;
    @Autowired
    SysRoleService sysRoleService;

    @Override
    public List<MenuDto> getDtoListByUsername(String userName) {
        List<Menu> menus = getMenuByRoleList(sysRoleService.getByUserName(userName));
        return convertToDto(menus);
    }

    @Override
    public List<MenuDto> convertToDto(List<Menu> menus) {
        ArrayList<MenuDto> menuDtos = new ArrayList<MenuDto>();
        for(Menu menu:menus) {
            menuDtos.add(new MenuDto(menu));
        }
        return menuDtos;
    }

    @Override
    public List<Menu> getMenuByRoleList(List<SysRole> roleList) {
        if(null == roleList) {
            throw new NullPointerException("角色列表为空");
        }

        List<Menu> menuList = menuRepository.findByRolesIn(roleList);
        Set<Menu> menuSet = new HashSet<Menu>(menuList);
        menuList = new ArrayList<Menu>(menuSet);
        sortMenu(menuList);
        return menuList;
    }

    private void sortMenu(List<Menu> menus) {
        ListSortUtil<Menu> sortUtil = new ListSortUtil<Menu>();
        sortUtil.sort(menus, "priority", null);
    }
}
