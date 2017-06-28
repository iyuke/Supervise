package com.supervise.shiro;

import com.supervise.common.util.EncryptUtil;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.credential.CredentialsMatcher;
import org.apache.shiro.codec.CodecSupport;

import java.util.Arrays;

/**
 * Created by nathaniel on 15/8/14.
 */
public class SuperviseCredentialsMatcher extends CodecSupport implements CredentialsMatcher {

    protected Object getCredentials(AuthenticationToken token) {
        //注册页面要使用相同的密钥和加密方法
        return EncryptUtil.encryptAsString(String.valueOf((char[]) token.getCredentials())).toCharArray();
    }

    protected Object getCredentials(AuthenticationInfo info) {
        return info.getCredentials();
    }


    protected boolean equals(Object tokenCredentials, Object accountCredentials) {
        if (isByteSource(tokenCredentials) && isByteSource(accountCredentials)) {
            byte[] tokenBytes = toBytes(tokenCredentials);
            byte[] accountBytes = toBytes(accountCredentials);
            return Arrays.equals(tokenBytes, accountBytes);
        } else {
            return accountCredentials.equals(tokenCredentials);
        }
    }

    public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {
        Object tokenCredentials = getCredentials(token);
        Object accountCredentials = getCredentials(info);
        return equals(tokenCredentials, accountCredentials);
    }

}
