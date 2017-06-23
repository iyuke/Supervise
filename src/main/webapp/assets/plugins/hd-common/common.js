/**
 * Created by Alex on 2015/10/29.
 */

/**
 * ajax请求返回执行success function前，进入该方法对不同返回码进行处理
 * @param callback
 * @returns {Function}
 */
function ajaxSuccess(callback) {
  return function (response, textStatus, xhr) {
    if (typeof response == 'object' && response.code != "200") {
      handleError(response, xhr);
    } else {
      callback.apply(this, arguments);
    }
  };
}
//TODO 根据不同的错误代码进行分类处理
function handleError(error, xhr) {
  alert('AJAX error ' + error.code + ':\n' + error.message);
}
/**
 * 全局变量，是否弹出提示框
 * @type {boolean}
 */
var is_confirm = true;
function confirmLeaveForm() {
  // 提交表单时，不弹出确认提示框
  $('form').bind('submit', function () {
    is_confirm = false;
  });
  $(window).bind('beforeunload', function () {
    if (is_confirm != false) {
      return '您可能有数据没有保存';
    }
  });
}
/**
 * 获取服务器根路径
 * @returns {string}
 */
function getRootPath() {
  var strFullPath = window.document.location.href;
  var strPath = window.document.location.pathname;
  var pos = strFullPath.indexOf(strPath);
  var prePath = strFullPath.substring(0, pos);
  var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);

  return (prePath + postPath);
}

/**
 * 通用提示框
 * @author Alex
 */
(function () {
  window['HDC'] = {};
  function CAlert(msg, code) {
    alert(msg);
  }

  window['HDC']['CAlert'] = CAlert;
})();

/**
 * 获取URL中的请求参数
 * @author hedongyang
 * @ 2016/1/9.
 */
function getQueryPara(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return (r[2]);
  return null;
}
/**
 * 用户身份证号验证
 * @returns {boolean}
 */
function validateIdNo(id) {
  var coefficients = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  var sum = 0;
  if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(id))) {
    return false;
  } else {
    var idList = id.split("");
    for (var i = 0; i < 17; ++i) {
      sum += coefficients[i] * parseInt(idList[i]);
    }
    if (idList[17] == '10X98765432'[sum % 11]) {
      return true;
    } else {
      return false;
    }
  }
}


/**
 * 根据用户身份证号获取用户基本信息，并填充到订单
 *
 * @param userIdNo 身份证号码
 * @param userInfoRender 回调函数，处理返回的用户信息
 */
function checkUserIfExisted(userIdNo, patientId, userInfoRender) {
  if (typeof userIdNo == 'undefined' || patientId == userIdNo) {
    return;
  }
  $.ajax({
    type: 'post',
    dataType: 'json',
    data: {idNo: userIdNo},
    url: getRootPath() + '/be/user/id-no',
    success: function (data) {
      if (!jQuery.isEmptyObject(data)) {
        layer.confirm('用户信息已存在，是否加载原有的用户信息？', {
          btn: ['是', '否'],
          closeBtn: 0
        }, function (index) {
          //回调函数，将数据返回页面，由页面自行渲染
          (userInfoRender && typeof(userInfoRender) === "function") && userInfoRender(data);
          layer.close(index)
        }, function (index) {
          return;
        })
      }
    }
  });
}

/**
 * 为指定的表单生成元素重新验证函数
 *
 * @param formSelector
 * @returns {Function}
 */
var formElementRevalidateFactory = function (formSelector) {
  return function (elementName) {
    formSelector.formValidation('revalidateField', elementName);
  }
}

/**
 * 根据组织机构的变化，动态加载医生列表
 *
 * @param orgId
 * @param doctorSelector
 * @param optionMsg
 */
function loadDoctorListByOrg(orgId, doctorSelector, receiverSelector) {
  resetOptions(doctorSelector, "请选择送检医生");
  if (typeof receiverSelector != 'undefined') {
    resetOptions(receiverSelector, "报告接收人");
  }
  var formElementRevalidate = formElementRevalidateFactory(doctorSelector.closest("form"));
  if (orgId != '') {
    $.ajax({
      type: 'get',
      dataType: 'json',
      data: {'id': orgId},
      url: getRootPath() + '/be/order/doctor',
      success: function (respbd) {
        $.each(respbd, function (i, e) {
          doctorSelector.append('<option value="' + e.id + '">' + e.fullName + '</option>');
          if (typeof receiverSelector != 'undefined') {
            receiverSelector.append('<option value="' + e.id + '">' + e.fullName + '</option>');
          }
        });
      },
      error: function (data) {
        layer.confirm(data.responseJSON.message, {
          btn: ['确定'],
          closeBtn: 0
        }, function (index) {
          layer.close(index)
        })
      }
    });
  }
  formElementRevalidate('application.doctor.id');
  formElementRevalidate('reportReceiverId');
}

