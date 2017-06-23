package com.supervise.domain;

import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

/**
 * 资源
 *
 * @author nathaniel
 */
@Entity
@Table(name = "SysResource")
public class SysResource extends SuperEntity {

	/**资源名*/
	@NotBlank
	@Column(length = 50)
	private String resourceName;

	/**资源路径*/
	@NotBlank
	@Column(length = 255, unique=true)
	private String url;

	/**资源、角色多对多*/
	@ManyToMany(mappedBy = "resources",fetch = FetchType.LAZY)
	private List<Permission> permissions = new ArrayList<Permission>();

	@NotNull
	@Enumerated(EnumType.STRING)
	private SysResourceType resourceType;

	/**资源描述*/
	@Column(length = 500)
	private String resourceDescription;


	public enum SysResourceType {

		COMMON    					("00", "通用"),
		ORGANIZATION			  	("02", "机构管理"),
		USER		  				("03", "用户管理"),
		ROLE   						("04", "角色管理"),
		PERMISSION   				("05", "权限管理"),
		RESOURCE     				("06", "资源管理"),
		ACCOUNT     				("07", "账户管理"),
		MENU						("08", "菜单管理");


		private String code;
		private String desc;

		SysResourceType(String code, String desc) {
			this.code = code;
			this.desc = desc;
		}

		public static SysResourceType getByCode(String code) {
			for (SysResourceType type : SysResourceType.values()) {
				if (type.getCode().equals(code)) {
					return type;
				}
			}
			return null;
		}

		public String getCode() {
			return code;
		}

		public String getDesc() {
			return desc;
		}
	}

	// Constructors

	/** default constructor */
	public SysResource() {
	}

	public String getResourceName() {
		return resourceName;
	}

	public void setResourceName(String resourceName) {
		this.resourceName = resourceName;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public List<Permission> getPermissions() {
		return permissions;
	}

	public void setPermissions(List<Permission> permissions) {
		this.permissions = permissions;
	}

	public SysResourceType getResourceType() {
		return resourceType;
	}

	public void setResourceType(SysResourceType resourceType) {
		this.resourceType = resourceType;
	}

	public void setResourceDescription(String resourceDescription) {
		this.resourceDescription = resourceDescription;
	}

	public String getResourceDescription() {
		return resourceDescription;
	}

    @Override
    public boolean equals(Object obj) {
        if(this == obj) return true;
        if(!(obj instanceof SysResource)) return false;
        if(!this.getResourceName().equals(((SysResource) obj).getResourceName())) return false;
        if(!this.getUrl().equals(((SysResource) obj).getUrl())) return false;
        return true;
    }

    @Override
    public int hashCode() {
        int result = 17;
        result = 31 * result + this.getResourceName().hashCode();
        result = 31 * result + this.getUrl().hashCode();
        return result;
    }
}