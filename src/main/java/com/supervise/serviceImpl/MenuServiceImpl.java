package com.supervise.serviceImpl;

import com.supervise.common.util.DateUtil;
import com.supervise.common.util.ListSortUtil;
import com.supervise.domain.Menu;
import com.supervise.domain.MenuRepository;
import com.supervise.domain.Permission;
import com.supervise.domain.SysResource;
import com.supervise.domain.SysResourceRepository;
import com.supervise.domain.SysRole;
import com.supervise.dto.MenuDto;
import com.supervise.exception.BusinessException;
import com.supervise.service.MenuService;
import com.supervise.service.ResourceService;
import com.supervise.service.SysRoleService;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Stack;

/**
 * Created by HISTO on 2017/6/29.
 */
@Service("menuService")
public class MenuServiceImpl implements MenuService {
    @Autowired
    MenuRepository menuRepository;
    @Autowired
    SysResourceRepository sysResourceRepository;
    @Autowired
    SysRoleService sysRoleService;
    @Autowired
    ResourceService resourceService;

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

    @Override
    public List<Menu> getMenuByPermission(List<Permission> permissions) {
        //TODO improvement after add relationship between Menu and SysResource
        if(null == permissions) {
            throw new NullPointerException("权限列表为空");
        }
        List<Menu> menus = new ArrayList<Menu>();
        Set<Menu> menuSet = new HashSet<Menu>();
        List<Menu> allMenus = menuRepository.findAll();
        //利用Set去掉重复的SysResource
        Set<SysResource> allSysResource = new HashSet<SysResource>();
        for(Permission permission:permissions) {
            List<SysResource> sysResources = permission.getResources();
            if(null == sysResources || sysResources.isEmpty()) continue;
            allSysResource.addAll(sysResources);
        }
        for(SysResource sysResource:allSysResource) {
            for(int i=0; i<allMenus.size(); i++) {
                Menu menu = allMenus.get(i);
                if(menu.getHref().equals(sysResource.getUrl())) {
                    menuSet.add(menu);
                    while(null != menu.getParent()) {
                        menuSet.add(menu.getParent());
                        menu = menu.getParent();
                    }
                    allMenus.remove(i);
                }
            }
        }
        for(Menu menu:menuSet) {
            menus.add(menu);
        }
        return menus;
    }

    @Override
    public void createOrUpdate(MenuDto menuDto) throws BusinessException {
        Menu menu = new Menu(menuDto);
        if (menuDto.getId() != null) {
            Menu oldMenu = menuRepository.findOne(menuDto.getId());
            menu.setId(oldMenu.getId());
            menu.setCreateTime(oldMenu.getCreateTime());
            menu.setUpdateTime(DateUtil.getCurrentTime());
        }
        setMenuParent(menu, menuDto);
        setMenuHref(menu, menuDto);
        menuRepository.save(menu);
        sysRoleService.updateMenuReference();
    }

    @Override
    public List<Menu> getMenuByLevel(String level) {
        if(null == level)
            throw new NullPointerException("菜单级别为空");
        return menuRepository.findByLevel(level);
    }

    @Override
    public MenuDto getDtoById(Long menuId) {
        Menu menu = menuRepository.findOne(Long.valueOf(menuId));
        MenuDto menuDto = new MenuDto(menu);
        SysResource sysResource = sysResourceRepository.findByUrl(menu.getHref());
        if(null != sysResource) {
            //设置的href为某个资源的id
            menuDto.setHref(sysResource.getId().toString());
        } else {
            menuDto.setHref(menu.getHref());
        }
        return menuDto;
    }

    @Override
    public void delete(Long id) throws BusinessException {
        Menu menu = menuRepository.findOne(id);
        if (null == menu) {
            throw new BusinessException("菜单不存在！");
        }
        Stack<Menu> menuStack = new Stack<Menu>();
        menuStack.push(menu);
        setSubMenuForMenu(menuStack, menu);
        List<Menu> menuList = menuStack.subList(0, menuStack.size());
        sysRoleService.removeMenuReference(menuList);
        while (!menuStack.isEmpty()) {
            menuRepository.delete(menuStack.pop());
        }
    }

    private void sortMenu(List<Menu> menus) {
        ListSortUtil<Menu> sortUtil = new ListSortUtil<Menu>();
        sortUtil.sort(menus, "priority", null);
    }

    private void setMenuParent(Menu menu, MenuDto menuDto) throws BusinessException {
        if (!menuDto.getLevel().equals("1")) {
            Long parentId = menuDto.getParentId();
            if (null == parentId) {
                throw new BusinessException("未指定上级菜单！");
            }
            Menu parent = menuRepository.findOne(parentId);
            menu.setParent(parent);
        }
    }

    @Override
    public List<MenuDto> getDtoListByLevel(String level) {
        List<Menu> menus = getMenuByLevel(level);
        return convertToDto(menus);
    }

    private void setMenuHref(Menu menu, MenuDto menuDto) throws BusinessException {
        if (!menuDto.getIsLink()) {
            menu.setHref("#");
        } else {
            if (StringUtils.isBlank(menuDto.getHref())) {
                throw new BusinessException("未设置菜单链接！");
            }
            String[] href = menuDto.getHref().split(",");
            String url = resourceService.getUrlById(Long.valueOf(href[0]));
            menu.setHref(url);
        }
    }

    /**
     * 将给定Menu的所有子菜单，按菜单层级，逐层添加到Stack中
     * @param menuStack
     * @param menu
     */
    private void setSubMenuForMenu(Stack<Menu> menuStack, Menu menu) {
        List<Menu> subMenus = menu.getSubMenus();
        if (CollectionUtils.isEmpty(subMenus)) {
            return;
        }
        menuStack.addAll(subMenus);
        for (Menu subMenu : subMenus) {
            setSubMenuForMenu(menuStack, subMenu);
        }
    }
}