/**
 * 根据医院的变化，加载科室列表
 *
 * @param $hospital     example: $("#orgHospitalId")
 * @param $department   example: $("#departmentId")
 * @param departmentId
 * @param optionMsg
 */
function loadDepartmentListByOrg($hospital, $department, departmentId, optionMsg) {
  var formElementRevalidate = formElementRevalidateFactory($department.closest("form"));
  departmentId = typeof departmentId == 'undefinded' ? '' : departmentId;
  var categoriesLvlOne = $hospital.val();
  if (categoriesLvlOne != '') {
    $.ajax({
      type: 'get',
      dataType: 'json',
      data: {'id': categoriesLvlOne},
      url: getRootPath() + '/be/organization/suborganization',
      success: function (respbd) {
        resetOptions($department, optionMsg);
        $.each(respbd, function (i, e) {
          if (e.id == departmentId) {
            $department.append('<option value="' + e.id + '" selected>' + e.name + '</option>');
          } else {
            $department.append('<option value="' + e.id + '">' + e.name + '</option>');
          }
        });
        formElementRevalidate('departmentId');
      }
    });
  } else {
    resetOptions($department, optionMsg);
    formElementRevalidate('departmentId');
  }
}

/**
 * 根据指定用户id，获取用户电话并写回到页面元素
 *
 * @param $doctorId     example: $("#application\\.doctor\\.id")
 * @param $doctorPhone  example: $("#application\\.doctor\\.mobilePhone")
 */
function fetchUserPhone($doctorId, $doctorPhone) {
  var formElementRevalidate = formElementRevalidateFactory($doctorPhone.closest("form"));
  var doctorId = $doctorId.val();
  if (doctorId != '') {
    $.ajax({
      type: 'post',
      dataType: 'json',
      data: {id: doctorId},
      url: getRootPath() + '/be/user/phone',
      success: function (result) {
        $doctorPhone.val(result.mobilePhone);
        formElementRevalidate('application.doctor.mobilePhone');
      },
      error: function (result) {
        $doctorPhone.val('');
        layer.confirm(result.responseJSON.message, {
          btn: ['确定'],
          closeBtn: 0
        }, function (index) {
          layer.close(index)
        })
        formElementRevalidate('application.doctor.mobilePhone');
      }
    })
  } else {
    $doctorPhone.val('');
    formElementRevalidate('application.doctor.mobilePhone');
  }
}

/**
 * 根据检测类型，加载检测项目列表
 *
 * @param $testType example: $("#application\\.testTypes")
 * @param $testItem example: $("#testItemIds")
 * @param testItemIds
 */
function loadTestItemByTestType($testType, $testItem, testItemIds) {
  var formElementRevalidate = formElementRevalidateFactory($testItem.closest("form"));
  var value = $testType.val();
  var oldSelection = $testItem.val();
  if (value == "") {
    value = null;
  }
  $.ajax({
    type: 'post',
    dataType: 'json',
    data: {testTypes: value},
    url: getRootPath() + '/be/test-item/list',
    success: function (respbd) {
      $testItem.empty();
      $testItem.multiselect('enable');
      $.each(respbd, function (i, e) {
        $testItem.append('<option value="' + e.id + '">' + e.name + '</option>');
      });
      if (typeof testItemIds != 'undefined') {
        for (var i = 0; i < testItemIds.length; i++) {
          $testItem.multiselect('select', testItemIds[i]);
        }
      }
      $testItem.multiselect('rebuild');
      if (oldSelection != '' && oldSelection != null) {
        for (var i = 0; i < oldSelection.length; i++) {
          $testItem.multiselect('select', oldSelection[i]);
        }
      }
      formElementRevalidate('testItemIds');
    }
  });
}

/**
 * 根据勾选的检测项目，将关联的检测内容选中
 *
 * @param $testItem example: $("#testItemIds")
 * @param $testGene example: $("#testGeneIds")
 */
function setTestGeneByItems($testItem, $testGene) {
  var formElementRevalidate = formElementRevalidateFactory($testGene.closest("form"));
  var testItemIds = $testItem.val();
  if (null == testItemIds) {
    $testGene.multiselect('deselectAll', false);
    $testGene.multiselect('select', '');
    formElementRevalidate('testGeneIds');
    return;
  } else {
    $.ajax({
      type: 'post',
      dataType: 'json',
      data: {testItemIds: testItemIds},
      url: getRootPath() + '/be/test-item/test-gene',
      success: function (data) {
        setTestGeneSelected($testGene, data);
        formElementRevalidate('testGeneIds');
      }
    });
  }
}

