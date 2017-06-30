package com.supervise.common.util;

import com.supervise.common.constant.Constants;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

/**
 * Created by HISTO on 2017/6/29.
 */
public class PageUtil {
    public static PageRequest getPageRequest(Integer currentPage, Integer pageSize, Sort sort) {
        currentPage = null == currentPage ? Constants.DEFAULT_PAGE_INDEX : currentPage;
        pageSize = null == pageSize ? Constants.DEFAULT_PAGE_SIZE : pageSize;
        return new PageRequest(currentPage - 1, pageSize, sort);
    }
}
