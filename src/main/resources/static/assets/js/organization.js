/**
 * Created by Feddiyao on 2017/2/24.
 */
var status = $('#page-status').attr('class')
$(document).ready(function () {
  var organization = new Organization();

  // 显示机构编辑Modal
  $('.editBtn').on('click', function () {
    if (status === 'static') {
      var msg;
      msg = {
        id: 2,
        name: '合肥市人民医院',
        level: '4',
        orgTypes: '1',
        contactName: '联系人',
        contactPhone: '12345678910',
        address: '地址',
        provinceId: ''
      }
      organization._editModalShowAjax(msg);
    } else {
      organization.editModalShow($(this).attr('id'));
    }
  });

  //显示机构创建Modal
  $('.createBtn').on('click', function () {
    organization.createModalShow();
  });

  //显示机构搜索Modal
  $('.searchBtn').on('click', function () {
    organization.searchModalShow();
  });

  //显示信息人员设置Modal
  $('.informShowBtn').on('click', function () {
    organization.informModalShow(this);
  });

  $('.deleteBtn').on('click', function () {
    organization.deleteRecord(this);
  });

  // 点击父亲节点，展示下属机构
  $('.parent_href').on("click", function () {
    var parentId = $(this).attr('id');
    var childName = 'child_' + parentId;
    $('tr[name=' + childName + ']').collapse('toggle');
  });

  //设置页面列表的分页
  (organization.setPaginator)();
});

var Organization = new Function();

//editModal的展示
Organization.prototype.editModalShow = function (orgId) {
  var that = this;
  $.ajax({
    type: 'POST',
    url: ctxPath + 'be/company/detail',
    data: {
      orgId : orgId
    },
    dataType: 'JSON',
    success: function (msg) {
      that._editModalShowAjax(msg);
    }
  });
};

Organization.prototype._editModalShowAjax = function (msg) {
  var that = this;
  if (msg.error == null) {
    that._editModalDataRenderer(msg);
    that._organizationFormValidation('edit');
    var $editModal = $('#editModal');
    //父机构div展示处理
    $editModal.find('input[class="hasFather"]').change(function () {
      that._operateFatherDiv('edit');
    });
    //当编辑Modal切换机构类型为科室的时候隐藏省市区下拉框
    $("#orgTypes_edit").change(function (){
      var orgType = $(this).val();
      var $org_region_edit = $("#org_region_edit");
      if(orgType=="DEPARTMENT"){
        $org_region_edit.collapse('hide');
        $("#provinceId_edit").val('');
        $("#cityId_edit").val('');
        $("#districtId_edit").val('');
      } else {
        $org_region_edit.collapse('show');
      }
      that._editFormRevalidate('provinceId');
      that._editFormRevalidate('cityId');
      that._editFormRevalidate('districtId');
    });
    $editModal.modal('show');
  }
}

//createModal的展示
Organization.prototype.createModalShow = function () {
  var that = this;
  that._organizationFormValidation('create');
  var $createModal = $('#createModal');
  //父机构div展示处理
  $createModal.find('input[class="hasFather"]').change(function () {
    that._operateFatherDiv('create');
  });
  //当新建Modal切换机构类型为科室的时候隐藏省市区下拉框
  $('#orgTypes_create').change(function () {
    var orgType = $(this).val();
    var $org_region_create = $('#org_region_create');
    if(orgType=='DEPARTMENT'){
      $org_region_create.collapse('hide');
      $('#provinceId_create').val('');
      $('#cityId_create').val('');
      $('#districtId_create').val('');
    }else{
      $org_region_create.collapse('show');
    }
    that._createFormRevalidate('provinceId');
    that._createFormRevalidate('cityId');
    that._createFormRevalidate('districtId');
  });
  $createModal.modal('show');
};

//删除organization
Organization.prototype.deleteRecord = function(element) {
  var id = $(element).attr("id");
  var name = $(element).val();
  layer.confirm("您即将删除机构名称='" + name + "'的机构管理记录，请确认！", {
    btn: ['确认', '取消'],
    closeBtn: 0
  },function (index) {
    var params = {
      recordId: id
    }
    $.ajax({
      type: 'POST',
      url: ctxPath + 'be/organization/delete',
      data: params,
      dataType: 'JSON',
      success: function (msg) {
        if (msg.code == 200) {
          layer.close(index)
          location.reload();
        }else{
          layer.msg(msg.message);
        }
      }
    });
  }, function(index) {
    return;
  })
}