/**
 * 根据传入数据，设定检测内容的选中项
 *
 * @param $testGene
 * @param testGeneIds
 */
function setTestGeneSelected($testGene, testGeneIds) {
  $testGene.multiselect('deselectAll', false);
  for (var i = 0; i < testGeneIds.length; i++) {
    $testGene.multiselect('select', testGeneIds[i]);
  }
}

/**
 * 清空select元素下的option选项，并设置空选项
 *
 * @param selector
 * @param optionMsg
 */
function resetOptions(selector, optionMsg) {
  if (selector != "") {
    selector.empty();
    optionMsg = typeof optionMsg !== "undefined" ? optionMsg : "请选择"
    selector.append('<option value="">' + optionMsg + '</option>');
  }
}

/**
 * 基础病理创建和编辑订单页面的前端验证
 *
 * @param form
 */

function orderFromValidate(form) {
  var patientId = $(form).find('[name="patient.idNo"]').val();
  $(form).formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      'patient.fullName': {
        validators: {
          notEmpty: {}
        }
      },
      'patient.gender': {
        validators: {
          notEmpty: {}
        }
      },
      'patient.email': {
        validators: {
          emailAddress: {
            message: '请输入有效的电子邮箱'
          }
        }
      },
      'application.contactPhone': {
        validators: {
          notEmpty: {},
          phone: {
            message: '请输入完整的十一位电话(如：02133967872，18122339791)',
            country: 'CN'
          }
        }
      },
      'application.doctor.id': {
        validators: {
          notEmpty: {}
        }
      },
      'patient.idNo': {
        validators: {
          callback: {
            message: '请输入符合要求的身份证号',
            callback: function () {
              var id = $(form).find('[name="patient.idNo"]').val();
              if (validateIdNo(id)) {
                checkUserIfExisted(id, patientId, userInfoRender);
                patientId = id;
                return true;
              } else {
                return false;
              }
            }
          }
        }
      },
      'order.pathologyNos': {
        validators: {
          callback: {
            message: '病理号必填且各病理编号需要以;（半角）作为结束',
            callback: function () {
              var pathologyNos = $(form).find('[name="order.pathologyNos"]').val();
              if (pathologyNos == "") {
                return false
              } else if (/^[a-zA-Z0-9;-]+$/.test(pathologyNos)) {
                return true;
              } else {
                return false;
              }
            }
          }
        }
      },
      'orgHospitalId': {
        validators: {
          notEmpty: {}
        }
      },
      'application.doctor.id': {
        validators: {
          notEmpty: {}
        }
      },
      'application.applicationDate': {
        validators: {
          notEmpty: {}
        }
      },
      'order.orderPrice': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
            transformer: function ($field, validatorName, validator) {
              var value = $field.val();
              var verify = /^[0-9]+([.]\d{1,2})?$/;
              if (value == "") {
                return value.replace(',', '')
              } else if (!verify.test(value)) {
                return false;
              } else {
                return value.replace(',', '');
              }
            }
          }
        }
      },
      'dstHospitalIds': {
        validators: {
          notEmpty: {}
        }
      },
      'patient.age': {
        validators: {
          integer: {
            message: '请输入有效的数字'
          },
          notEmpty: {}
        }
      },
      'application.contactPhone': {
        validators: {
          notEmpty: {},
          phone: {
            message: '请输入完整的十一位电话(如：02133967872，18122339791',
            country: 'CN'
          }
        }
      },
      'order.receivablePrice': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
            transformer: function ($field, validatorName, validator) {
              var value = $field.val();
              var verify = /^[0-9]+([.]\d{1,2})?$/;
              if (!verify.test(value)) {
                return false;
              } else {
                return value.replace(',', '');
              }
            }
          }
        }
      },
      'sampleIndexes': {
        validators: {
          notEmpty: {}
        }
      },
      sampleNums: {
        validators: {
          integer: {
            message: '请输入有效的数字'
          }
        }
      },
      'order.paymentType': {
        validators: {
          notEmpty: {}
        }
      },
      'order.paymentDate': {
        validators: {
          notEmpty: {}
        }
      },
      'sampleSenderId': {
        validators: {
          notEmpty: {}
        }
      },
      'reportReceiverId': {
        validators: {
          notEmpty: {}
        }
      }
    }
  }).on('err.form.fv', function (e) {
    is_confirm = true;
  }).on('success.form.fv', function (e) {
    // Prevent form submission
    e.preventDefault();
    //提交后按钮不能再次点击
    $('input[type="submit"]').prop('disabled', true);
    if (sampleCheck(form)) {
      // You can get the form instance
      var $form = $(e.target);
      // and the FormValidation instance
      var fv = $form.data('formValidation');
      // Use the defaultSubmit() method if you want to submit the form
      // See http://formvalidation.io/api/#default-submit
      fv.defaultSubmit();
    }
  });
}

