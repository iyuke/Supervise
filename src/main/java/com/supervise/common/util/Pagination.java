/**
 * 
 */
package com.supervise.common.util;

import com.supervise.common.constant.Constants;

/**
 * 分页
 */
public class Pagination {
	private int currentPage;
	private int pageSize;
	private int totalPage;
	private long totalNum;
	private int numberOfPages;

	public Pagination() {
		this.currentPage = Constants.DEFAULT_PAGE_INDEX;
		this.pageSize = Constants.DEFAULT_PAGE_SIZE;
		this.totalPage = 0;
		this.totalNum = 0l;
		this.numberOfPages = Constants.DEFAULT_NUMBER_OF_PAGES;
	}

	public Pagination(int currentPage, int pageSize, int totalPage,
                      long totalNum, int numberOfPages) {
		super();
		this.currentPage = currentPage;
		this.pageSize = pageSize;
		this.totalPage = totalPage;
		this.totalNum = totalNum;
		this.numberOfPages = numberOfPages;
	}

	public int getCurrentPage() {
		return currentPage;
	}

	public void setCurrentPage(int currentPage) {
		this.currentPage = currentPage;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public int getTotalPage() {
		return totalPage;
	}

	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}

	public long getTotalNum() {
		return totalNum;
	}

	public void setTotalNum(long totalNum) {
		this.totalNum = totalNum;
	}

	public int getNumberOfPages() {
		return numberOfPages;
	}

	public void setNumberOfPages(int numberOfPages) {
		this.numberOfPages = numberOfPages;
	}
}