//searchModal的展示
Organization.prototype.searchModalShow = function () {
  var $org_region_search = $('#org_region_search');
  //当搜索Modal切换机构类型为科室的时候隐藏省市区下拉框
  $('#orgType_search').change(function () {
    var orgType = $(this).val();
    if(orgType=="DEPARTMENT"){
      $org_region_search.collapse('hide');
      $('#provinceId_search').val('');
      $('#cityId_search').val('');
      $('#districtId_search').val('');
    }else{
      $org_region_search.collapse('show');
    }
  });

  //搜索Modal的省市区下拉框数据的展示
  $('#searchModal').on('show.bs.modal', function() {
    if ($('#provinceId_search').val() !== '') {
      var searchConditionsCityId = $('.organizationSearchConditionsCityId').val();
      getCityByProvinceIds($('#provinceId_search').val(), $('#cityId_search'), $('#districtId_search'), searchConditionsCityId, (function (){
        if (searchConditionsCityId !== '') {
          var districtId = $('.organizationSearchConditionsDistrictId').val();
          getDistrictByCityIds(searchConditionsCityId, $('#districtId_search'), districtId);
        }
      }))
    }
  });

  //搜索Modal初始状态设置(机构类型为科室时隐藏省市区下拉框
  var orgType = $('#orgType_search').val();
  if(orgType==='DEPARTMENT'){
    $org_region_search.collapse('hide');
    $('#provinceId_search').val('');
    $('#cityId_search').val('');
    $('#districtId_search').val('');
  }else{
    $org_region_search.collapse('show');
  }

  $('#searchModal').modal('show');
};

//informModal的展示
Organization.prototype.informModalShow = function (element) {
  var that = this;
  //先清空上次的记录
  $('#informPersonName').val('');
  var panelHtml = $('.panel-body')[1].childNodes[1].nodeValue;
  $('#real-html').html(panelHtml);
  var $orgIds = $('#orgIds');
  $orgIds.multiselect('deselectAll', false);
  $orgIds.multiselect('rebuild');
  $orgIds.val('');
  var orgId = $(element).attr("id");
  $('#orgId').val(orgId);
  if (status === 'static') {
    var personArray = new Array();
    personArray[0] = {
      organizationName: '安徽阜阳肿瘤医院',
      fullName: '医生1',
      id: '1',
    };
    personArray[1] = {
      organizationName: '安徽六安人民医院',
      fullName: '医生2',
      id: '2',
    };
    that._personShowAjax(personArray)
  } else {
    $.ajax({
      type: 'GET',
      data: {
        orgId: orgId
      },
      url: ctxPath + 'be/organization/get-inform-persons',
      success: function (personArray) {
        that._personShowAjax(personArray)
      }
    });
  }

};

Organization.prototype._personShowAjax = function (personArray) {
  var that = this;
  $('#informPerson').empty();
  if (personArray != null && personArray.length > 0) {
    var html = '';
    for (var i = 0; i < personArray.length; i++) {
      html = html + '<label class="control-label" style="display: block">' + personArray[i].fullName +
          '&nbsp;&nbsp;&nbsp;';
      if (personArray[i].organizationName != undefined) {
        html = html + personArray[i].organizationName;
      }
      html = html  + '<a shiro:hasPermission="organization:inform_config" class="removeInformPerson" id="' + personArray[i].id +
          '" href="javascript:void(0)" name="removeInformPerson">&nbsp;删除</a></label>';
    }
    $('#informPerson').append(html);
    $('.removeInformPerson').on('click', function () {
      if (status === 'static') {
        $(this).parent().remove();
      } else {
        that._removeInformPerson(this);
      }
    })
  }
  //查找信息推送人员
  $('.showPersonSearched').on('click', function () {
    if (status === 'static') {
      var objectListInPage = new Array();
      objectListInPage[0] = {
        organizationName: '浙江金华人民医院',
        fullName : '医生3',
        id: '3'
      };
      objectListInPage[1] = {
        organizationName: '浙江义乌人民医院',
        fullName : '医生4',
        id: '4'
      }
      var respbd = new Array();
      respbd[0] = {
        content: objectListInPage,
        totalPages:1,
      }
      that._showPersonSearchAjax(respbd);
    } else {
      that._showPersonSearch();
    }
  });
  //信息推送人员设置完成
  $('#submitInformPerson').on('click', function () {
    location.reload();
  });
  $("#informModal").modal('show');
}