/**
 * 分子病理创建和编辑订单前端验证
 *
 * @param form
 */
function orderGeneFormValidate(form) {
  var patientId = $(form).find('[name="patient.idNo"]').val();
  $(form).formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      orgHospitalId: {
        validators: {
          notEmpty: {}
        }
      },
      departmentId: {
        validators: {
          notEmpty: {}
        }
      },
      'application.doctor.id': {
        validators: {
          notEmpty: {}
        }
      },
      'application.doctor.mobilePhone': {
        validators: {
          notEmpty: {},
          phone: {
            message: '请输入完整的十一位电话(如：02133967872，18122339791',
            country: 'CN'
          }
        }
      },
      'dstHospitalIds': {
        validators: {
          notEmpty: {}
        }
      },
      'application.applicationDate': {
        validators: {
          notEmpty: {}
        }
      },
      'application.medicalHistory': {
        validators: {
          notEmpty: {}
        }
      },
      'application.diagnosis': {
        validators: {
          notEmpty: {}
        }
      },
      'patient.idNo': {
        validators: {
          callback: {
            message: '请输入符合要求的身份证号',
            callback: function () {
              var id = $(form).find('[name="patient.idNo"]').val();
              if (validateIdNo(id)) {
                checkUserIfExisted(id, patientId, userInfoRender);
                patientId = id;
                return true;
              } else {
                return false;
              }
            }
          }
        }
      },
      'order.pathologyNos': {
        validators: {
          callback: {
            message: '各病理编号需要以;（半角）作为结束',
            callback: function () {
              var pathologyNos = $(form).find('[name="order.pathologyNos"]').val();
              if (pathologyNos == '') {
                return true
              } else if (/^[a-zA-Z0-9;-]+$/.test(pathologyNos)) {
                return true;
              } else {
                return false;
              }
            }
          }
        }
      },
      'patient.fullName': {
        validators: {
          notEmpty: {}
        }
      },
      'patient.gender': {
        validators: {
          notEmpty: {}
        }
      },
      'patient.age': {
        validators: {
          notEmpty: {},
          integer: {
            message: '请输入有效的数字'
          }
        }
      },
      'application.contactPhone': {
        validators: {
          notEmpty: {},
          phone: {
            message: '请输入完整的十一位电话(如：02133967872，18122339791',
            country: 'CN'
          }
        }
      },
      'patient.email': {
        validators: {
          emailAddress: {
            message: '请输入有效的电子邮箱'
          }
        }
      },
      'sampleIndexes': {
        validators: {
          notEmpty: {}
        }
      },
      'application.cancerType': {
        validators: {
          notEmpty: {}
        }
      },
      'sampleSenderId': {
        validators: {
          notEmpty: {}
        }
      },
      'reportReceiverId': {
        validators: {
          notEmpty: {}
        }
      },
      'order.receivablePrice': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
            transformer: function ($field, validatorName, validator) {
              var value = $field.val();
              var verify = /^[0-9]+([.]\d{1,2})?$/;
              if (!verify.test(value)) {
                return false;
              } else {
                return value.replace(',', '');
              }
            }
          }
        }
      },
      'order.orderPrice': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
            transformer: function ($field, validatorName, validator) {
              var value = $field.val();
              var verify = /^[0-9]+([.]\d{1,2})?$/;
              if (value == "") {
                return value.replace(',', '')
              } else if (!verify.test(value)) {
                return false;
              } else {
                return value.replace(',', '');
              }
            }
          }
        }
      },
      'order.paymentType': {
        validators: {
          notEmpty: {}
        }
      },
      'order.paymentDate': {
        validators: {
          notEmpty: {}
        }
      },
      'application.testTypes': {
        validators: {
          notEmpty: {}
        }
      },
      'testItemIds': {
        validators: {
          notEmpty: {}
        }
      },
      'testGeneIds': {
        validators: {
          notEmpty: {}
        }
      },
      'sampleNums': {
        validators: {
          integer: {
            message: '请输入有效的数字'
          }
        }
      }
    }
  }).on('err.form.fv', function (e) {
    is_confirm = true;
  }).on('success.form.fv', function (e) {
    // Prevent form submission
    e.preventDefault();
    //提交后按钮不能再次点击
    $('input[type="submit"]').prop('disabled', true);
    if (sampleCheck(form)) {
      // You can get the form instance
      var $form = $(e.target);
      // and the FormValidation instance
      var fv = $form.data('formValidation');
      // Use the defaultSubmit() method if you want to submit the form
      // See http://formvalidation.io/api/#default-submit
      fv.defaultSubmit();
    }
  });
}

