package com.supervise.serviceImpl;

import com.supervise.domain.Permission;
import com.supervise.domain.SysResource;
import com.supervise.domain.SysResourceRepository;
import com.supervise.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by HISTO on 2017/6/20.
 */
@Service("resourceService")
@Transactional
public class ResourceServiceImpl implements ResourceService {
    @Autowired
    SysResourceRepository sysResourceRepository;

    //初始化时候存放一个url资源对应多个权限
    @Override
    public Map<String, List<String>> getSysResourceAndPermissionMapping() {
        List<SysResource> list = sysResourceRepository.findAll();
        Map<String, List<String>> urlPermissionMap = new ConcurrentHashMap<String, List<String>>(list.size());
        for (SysResource sysResource : list) {
            List<String> permissionList = new ArrayList<String>(sysResource.getPermissions().size());
            for (Permission permission : sysResource.getPermissions()) {
                permissionList.add(permission.getCode());
            }
            urlPermissionMap.put(sysResource.getUrl(), permissionList);
        }
        return urlPermissionMap;
    }
}