Organization.prototype.setPaginator = function () {
  var options = {
    bootstrapMajorVersion: 3,
    alignment: 'right',//居右显示
    currentPage: currentPage,//当前页面
    pageSize: pageSize,
    numberOfPages: 5,//一页显示几个按钮（在ul里面生成5个li）
    totalPages: totalPages, //总页数
    pageUrl: function (type, page, current) {
      if (page == current) {
        return 'javascript:void(0)';
      } else {
        return 'javascript:Organization.prototype._search(' + page + ')';
      }
    }
  };
  $('#PaginatorUl').bootstrapPaginator(options);
};

Organization.prototype._search = function (currentPage) {
  var $search_form = $('#search_form');
  $search_form.find('input[name="currentPage"]').val(currentPage);
  $search_form.submit();
};

Organization.prototype._organizationFormValidation = function (formType) {
  var that = this;
  $('#' + formType + 'Organization').formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      name: {
        validators: {
          notEmpty: {}
        }
      },
      orgTypes: {
        validators: {
          notEmpty: {}
        }
      },
      provinceId: {
        validators: {
          callback:{
            message:' ',
            callback:function() {
              return that._regionValidate(formType, 'provinceId');
            }
          }
        }
      },
      cityId: {
        validators: {
          callback:{
            message:' ',
            callback:function() {
              return that._regionValidate(formType, 'cityId')
            }
          }
        }
      },
      districtId: {
        validators: {
          callback:{
            message:' ',
            callback:function() {
              return that._regionValidate(formType, 'districtId')
            }
          }
        }
      },
      remark: {
        validators: {
          stringLength: {
            max: 500,
            min: 1,
            message: '描述长度不得超过500字'
          }
        }
      },
      contactEmail:{
        validators:{
          emailAddress:{
            message:'请输入正确的邮箱地址'
          }
        }
      },
      contactPhone:{
        validators:{
          phone:{
            message:'请输入完整的十一位电话(如：02133967872，18122339791',
            country:'CN'
          }
        }
      },
      parentId:{
        validators:{
          callback:{
            message:' ',
            callback:function(){
              return that._parentValidate(formType);
            }
          }
        }
      }
    }
  }).on('success.form.fv', function (e) {
    var options = {
      dataType: 'json',
      success: function (data) {
        if (data.code == '200') {
          location.reload();
        }
      },
      error: function (data) {
        layer.msg(data.responseText);
      }
    };
    $('#' + formType + 'Organization').ajaxForm(options);
  });
};

//前端再验证
Organization.prototype._createFormRevalidate = function (revalidateItem){
  $('#createOrganization').formValidation('revalidateField', revalidateItem);
};
Organization.prototype._editFormRevalidate = function (revalidateItem) {
  $('#editOrganization').formValidation('revalidateField', revalidateItem);
};

//若机构类型为科室时省市区不需填写，否（包括机构类型含有科室情况）则需要填写
Organization.prototype._regionValidate = function(formType, regionName) {
  var orgType = $('#' + formType + 'Organization').find('[name="type"]').val();
  var region = $('#' + formType + 'Organization').find('[name="' + regionName + '"]').val();
  //若机构类型为科室时省市区不需填写，否（包括机构类型含有科室情况）则需要填写
  if (orgType == "DEPARTMENT") {
    return true;
  } else if (region == ""){
    return false;
  } else {
    return true;
  }
};

//验证parentId，若有上级机构则需要填写，没有则不需要
Organization.prototype._parentValidate = function (formType) {
  var select = $('#' + formType + 'Organization .hasFather')[0].checked;
  var parent = $('#' + formType + 'Organization .parentId').val();
  if (select && parent == "") {
    return false;
  } else {
    return true;
  }
};