function orderBaseFormValidation(form) {
  var patientId = $(form).find('[name="patient.idNo"]').val();
  $(form).formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      'patient.fullName': {
        validators: {
          notEmpty: {}
        }
      },
      'patient.gender': {
        validators: {
          notEmpty: {}
        }
      },
      'patient.age': {
        validators: {
          notEmpty: {},
          integer: {
            message: '请输入有效的年龄'
          },
          stringLength: {
            max: 3,
            min: 0,
            message: '请输入有效的年龄'
          }
        }
      },
      'patient.idNo': {
        validators: {
          callback: {
            message: '请输入符合要求的身份证号',
            callback: function () {
              var id = $(form).find('[name="patient.idNo"]').val();
              if (id == "") {
                return true;
              } else if (validateIdNo(id)) {
                checkUserIfExisted(id, patientId, userInfoRender);
                patientId = id;
                return true;
              } else {
                return false;
              }
            }
          }
        }
      },
      'patient.email': {
        validators: {
          emailAddress: {
            message: '请输入有效的电子邮箱'
          }
        }
      },
      'application.doctor.id': {
        validators: {
          notEmpty: {
            message: ' '
          }
        }
      },
      'departmentId': {
        validators: {
          notEmpty: {}
        }
      },
      'applicationDate': {
        validators: {
          notEmpty: {},
        }
      },
      'patient.mobilePhone': {
        validators: {
          notEmpty: {},
          phone: {
            message: '请输入完整的十一位电话(如：02133967872，18122339791)',
            country: 'CN'
          }
        }
      },
      'application.medicalHistory': {
        validators: {
          notEmpty: {}
        }
      },
      'application.diagnosis': {
        validators: {
          notEmpty: {}
        }
      },
      'application.surgery': {
        validators: {
          notEmpty: {}
        }
      },
      'clinicalDiagnosis': {
        validators: {
          notEmpty: {}
        }
      },
      'tissueSampleNames': {
        validators: {
          notEmpty: {
            message: ' '
          }
        }
      },
      'dstHospitalId': {
        validators: {
          notEmpty: {
            message: ' '
          }
        }
      },
      'tissueSampleDates': {
        validators: {
          notEmpty: {
            message: ' '
          }
        }
      },
      'tissueSampleParts': {
        validators: {
          notEmpty: {
            message: ' '
          }
        }
      },
      'tissueSampleAmounts': {
        validators: {
          notEmpty: {
            message: ' '
          },
        }
      },
      'application.sampleInfo.lastMenstruationDate': {
        validators: {
          notEmpty: {}
        }
      },
      'application.sampleInfo.menstruationBloodVolume': {
        validators: {
          notEmpty: {}
        }
      },
      'application.sampleInfo.inspectionPlace': {
        validators: {
          notEmpty: {}
        }
      },
      'application.sampleInfo.inspectionDate': {
        validators: {
          notEmpty: {}
        }
      },
      'application.sampleInfo.dosage': {
        validators: {
          notEmpty: {}
        }
      },
      'application.sampleInfo.treatmentDate': {
        validators: {
          notEmpty: {}
        }
      },
      orgHospitalId: {
        validators: {
          notEmpty: {}
        }
      }
    }
  })
      .on('click', '.sample-add', function () {
        var $template = $('.sample:first');
        $clone = $template
            .clone().appendTo('.sampleInfo')
            .removeClass('hide')
            .removeAttr('id')
            .insertBefore($template);
        $option = $clone.find('[name="tissueSampleParts"]');
        $(form).formValidation('addField', $option);
        $option = $clone.find('[name="tissueSampleNames"]');
        $(form).formValidation('addField', $option);
        $option = $clone.find('[name="tissueSampleDates"]');
        $(form).formValidation('addField', $option);
        $option = $clone.find('[name="tissueSampleAmounts"]');
        $(form).formValidation('addField', $option);
        $clone.find('[name="tissueSampleDates"]').datepicker({
          format: 'yyyy-mm-dd',
          language: 'zh-CN',
          autoclose: true,
          todayHighlight: true
        }).on('changeDate', function (e) {
          $(form).data('formValidation').enableFieldValidators('tissueSampleDates', true);
          // Revalidate the date field
          $(form).formValidation('revalidateField', 'tissueSampleDates');
        });
        var $template2 = $('.sample:first');
        var $template3 = $template2.find("input [name='tissueSampleParts']");
        $('.sample:first').find('[name="tissueSampleIds"]').attr("value", " ");
        $('.sample:first').find('[name="tissueSampleParts"]').val("");
        $('.sample:first').find('[name="tissueSampleNames"]').val('');
        $('.sample:first').find('[name="tissueSampleDates"]').val('');
        $('.sample:first').find('[name="tissueSampleDates"]').datepicker('setDate', '');
        $('.sample:first').find('[name="tissueSampleAmounts"]').val('');
        $(form).data('formValidation').enableFieldValidators('tissueSampleDates', false);
      })
      .on('click', '.sample-delete', function () {
        if ($('.sample').length == 1) {
          layer.msg("无法删除,样本数量必须大于等于1")
        } else {
          var $row = $(this).parents('.form-group');

          // Remove element containing the option
          $row.remove();

          // Remove field
          var $option = $row.find('[name="tissueSampleParts"]');
          $(form).formValidation('removeField', $option);

          $option = $row.find('[name="tissueSampleNames"]');
          $(form).formValidation('removeField', $option);

          $option = $row.find('[name="tissueSampleDates"]');
          $(form).formValidation('removeField', $option);

          $option = $row.find('[name="tissueSampleAmounts"]');
          $(form).formValidation('removeField', $option);
        }
      })
      .on('success.form.fv', function (e) {
      });
}

