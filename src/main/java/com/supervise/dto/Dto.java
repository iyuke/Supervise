package com.supervise.dto;

import com.supervise.domain.SuperEntity;
import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

import java.io.Serializable;
import java.util.Date;

/**
 * 数据传输对象
 * 
 * @author Nathaniel
 */
public class Dto implements Serializable {

	private static final long serialVersionUID = -7000773354857223608L;
	
	protected Long id;
	protected Date createTime;
	protected Date updateTime;

	public Dto() {

	}

	public Dto(SuperEntity entity) {
		this.id = entity.getId();
		this.createTime = entity.getCreateTime();
		this.updateTime = entity.getUpdateTime();
	}
	
	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public Date getCreateTime() {
		return createTime;
	}
	
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	
	public Date getUpdateTime() {
		return updateTime;
	}
	
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.DEFAULT_STYLE);
    }

}