Organization.prototype._operateFatherDiv = function(modalType) {
  var hasFather = $('#hasFather_' + modalType + '[value="true"]').prop("checked");
  if(hasFather){
    $('#parent_div_' + modalType).collapse('show');
    $('#' + modalType + 'Organization').data('formValidation').enableFieldValidators('parentId', true);
  }else{
    $('#parent_div_' + modalType).collapse('hide');
    $('#' + modalType + 'Organization').data('formValidation').enableFieldValidators('parentId', false);
  }
};

//渲染editModal的数据
Organization.prototype._editModalDataRenderer = function (org) {
  this._editModalDataWithDynamicsRendered(org);
  this._editModalDataWithoutDynamicsRendered(org);
};

Organization.prototype._editModalDataWithDynamicsRendered = function (org) {
  //省市区信息渲染（下拉框处理）
  var provinceId = typeof org.provinceId == 'undefined' ? '' : org.provinceId.toString();
  var cityId = typeof org.cityId == 'undefined' ? '' : org.cityId.toString();
  var districtId = typeof org.districtId == 'undefined' ? '' : org.districtId.toString();
  // 显示市/区
  if (provinceId != '') {
    getCityByProvinceIds(provinceId, $('#cityId_edit'), $('#districtId_edit'), cityId, (function (){
      if (cityId != '') {
        getDistrictByCityIds(cityId, $('#districtId_edit'), districtId)
      }
    }))
  }

  var $org_region_edit = $('#org_region_edit')
  //若机构类型为科室时省市区不需填写，否（包括机构类型含有科室情况）则需要填写
  if (org.type == 'DEPARTMENT') {
    $org_region_edit.collapse('hide');
    $('#provinceId_edit').val('');
    $('#cityId_edit').val('');
    $('#districtId_edit').val('');
  } else {
    $org_region_edit.collapse('show');
  }

  var $parent_div_edit = $('#parent_div_edit')
  //是否有父机构的处理
  if (org.hasFather) {
    $('#hasFather_edit[value="true"]').prop('checked', "checked");
    $parent_div_edit.collapse('show');
    $('#parentId_edit').val(org.parentId);
  }else{
    $('#hasFather_edit[value=false]').prop('checked', true);
    $parent_div_edit.collapse('hide');
  }
};

Organization.prototype._editModalDataWithoutDynamicsRendered = function(org) {
  // 为各个字段赋值
  $('#id_edit').val(org.id);
  $('#name_edit').val(org.name);
  $('#orgTypes_edit').val(org.type);
  $('#parentId_edit option[value="' + org.id + '"]').remove();
  $('#address_edit').val(org.address);
  $('#provinceId_edit').val(typeof org.provinceId == 'undefined' ? '' : org.provinceId.toString());
  $('#leader_edit').val(org.leader);
  $('#description_edit').val(org.description);
  $('#remark_edit').val(org.remark);
};

//展示人员搜索结果
Organization.prototype._showPersonSearch = function() {
  var that = this;
  var orgId = $('#orgIds').val()
  if (orgId == undefined && $('#informPersonName').value == undefined) {
    layer.msg("所在机构和人员均没有输入,请至少选择一个。")
  } else {
    $.ajax({
      type: 'GET',
      data: {
        orgIds: orgId,
        informPersonName: $('#informPersonName').val()
      },
      url: ctxPath + 'be/user/fetch',
      success: function (respbd) {
        that._showPersonSearchAjax(respbd);
      }
    });
  }
};

