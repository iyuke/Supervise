package com.supervise.common.util;

import org.apache.commons.codec.binary.Base64;

import javax.crypto.KeyGenerator;
import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

/**
 * Created by zhu on 15/8/14.
 */
public class EncryptUtil {
    private static final String KEY_MAC = "HmacSHA512";
    // 秘钥（128位随机字符，未Base64编码）
    private static final String encryptKey = "blGnKxriA3g2G3seQNci6MrIbqFYgxBuY8pFvcWFvEF7GFIdyoWmCwRhF0YZsQmwqPHtN085GTG9BBiDD15zAH3WMtglhFpLidii50XSsGGp4e4SbOhve2gy5HeaRcfj";

    public static String initMacKey() {
        try {
            KeyGenerator keyGenerator = KeyGenerator.getInstance(KEY_MAC);
            SecretKey secretKey = keyGenerator.generateKey();
            return encryptBASE64(secretKey.getEncoded());
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static byte[] encrypt(byte[] data, String key) {
        try {
            SecretKey secretKey = new SecretKeySpec(key.getBytes("UTF-8"), KEY_MAC);
            Mac mac = Mac.getInstance(secretKey.getAlgorithm());
            mac.init(secretKey);
            return mac.doFinal(data);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (InvalidKeyException e) {
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String encryptAsString(byte[] data, String key) {
        return Base64.encodeBase64String(encrypt(data, key));
    }

    public static String encryptAsString(String data) {
        try {
            return encryptAsString(data.getBytes("UTF-8"), encryptKey);
        } catch (UnsupportedEncodingException e) {
            return null;
        }
    }

    private static byte[] decryptBASE64(String key) {
        return Base64.decodeBase64(key);
    }

    private static String encryptBASE64(byte[] key) {
        return Base64.encodeBase64String(key);
    }

//    public static void main(String[] args) {
//
//        System.out.println(encryptAsString("111111"));
//
//        System.out.println(initMacKey());
//
//        try {
//            System.out.println(encryptKey.getBytes("UTF-8").length);
//            System.out.println(Base64.encodeBase64String(encryptKey.getBytes("UTF-8")));
//        } catch (UnsupportedEncodingException e) {
//            e.printStackTrace();
//        }
//
//        try {
//            System.out.println(new String(decryptBASE64("YmxHbkt4cmlBM2cyRzNzZVFOY2k2TXJJYnFGWWd4QnVZOHBGdmNXRnZFRjdHRklkeW9XbUN3UmhGMFlac1Ftd3FQSHROMDg1R1RHOUJCaUREMTV6QUgzV010Z2xoRnBMaWRpaTUwWFNzR0dwNGU0U2JPaHZlMmd5NUhlYVJjZmo="), "UTF-8"));
//        } catch (UnsupportedEncodingException e) {
//            e.printStackTrace();
//        }
//
//        System.out.println(RandomStringUtils.randomAlphanumeric(128));
//    }

}
