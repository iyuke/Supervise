package com.supervise.controller;

/**
 * JSON格式基本应答
 */
public class BaseResponse {

    public static final String CODE_SUCCESS = "200";
    public static final String MSG_SUCCESS = "OK";

    private String code;
    private String message;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public BaseResponse() {
        super();
        this.code = CODE_SUCCESS;
        this.message = MSG_SUCCESS;
    }

    public BaseResponse(String code, String message) {
        this.code = code;
        this.message = message;
    }
}