/**
 * 检查勾选样本数量是否为空
 * @param form
 * @returns {boolean}
 */
function sampleCheck(form) {
  var sampleIndexes = $(form + " input[name='sampleIndexes']");
  var sampleNums = $(form + " input[name='sampleNums']");
  for (var i = 0; i < sampleNums.size(); i++) {
    if (sampleIndexes[i].checked) {
      if ($.trim(sampleNums[i].value) == '' || sampleNums[i].value == null) {
        layer.msg("请为勾选的材料清单" + $('label[for="' + $(form + " input[name='sampleIndexes']")[i].id + '"]').text()
            + "输入数量!");
        return false;
      }
    }
  }
  return true;
}

/**
 * 下载文件
 * @param fileName
 * @param url
 * 方法来自AlloyTeam：http://www.alloyteam.com/2014/01/use-js-file-download/
 */
function downloadFile(fileName, url) {
  var aLink = document.createElement('a');
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错
  aLink.download = fileName;
  aLink.href = url;
  aLink.dispatchEvent(evt);
}

/**
 * 通过ajax提交带有input[type=file]的form
 *
 * @param 要提交的form（JS原生变量，非jQuery变量）
 */
function ajaxFileForm(form, url) {
  $.ajax({
    url: $(form).attr("action"),
    type: 'post',
    dataType: 'json',
    data: new FormData(form),
    mimeType: "multipart/form-data",
    contentType: false,
    cache: false,
    processData: false,
    success: function (data) {
      if (data.code == '200') {
        layer.msg("操作成功！");
        if (typeof url !== 'undefined') {
          delayDetailReload(url);
        } else {
          delayReload();
        }
      }
    }
  });
}


/**
 * 异步加载订单样本信息
 */
function loadSampleInfo() {
  $.ajax({
    type: 'post',
    url: getRootPath() + '/be/order/sample',
    data: {
      orderNo: $("#orderNo").val()
    },
    dataType: 'json',
    success: function (orderDto) {
      if (orderDto.error == null) {
        var sampleTypes = orderDto.sampleTypes;
        var sampleNums = orderDto.sampleNums;
        var sampleTypeHiddenInputs = $("input[name='sampleTypes']");
        var sampleNumInputs = $("input[name='sampleNums']");
        var sampleCheckboxes = $("input[name='sampleIndexes']");

        for (var i = 0; i < sampleTypes.length; i++) {
          for (var j = 0; j < sampleTypeHiddenInputs.length; j++) {
            if (sampleTypes[i] == sampleTypeHiddenInputs[j].value) {
              sampleCheckboxes[j].checked = true;
              sampleNumInputs[j].value = sampleNums[i];
              break;
            }
          }
        }
      }
    }
  });
}

