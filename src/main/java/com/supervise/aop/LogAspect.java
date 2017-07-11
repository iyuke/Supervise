package com.supervise.aop;

import com.supervise.common.util.ReflectionUtil;
import org.apache.shiro.SecurityUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.Collection;
import java.util.Map;
import java.util.UUID;

/**
 * Created by Nathaniel on 2016/5/7.
 */
@Component
@Aspect
public class LogAspect {

	private ThreadLocal<Long> time = new ThreadLocal<Long>();
	private ThreadLocal<String> tag = new ThreadLocal<String>();

	@Around("execution(* com.supervise.serviceImpl.*Impl.*(..))")
	public Object aroundService(ProceedingJoinPoint joinPoint) throws Throwable {
		Logger logger = LoggerFactory.getLogger(joinPoint.getTarget().getClass().getName());
		Long start = System.currentTimeMillis();

		String username;
		//启动时UserRealm尚未加载
		try {
			 username = (String) SecurityUtils.getSubject().getPrincipal();
		} catch (Exception e) {
			username = null;
		}

		//将参数拼成一个字符串
		StringBuffer msg = new StringBuffer();
		// retrieve the methods parameter types (static):
		final Signature signature = joinPoint.getStaticPart().getSignature();
		if (signature instanceof MethodSignature) {
			final MethodSignature ms = (MethodSignature) signature;
			final Class<?>[] parameterTypes = ms.getParameterTypes();
			for (final Class<?> pt : parameterTypes) {
				msg.append("Parameter type:").append(pt);
			}
		}

		// retrieve the runtime method arguments (dynamic)
		if (logger.isDebugEnabled()) {
			for (final Object argument : joinPoint.getArgs()) {
				msg.append(" Parameter value:");
				msg.append(ReflectionUtil.getObjectAllAttributes(argument));
			}
		} else {
			for (final Object argument : joinPoint.getArgs()) {
				msg.append(" Parameter value:");
				msg.append(argument);
			}
		}

		MethodSignature ms = (MethodSignature) joinPoint.getSignature();
		//Service执行前记录日志
		logger.info("[UserName : {} ]Service Starting. Method : {} ({})", username, ms.getMethod().getName(),
				msg.toString());

		//执行目标方法并得到其返回值
		Object rtn = joinPoint.proceed(joinPoint.getArgs());

		int size = -1;
		if (rtn instanceof Collection) {
			size = ((Collection) rtn).size();
		} else if (rtn instanceof Map) {
			size = ((Map) rtn).size();
		}
		//Service执行后记录日志
		if (logger.isDebugEnabled()) {
			logger.debug("[UserName : {} ]Service Finished. Used time {}ms. Return: {}", username,
					System.currentTimeMillis() - start, rtn);
		} else {
			if (size > -1) {
				//集合类型返回值，在非debug模式下只打印集合的size
				logger.info("[UserName : {} ]Service Finished. Used time {}ms. Return: {}", username,
						System.currentTimeMillis() - start, size);
			} else {
				//非集合类型返回值，则直接打印
				logger.info("[UserName {} ]Service Finished. Used time {}ms. Return: {}", username,
						System.currentTimeMillis() - start, rtn);
			}
		}

		return rtn;
	}

	@Before("execution(* com.supervise.controller.*Controller.*(..))")
	public void beforeController(JoinPoint joinPoint) {
		Logger logger = LoggerFactory.getLogger(joinPoint.getTarget().getClass().getName());

		time.set(System.currentTimeMillis());
		tag.set(UUID.randomUUID().toString());
		//将参数拼成一个字符串
		StringBuffer msg = new StringBuffer();
		// retrieve the methods parameter types (static):
		final Signature signature = joinPoint.getStaticPart().getSignature();
		if (signature instanceof MethodSignature) {
			final MethodSignature ms = (MethodSignature) signature;
			final Class<?>[] parameterTypes = ms.getParameterTypes();
			for (final Class<?> pt : parameterTypes) {
				msg.append("Parameter type:").append(pt);
			}
		}

		// retrieve the runtime method arguments (dynamic)
		if (logger.isDebugEnabled()) {
			for (final Object argument : joinPoint.getArgs()) {
				msg.append(" Parameter value:");
				msg.append(ReflectionUtil.getObjectAllAttributes(argument));
			}
		} else {
			for (final Object argument : joinPoint.getArgs()) {
				msg.append(" Parameter value:");
				msg.append(argument);
			}
		}
		MethodSignature ms = (MethodSignature) joinPoint.getSignature();
		String username;
		//启动时UserRealm尚未加载
		try {
			username = (String) SecurityUtils.getSubject().getPrincipal();
		} catch (Exception e) {
			username = null;
		}
		logger.debug("[UserName {} ]Controller Starting. Method : {} ({})", username,
				ms.getMethod().getName(), msg.toString());
	}

	@After("execution(* com.supervise.controller.*Controller.*(..))")
	public void afterController(JoinPoint joinPoint) {
		Logger logger = LoggerFactory.getLogger(joinPoint.getTarget().getClass().getName());

		Calendar calendar = Calendar.getInstance();
		calendar.setTimeInMillis(System.currentTimeMillis());
		MethodSignature ms = (MethodSignature) joinPoint.getSignature();
		String username;
		//启动时UserRealm尚未加载
		try {
			username = (String) SecurityUtils.getSubject().getPrincipal();
		} catch (Exception e) {
			username = null;
		}
		logger.info("[UserName {} ]Controller Succeeded. Used time {}ms. Method : {}{}",
				username, calendar.getTimeInMillis() - time.get(),
				ms.getMethod().getName(), ms.getParameterNames());
	}

}
