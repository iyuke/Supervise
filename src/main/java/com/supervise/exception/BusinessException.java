package com.supervise.exception;

/**
 * 业务异常
 */
//TODO 整理异常代码与异常描述列表
public class BusinessException extends Exception {

    private static final long serialVersionUID = 8542292306389114239L;

    private String code;

    public BusinessException(String code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }

    public BusinessException(String code, String message) {
        super(message);
        this.code = code;
    }

    public BusinessException(String message) {
        super(message);
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
