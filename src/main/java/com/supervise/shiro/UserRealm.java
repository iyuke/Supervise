package com.supervise.shiro;

import com.supervise.domain.Permission;
import com.supervise.domain.SysRole;
import com.supervise.domain.SysUser;
import com.supervise.service.PermissionService;
import com.supervise.service.SysRoleService;
import com.supervise.service.SysUserService;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.IncorrectCredentialsException;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authc.credential.CredentialsMatcher;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.cache.CacheManager;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by HISTO on 2017/6/14.
 */
public class UserRealm extends AuthorizingRealm {
    @Autowired
    private PermissionService permissionService;
    @Autowired
    private SysRoleService roleService;
    @Autowired
    private SysUserService userService;

    public UserRealm(CacheManager cacheManager, CredentialsMatcher matcher) {
        super(cacheManager, matcher);
    }

    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
        String username = (String) SecurityUtils.getSubject().getPrincipal();
        if (!StringUtils.isEmpty(username)) {
            List<String> roleCodes = new ArrayList<String>();
            for (SysRole role : roleService.getByUserName(username)) {
                roleCodes.add(role.getRoleCode());
            }
            authorizationInfo.addRoles(roleCodes);

            List<String> permissionCodes = new ArrayList<String>();
            for (Permission permission : permissionService.getByUsername(username)) {
                permissionCodes.add(permission.getCode());
            }
            authorizationInfo.addStringPermissions(permissionCodes);
        }
        return authorizationInfo;
    }

    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authenticationToken)
            throws AuthenticationException {
        UsernamePasswordToken token = (UsernamePasswordToken) authenticationToken;
        if (StringUtils.isEmpty(token.getUsername())) {
            throw new IncorrectCredentialsException("Username is null!");
        } else if (StringUtils.isEmpty(token.getPassword())) {
            throw new IncorrectCredentialsException("Password is null!");
        }
        SysUser user = userService.getUserByUsername(token.getUsername());
        if (null == user) {
            throw new UnknownAccountException("User does not exist!");
        }
        String userPassword = userService.getUserPassword(user.getId());
        return new SimpleAuthenticationInfo(token.getUsername(), userPassword, getName());
    }
}
