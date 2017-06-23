/**
 * Created by Feddiyao on 2017/2/26.
 */
$(document).ready(function () {
  var sysUserModal = new SysUserModal();
  var $createSysUser = $('#createSysUser');
  var $editSysUser = $('#editSysUser');
  multiSelectRender($('#userRoleList_create'));
  multiSelectRender($('#userRoleList_edit'));

  sysUserModal.formValidation($createSysUser);
  sysUserModal.formValidation($editSysUser);

  $("input[name='allOption']").click(function () {
    var id = this.parentNode.parentNode.parentNode.getAttribute("id");
    var checkStatus = this.checked;
    var elements = $("div#" + id + " input[name='userOrgList']");
    sysUserModal.setChecked(elements, checkStatus);
  });

  // 用户机构为送检医院时，同时显示其下属科室
  $('.orgHosp').change(function () {
    $('.sub-orgs').hide();
    if (this.checked) {
      $(this).parent().parent().find('.sub-orgs').show(300);
    }
  });

  // 选择送检医院时，则其下属科室全选
  $('.q-orgHosp').change(function () {
    var ckboxes = $(this).parent().parent().find('.sub-q-orgs').find('input[type=checkbox]');
    for (var i = 0; i < ckboxes.length; i++) {
      ckboxes[i].checked = this.checked;
    }
    var id = this.parentNode.parentNode.parentNode.parentNode.getAttribute("id");
    var checkStatus = this.checked;
    var elements = $("div#" + id + " input[name='userOrgList']");
    var allOption = $("input[name='allOption']");
    sysUserModal.setAllOption(elements, allOption, checkStatus);
  });

  // 下属科室未全选，则送检医院不选
  var sub_ckboxes = $('.sub-q-orgs').find('input[type=checkbox]');
  sub_ckboxes.click(function () {
    var allOption;
    if (!$(this).prop('checked')) {
      allOption = $(this).parent().parent().parent().parent().find('.q-orgHosp');
      sysUserModal.setAllOption(sub_ckboxes, allOption, $(this).prop('checked'));
      allOption = $("input[name='allOption']");
      sysUserModal.setAllOption(sub_ckboxes, allOption, $(this).prop('checked'))
    }
  });

  //重置验证表单
  $('#createModal').on('hidden.bs.modal', function() {
    $createSysUser.formValidation('resetForm', true);
    sysUserModal.setChecked($("#tabContentCreate input[type='radio']"), false);
    initTabActive($("#tabTitleCreate li"), $("#tabContentCreate div[name='tabId']"));
  });
  $('#editModal').on('hidden.bs.modal', function() {
    $editSysUser.formValidation('resetForm', true);
    sysUserModal.setChecked($("#tabContentEdit input[type='radio']"), false);
    sysUserModal.initTabActive($("#tabTitleEdit li"), $("#tabContentEdit div[name='tabId']"));
  });
  $('#queryOrgModal').on('hidden.bs.modal', function() {
    $('#setSysUserViewOrg').formValidation('resetForm', true);
    sysUserModal.setChecked($("#tabContentQueryOrg input[type='radio']"), false);
    sysUserModal.initTabActive($("#tabTitleQueryOrg li"), $("#tabContentQueryOrg div[name='tabId']"));
  });
});

var SysUserModal = new Function();

SysUserModal.prototype.formValidation = function ($form) {
  // 创建 用户信息异步提交
  $form.formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      'userName':{
        validators:{
          notEmpty:{}
        }
      },
      'fullName': {
        validators: {
          notEmpty: {}
        }
      },
      'userRoleList': {
        validators: {
          notEmpty: {}
        }
      },
      'userOrgList': {
        validators: {
          notEmpty: {}
        }
      },
      'age': {
        validators: {
          integer:{
            message:'请输入有效的数字'
          }
        }
      },
      'email':{
        validators:{
          emailAddress:{
            message:'请输入有效的电子邮箱'
          }
        }
      },
      remark: {
        validators: {
          stringLength: {
            max: 500,
            min: 1,
            message: '备注长度不得超过500字'
          }
        }
      },
      mobilePhone:{
        validators:{
          phone:{
            message:'请输入完整的十一位电话(如：02133967872，18122339791',
            country:'CN'
          },
          notEmpty:{},
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
    };
    $form.ajaxForm(options);
  });
};

SysUserModal.prototype.setChecked = function (elements, status) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].checked = status;
  }
};

// 设置全选/非全选
SysUserModal.prototype.setAllOption = function (elements, allOption, checkStatus) {
  if (checkStatus) {
    var isAllSelected = true;
    for (var i = 0; i < elements.length; i++) {
      if (!elements[i].checked) {
        isAllSelected = false;
        break;
      }
    }
    allOption.prop('checked', isAllSelected);
  } else {
    allOption.prop('checked', false);
  }
};

SysUserModal.prototype.initTabActive = function (tabTitles, tabContents) {
  for (var i = 0; i < tabTitles.length; i++) {
    if (i == 0) {
      tabTitles[i].setAttribute("class", "active");
      tabContents[i].setAttribute("class", "tab-pane active");
    } else {
      tabTitles[i].setAttribute("class", "");
      tabContents[i].setAttribute("class", "tab-pane");
    }
  }
};