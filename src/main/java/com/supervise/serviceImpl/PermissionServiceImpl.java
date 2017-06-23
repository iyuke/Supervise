package com.supervise.serviceImpl;

import com.supervise.domain.Permission;
import com.supervise.service.PermissionService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by HISTO on 2017/6/14.
 */
@Service("permissionService")
public class PermissionServiceImpl implements PermissionService {
    public List<Permission> getByUsername(String username) {
        return null;
    }
}
