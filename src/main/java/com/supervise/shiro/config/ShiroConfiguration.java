package com.supervise.shiro.config;

import com.supervise.filter.UserAuthorityFilter;
import com.supervise.shiro.SuperviseCredentialsMatcher;
import com.supervise.shiro.UserRealm;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.spring.LifecycleBeanPostProcessor;
import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.filter.authc.AnonymousFilter;
import org.apache.shiro.web.mgt.DefaultWebSecurityManager;
import org.apache.shiro.web.session.mgt.DefaultWebSessionManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.web.filter.DelegatingFilterProxy;

import javax.servlet.DispatcherType;
import javax.servlet.Filter;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created by Nathaniel on 2017/6/19.
 */
@Configuration
public class ShiroConfiguration {

    /**
     * FilterRegistrationBean  转换成filter到配置文件中
     * @return
     */
//    @Bean
//    public FilterRegistrationBean filterRegistrationBean() {
//        FilterRegistrationBean filterRegistration = new FilterRegistrationBean();
//        filterRegistration.setFilter(new DelegatingFilterProxy("shiroFilter"));
//        filterRegistration.setEnabled(true);
//        filterRegistration.addUrlPatterns("/*");
//        filterRegistration.setDispatcherTypes(DispatcherType.REQUEST);
//        return filterRegistration;
//    }

    /**
     * @see ShiroFilterFactoryBean
     * @return
     */
    @Bean(name = "shiroFilter")
    public ShiroFilterFactoryBean shiroFilter(){
        ShiroFilterFactoryBean bean = new ShiroFilterFactoryBean();
        bean.setSecurityManager(securityManager());
        bean.setLoginUrl("/be/login");
        bean.setUnauthorizedUrl("/error");

        Map<String, Filter> filters = new HashMap<String, Filter>();
        filters.put("perms", new UserAuthorityFilter());
//        filters.put("perms", new AnonymousFilter());
        filters.put("anon", new AnonymousFilter());
        bean.setFilters(filters);

        Map<String, String> chains = new LinkedHashMap<String, String>();
        chains.put("/be/login", "anon");
        chains.put("/index", "anon");
        chains.put("/logout", "logout");
        chains.put("/assets/**", "anon");
        chains.put("/error/**", "anon");
        chains.put("/**", "perms");
        bean.setFilterChainDefinitionMap(chains);
        return bean;
    }

    /**
     * @see org.apache.shiro.mgt.SecurityManager
     * @return
     */
    @Bean(name="securityManager")
    public DefaultWebSecurityManager securityManager() {
        DefaultWebSecurityManager manager = new DefaultWebSecurityManager();
//        manager.setRealm(userRealm());
        manager.setCacheManager(cacheManager());
//        manager.setSessionManager(defaultWebSessionManager());
        return manager;
    }

    /**
     * @see DefaultWebSessionManager
     * @return
     */
//    @Bean(name="sessionManager")
//    public DefaultWebSessionManager defaultWebSessionManager() {
//        DefaultWebSessionManager sessionManager = new DefaultWebSessionManager();
//        sessionManager.setCacheManager(cacheManager());
//        sessionManager.setGlobalSessionTimeout(1800000);
//        sessionManager.setDeleteInvalidSessions(true);
//        sessionManager.setSessionValidationSchedulerEnabled(true);
//        sessionManager.setDeleteInvalidSessions(true);
//        return sessionManager;
//    }

    @Bean
    public EhCacheManager cacheManager() {
        EhCacheManager cacheManager = new EhCacheManager();
        cacheManager.setCacheManagerConfigFile("classpath:ehcache.xml");
        return cacheManager;
    }

    @Bean
    public LifecycleBeanPostProcessor lifecycleBeanPostProcessor() {
        return new LifecycleBeanPostProcessor();
    }

    /**
     * @see UserRealm --->AuthorizingRealm
     * @return
     */
    @Bean
    @DependsOn(value="lifecycleBeanPostProcessor")
    public UserRealm userRealm() {
        UserRealm userRealm = new UserRealm(cacheManager(), new SuperviseCredentialsMatcher());
        return userRealm;
    }

//    @Bean
//    public URLPermissionsFilter urlPermissionsFilter() {
//        return new URLPermissionsFilter();
//    }

}