Organization.prototype._showPersonSearchAjax = function (respbd) {
  var that = this;
  var appendHtml = $('.panel-body')[1].childNodes[3].nodeValue;
  var objectListInPage = respbd[0].content;
  var htmlAdd = $('.panel-body')[1].childNodes[5].nodeValue;
  for (var i = 0; i < objectListInPage.length; i++) {
    var person = objectListInPage[i];
    if (person.organizationName == undefined) {
      person.organizationName = ""
    }
    appendHtml += htmlAdd.replace('%i', i + 1).replace("%person.fullName", person.fullName).replace("%person.organizationName",
        person.organizationName).replace("%person.id", person.id);
  }
  appendHtml += $('.panel-body')[1].childNodes[7].nodeValue + $('.panel-body')[1].childNodes[9].nodeValue
  $('#real-html').html(appendHtml);
  //信息推送人员添加
  $('.addInformPerson').on('click', function () {
    if (status === 'static') {
      that._addInformPersonAjax(this);
    } else {
      that._addInformPerson(this);
    }
  });
  //分页设置
  var options1 = {
    bootstrapMajorVersion: 3,
    alignment: 'right',//居右显示
    currentPage: 1,//当前页面
    pageSize: pageSize,
    numberOfPages: 5,//一页显示几个按钮（在ul里面生成5个li）
    totalPages: respbd[0].totalPages,
    //总页数
    pageUrl: function (type, page, current) {
      if (page == current) {
        return 'javascript:void(0)';
      } else {
        return 'javascript:Organization.prototype._getPagePerson(' + page + ')';
      }
    }
  };
  $('#PaginatorUl1').bootstrapPaginator(options1);
};

//分页获取信息人员
Organization.prototype._getPagePerson = function (page) {
  var that = this;
  $.ajax({
    type: 'GET',
    data: {
      orgIds: $('#orgIds').val(),
      informPersonName: $('#informPersonName').val(),
      currentPage: page == 0 ? 1 : page
    },
    url: ctxPath + 'be/user/fetch',
    success: function (respbd) {
      $('.append-html').empty();
      var appendHtml = $('.panel-body')[1].childNodes[3].nodeValue;
      var objectListInPage = respbd[0].content;
      var htmlAdd = $('.panel-body')[1].childNodes[5].nodeValue;
      for (var i = 0; i < objectListInPage.length; i++) {
        var person = objectListInPage[i];
        if (person.organizationName == undefined) {
          person.organizationName == ""
        }
        appendHtml += htmlAdd.replace('%i', i+1).replace("%person.fullName", person.fullName).replace("%person.organizationName",
            person.organizationName).replace("%person.id", person.id);
      }
      appendHtml += $('.panel-body')[1].childNodes[7].nodeValue;
      $('.append-html').append(appendHtml);
      $('.addInformPerson').on('click', function () {
        if (status === 'static') {
          that._addInformPersonAjax(this);
        } else {
          that._addInformPerson(this);
        }
      })
    }
  });
};

//添加信息通知人员
Organization.prototype._addInformPerson = function(element) {
  var that = this;
  var personId = $(element).attr('id');
  var informPerson = $('#informPerson').children('label');
  $.ajax({
    type: 'POST',
    data: {
      orgId : $('#orgId').val(),
      userId : personId
    },
    dataType:'json',
    url: ctxPath + 'be/organization/add-inform-person',
    success: function (rsp) {
      if (rsp.code == '200') {
        that._addInformPersonAjax(element);
      } else {
        layer.msg(rsp.message);
      }
    }
  });
};

Organization.prototype._addInformPersonAjax = function (element) {
  var tabElement = $(element).parent().parent().find('td');
  var personId = $(element).attr('id');
  var that = this;
  var tabName = tabElement[1].innerHTML + '&nbsp;&nbsp;&nbsp;' + tabElement[2].innerHTML;
  var html =
      '<label class="control-label" style="display:block">' + tabName +
      '<a shiro:hasPermission="organization:inform_config" id = '+personId+' href="javascript:void(0)" ' +
      'class="removeInformPerson" name="removeInformPerson">&nbsp;删除</a></label>';
  $('#informPerson').append(html);
  $('.removeInformPerson').on('click', function () {
    if (status === 'static') {
      $(this).parent().remove();
    } else {
      that._removeInformPerson(this);
    }
  })
}

//删除信息通知人员
//删除信息人员
Organization.prototype._removeInformPerson = function(element) {
  $.ajax({
    type: 'POST',
    data: {
      orgId : $('#orgId').val(),
      userId : $(element).attr('id')
    },
    url: ctxPath + 'be/organization/remove-inform-person',
    success: function (rsp) {
      if (rsp.code == '200') {
        $(element).parent().remove();
      } else {
        layer.msg(rsp.message);
      }
    }
  });
}