//daterangepicker的设置
function dateRangePickerSet(input, callback, options) {
  var locale = {
    format: 'YYYY-DD-MM',
    language: 'zh-CN',
    applyLabel: '应用',
    cancelLabel: '取消',
    fromLabel: '开始日期',
    toLabel: '结束日期',
    customRangeLabel: 'Custom Range',
    daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    firstDay: 0,
  };
  $.extend(locale, options);
  $(input).daterangepicker(locale, callback);
}

//获取元素之间的html并删除其间的空格和回车
function trimMultiLine(str) {
  return str.replace(/\ +/g, "").replace(/[\r\n]/g, "");
}

//location的reload延后执行
function delayReload(time) {
  if (time != undefined) {
    setTimeout(function () {
      location.reload();
    }, time)
  } else {
    setTimeout(function () {
      location.reload();
    }, 1500)
  }
}

function activeTabUrl(tab) {
  var currentUrl = window.location.href;
  var index = currentUrl.indexOf("activeTab");
  if (index != -1) {
    currentUrl = currentUrl.substring(0, index - 1);
  }
  return currentUrl + "&activeTab=" + tab;
}

//detail页面的reload延后执行
function delayDetailReload(url, time) {
  if (time != undefined) {
    setTimeout(function () {
      window.location.href = url;
    }, time)
  } else {
    setTimeout(function () {
      window.location.href = url;
    }, 1500)
  }
}

/**
 *
 */
function getProvinces($provinceElement, $cityElement, $districtElement, callback) {
  $.ajax({
    type: 'GET',
    url: getRootPath() + '/provinces',
    success: function (resp) {
      resetOptions($cityElement);
      resetOptions($districtElement);
      var html = '';
      $.each(resp, function (index, ele) {
        html += '<option value="' + ele.id + '">' + ele.name + '</option>';
      });
      $provinceElement.html(html);
      $provinceElement.find("option:first").prop("selected", true);
      if (callback) {
        callback();
      }
    }
  });
}

/**
 * 省/直辖市变化时，改变市/区选择框选项
 * @param provinceId
 * @param $cityElement
 * @param $districtElement
 * @param selectItem
 * @param callback
 */
function getCityByProvinceIds(provinceId, $cityElement, $districtElement, selectItem, callback) {
  var provinceIds;
  if (typeof provinceId == 'string') {
    if (provinceId !== "") {
      provinceIds = new Array(provinceId);
    } else {
      provinceIds = new Array();
    }
  } else {
    provinceIds = provinceId;
  }

  var selectItems;
  if (typeof selectItem == 'string') {
    selectItems = new Array(selectItem);
  } else {
    selectItems = selectItem;
  }

  var oldSelection = $cityElement.val();

  if ($cityElement.attr("multiple") == 'multiple') {
    $cityElement.empty();
    $cityElement.multiselect('enable');
    $cityElement.multiselect('rebuild');
    $districtElement.empty();
    $districtElement.multiselect('enable');
    $districtElement.multiselect('rebuild');
  } else {
    resetOptions($cityElement);
    resetOptions($districtElement);
  }

  if (provinceIds !== null && provinceIds.length > 0) {
    $.ajax({
      type: 'POST',
      data: {'provinceIds': provinceIds},
      url: getRootPath() + '/province/cities',
      success: function (respbd) {
        if ($cityElement.attr("multiple") == 'multiple') {
          $cityElement.multiselect('enable');
        }
        $.each(respbd, function (i, e) {
          if (selectItems != undefined && selectItems.indexOf(e.id.toString()) > -1) {
            $cityElement.append('<option value="' + e.id + '" selected>' + e.name + '</option>');
          } else {
            $cityElement.append('<option value="' + e.id + '">' + e.name + '</option>');
          }
        });
        if ($cityElement.attr("multiple") == 'multiple') {
          $cityElement.multiselect('rebuild');
          if (oldSelection != '' && oldSelection != null) {
            for (var i = 0; i < oldSelection.length; i++) {
              $cityElement.multiselect('select', oldSelection[i]);
            }
            getDistrictByCityIds(oldSelection, $districtElement);
          }
        }
        if (callback != undefined) {
          callback();
        }
      }
    });
  }
}

/**
 * 市/区变化时，改变区/县选择框选项
 * @param cityId
 * @param $districtElement
 * @param selectItem
 */
function getDistrictByCityIds(cityId, $districtElement, selectItem, callback) {
  var cityIds;
  if (typeof cityId == 'string') {
    if (cityId !== "") {
      cityIds = new Array(cityId);
    } else {
      cityIds = new Array();
    }
  } else {
    cityIds = cityId;
  }

  var selectItems;
  if (typeof selectItem == 'string') {
    selectItems = new Array(selectItem);
  } else {
    selectItems = selectItem;
  }

  var oldSelection = $districtElement.val();

  if ($districtElement.attr("multiple") == 'multiple') {
    $districtElement.empty();
    $districtElement.multiselect('enable');
    $districtElement.multiselect('rebuild');
  } else {
    resetOptions($districtElement);
  }

  if (cityIds != null && cityIds.length > 0) {
    $.ajax({
      type: 'POST',
      data: {'cityIds': cityIds},
      url: getRootPath() + '/province/city/districts',
      success: function (respbd) {
        if (respbd == '') {
          $districtElement.hide();
        } else {
          if ($districtElement.attr("multiple") == 'multiple') {
            $districtElement.multiselect('enable');
          } else {
            $districtElement.show();
          }
          $.each(respbd, function (i, e) {
            if (selectItems != undefined && selectItems.indexOf(e.id.toString()) > -1) {
              $districtElement.append('<option value="' + e.id + '" selected>' + e.name + '</option>');
            } else {
              $districtElement.append('<option value="' + e.id + '">' + e.name + '</option>');
            }
          });
          if ($districtElement.attr("multiple") == 'multiple') {
            $districtElement.multiselect('rebuild');
            if (oldSelection != '' && oldSelection != null) {
              for (var i = 0; i < oldSelection.length; i++) {
                $districtElement.multiselect('select', oldSelection[i]);
              }
            }
          }
        }
        if (callback) {
          callback();
        }
      }
    });
  }
}
/**
 * 所有的行政区下拉框变化时，改变医院选择框选项
 * @param cityId
 * @param $districtElement
 * @param selectItem
 */
function getOrgHospitalByIds(provinceId, cityId, districtId, $orgHospital, callback) {
  var provinceIds, cityIds, districtIds;
  if (typeof provinceId == 'string') {
    provinceIds = new Array(provinceId);
  } else {
    provinceIds = provinceId;
  }
  if (typeof cityId == 'string') {
    cityIds = new Array(cityId);
  } else {
    cityIds = cityId;
  }
  if (typeof districtId == 'string') {
    districtIds = new Array(districtId);
  } else {
    districtIds = districtId;
  }
  var oldSelection = $orgHospital.val();
  $.ajax({
    type: 'POST',
    data: {
      provinceIds: provinceIds,
      cityIds: cityIds,
      districtIds: districtIds
    },
    url: getRootPath() + '/be/organization/get-hospitals',
    success: function (respbd) {
      if (respbd == '') {
        if ($orgHospital.attr("multiple") == 'multiple') {
          $orgHospital.empty()
          $orgHospital.multiselect('enable');
          $orgHospital.multiselect('rebuild');
        }
      } else {
        if ($orgHospital.attr("multiple") == 'multiple') {
          $orgHospital.empty()
          $orgHospital.multiselect('enable');
        } else {
          $orgHospital.show();
          resetOptions($orgHospital);
        }
        $.each(respbd, function (i, e) {
          $orgHospital.append('<option value="' + e.id + '">' + e.name + '</option>');
        });
        if ($orgHospital.attr("multiple") == 'multiple') {
          $orgHospital.multiselect('rebuild');
          if (oldSelection != '' && oldSelection != null) {
            for (var i = 0; i < oldSelection.length; i++) {
              $orgHospital.multiselect('select', oldSelection[i]);
            }
          }
        }
        if (callback != undefined) {
          callback();
        }
      }
    }
  });
}

function getDepartmentsByHospital(hospitalId, $selectItem, callback) {
  $.ajax({
    url: getRootPath() + '/be/hospital/departments',
    data: {
      hospitalId: hospitalId
    },
    type: 'post',
    success: function (resp) {
      if (resp == '') {

      } else {
        var html = '';
        $.each(resp, function (i, e) {
          html += '<option value="' + e.id + '">' + e.name + '</option>';
        });
        $selectItem.html(html);
        $selectItem.multiselect('rebuild');
        $selectItem.multiselect('enable');
        if (callback) {
          callback();
        }
      }
    }
  })
}
/**
 * 渲染多选框
 * @param $element
 */
function multiSelectRender($element, config) {
  var data = {
    includeSelectAllOption: true,
    enableFiltering: true,
    disableIfEmpty: true,
    maxHeight: 200,
    buttonWidth: '100%',
    nonSelectedText: $element.attr('multi-text')
  };
  $.extend(data, config);
  $element.multiselect(data);
}

/**
 * 获取url中的参数
 * @param name
 * @returns {null}
 */
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}