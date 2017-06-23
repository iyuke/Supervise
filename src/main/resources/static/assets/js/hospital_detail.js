/**
 * Created by Feddiyao on 2017/5/17.
 */
var status = $('#page-status').attr('class');
$(document).ready(function () {
  var hospitalDetail = new HospitalDetail();

  var $searchProvince = $('#provinceId_edit');
  var $searchCity = $('#cityId_edit');
  var $searchDistrict = $('#districtId_edit');

  var currentProvinceId = $("#current_province").val();
  var currentCityId = $("#current_city").val();
  var currentDistrictId = $("#current_district").val();

  if (status === 'dynamic') {
    getProvinces($searchProvince, $searchCity, $searchDistrict, function () {
      //选择搜索条件中的省市区
      if (null != currentProvinceId && undefined != currentProvinceId) {
        $searchProvince.val(currentProvinceId);
        if (null != currentCityId && undefined != currentCityId) {
          resetOptions($searchCity);
          getCityByProvinceIds($searchProvince.val(), $searchCity, $searchDistrict, "string", function () {
            $searchCity.val(currentCityId);
            if (null != currentDistrictId && undefined != currentDistrictId) {
              resetOptions($searchDistrict);
              getDistrictByCityIds($searchCity.val(), $searchDistrict, "string", function () {
                $searchDistrict.val(currentDistrictId);
              });
            }
          });
        }
      }
    });

    $searchProvince.change(function () {
      getCityByProvinceIds($searchProvince.val(), $searchCity, $searchDistrict);
    });

    $searchCity.change(function () {
      getDistrictByCityIds($searchCity.val(), $searchDistrict);
    });
  }

  var $box = {
    editBasicInfo: $('#editBasicInfo'),
    viewBasicInfo: $('#viewBasicInfo'),
    editResearchInfo: $('#editResearchInfo'),
    viewResearchInfo: $('#viewResearchInfo'),
    editOtherInfo: $('#editOtherInfo'),
    viewOtherInfo: $('#viewOtherInfo'),
    editItemInfo: $('#editItemInfo'),
    viewItemInfo: $('#viewItemInfo'),
    editCooperationInfo: $('#editCooperationInfo'),
    viewCooperationInfo: $('#viewCooperationInfo')
  };

  var $form = {
    editBasicInfoForm: $('#editBasicInfoForm'),
    editSearchInfoForm: $('#editSearchInfoForm'),
    editCooperationInfoForm: $('#editCooperationInfoForm'),
    editItemInfoForm: $('#editItemInfoForm')
  };

  var $checkBox = {
    allOptionCheckBox: $('.allOption'),
    itemListCheckBox: $('.itemList')
  };

  //编辑基本信息
  $('#editBasicInfoBtn').on('click', function () {
    $box.editBasicInfo.show();
    $box.viewBasicInfo.hide();
  });

  $('#resetBasicInfoEditBtn').on('click', function () {
    $box.editBasicInfo.hide();
    $box.viewBasicInfo.show();
  });

  hospitalDetail.basicInfoFormValidation($form.editBasicInfoForm);

  //编辑调研信息
  $('#editResearchInfoBtn').on('click', function () {
    $box.editResearchInfo.show();
    $box.viewResearchInfo.hide();
  });

  $('#resetResearchInfoEditBtn').on('click', function () {
    $box.editResearchInfo.hide();
    $box.viewResearchInfo.show();
  });

  hospitalDetail.researchInfoFormValidation($form.editSearchInfoForm);

  //编辑服务信息
  $('#editOtherInfoBtn').on('click', function () {
    $box.editOtherInfo.show();
    $box.viewOtherInfo.hide();
  });

  $('#resetOtherInfoEditBtn').on('click', function () {
    $box.editOtherInfo.hide();
    $box.viewOtherInfo.show();
  });

  //编辑项目信息
  $('#editItemInfoBtn').on('click', function () {
    $box.editItemInfo.show();
    $box.viewItemInfo.hide();
  });

  $('#resetItemInfoEditBtn').on('click', function () {
    $box.editItemInfo.hide();
    $box.viewItemInfo.show();
  });

  //项目信息中全选框的js效果
  $checkBox.allOptionCheckBox.click(function () {
    var id = this.closest('table').parentNode.parentNode.getAttribute("id");
    var checkStatus = this.checked;
    var elements = $("div#" + id + " .itemList");
    hospitalDetail.setChecked(elements, checkStatus);
  });

  $checkBox.itemListCheckBox.click(function () {
    var id = this.closest('table').parentNode.parentNode.getAttribute("id");
    var elements = $("div#" + id + " .itemList");
    var allOption = $("div#" + id + " .allOption");
    hospitalDetail.setAllOption(elements, allOption[0], $(this).prop('checked'))
  });

  hospitalDetail.itemInfoFormValidation($form.editItemInfoForm);

  //是否与第三方合作动态变化
  $('.hasThirdParty').change(function () {
    var hasThirdPartyVal = $('.hasThirdParty:checked').val();
    if (hasThirdPartyVal === 'true') {
      $('.hasThirdPartyCollapse').show();
    } else {
      $('.hasThirdPartyCollapse').hide();
    }
  });

  //编辑合作信息
  $('#editCooperationInfoBtn').on('click', function () {
    $box.editCooperationInfo.show();
    $box.viewCooperationInfo.hide();
  });

  $('#resetCooperationInfoEditBtn').on('click', function () {
    $box.editCooperationInfo.hide();
    $box.viewCooperationInfo.show();
  });

  hospitalDetail.cooperationInfoFormValidation($form.editCooperationInfoForm);

  $("#editOtherInfoForm").submit(function (e) {
    hospitalDetail.update(this, e);
  });
  //判断是否为列表页面跳转的需要添加合作信息
  (function () {
    var editElement = getQueryString('edit');
    if (editElement === 'cooperation') {
      $box.editCooperationInfo.attr('class', 'box box-solid')
      $box.viewCooperationInfo.hide();
      location.hash = 'editCooperationInfoHash'
    }

    //渲染当前已经添加的检测项目，选中候选框
    var $currentPathologyTestItem = $("#pathologyTestItem_detail input.current_pathologyItem");
    $currentPathologyTestItem.each(function (index) {
      var id = $currentPathologyTestItem.eq(index).attr("id");
      $(".pathologyItem" + id).prop("checked", true);
    })

    var $currentPathologyTestItem = $("#testGene_detail input.current_testGene");
    $currentPathologyTestItem.each(function (index) {
      var id = $currentPathologyTestItem.eq(index).attr("id");
      var price = $currentPathologyTestItem.eq(index).attr("price");
      $(".testGene" + id).prop("checked", true);
      $(".testGene" + id).parents("tr").find("input.price").val(price);
    })
  })();

  //合作期限日期区间渲染
  dateRangePickerSet($('#contractDateRange_edit'), function (start, end, label) {
    hospitalDetail.cooperationDateRange.cooperationStatDate = start;
    hospitalDetail.cooperationDateRange.cooperationEndDate = end;
  });

  //多选框组件
  multiSelectRender($('#serviceCycle_edit'));
});


var HospitalDetail = new Function();

HospitalDetail.prototype.cooperationDateRange = {};

HospitalDetail.prototype.basicInfoFormValidation = function ($form) {
  var that = this;
  $form.formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      'name': {
        validators: {
          notEmpty: {}
        }
      },
      'provinceId': {
        validators: {
          notEmpty: {}
        }
      },
      'cityId': {
        validators: {
          notEmpty: {}
        }
      },
      'districtId': {
        validators: {
          notEmpty: {},
        }
      },
      'contactPhone': {
        validators: {
          phone: {
            message: '请输入完整的十一位电话(如：02133967872，18122339791',
            country: 'CN'
          }
        }
      },
      'directorPhone': {
        validators: {
          phone: {
            message: '请输入完整的十一位电话(如：02133967872，18122339791',
            country: 'CN'
          }
        }
      },
    }
  }).on('success.form.fv', function (e) {
    that.update(this, e);
  });
}

HospitalDetail.prototype.researchInfoFormValidation = function ($form) {
  var that = this;
  $form.formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      'amountOfResidentPopulation': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfOutpatients': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfSurgeries': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfBeds': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfRoutinePathology': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfTCT': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfHPV': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfIHC': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfConsultation': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfFrozenAndParaffin': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfTreatment': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfDischarged': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfMolecule': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'amountOfOutgoing': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      }
    }
  }).on('success.form.fv', function (e) {
    that.update(this, e);
  });
};

HospitalDetail.prototype.setChecked = function (elements, status) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].checked = status;
  }
};

HospitalDetail.prototype.setAllOption = function (elements, allOption, checkStatus) {
  if (checkStatus) {
    var isAllSelected = true;
    for (var i = 0; i < elements.length; i++) {
      if (!elements[i].checked) {
        isAllSelected = false;
        break;
      }
    }
    allOption.checked = isAllSelected;
  } else {
    allOption.checked = false;
  }
};

HospitalDetail.prototype.cooperationInfoFormValidation = function ($form) {
  var that = this;
  $form.formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      'invoiceCycle': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'output': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      }
    }
  }).on('success.form.fv', function (e) {
    that.update(this, e);
  });
};

HospitalDetail.prototype.itemInfoFormValidation = function ($form) {
  var that = this;
  $form.formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      'consultationServicePrice': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'pathologySettlementRatio': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'price': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
      'geneSettlementRatio': {
        validators: {
          numeric: {
            message: '请输入有效的数字',
          }
        }
      },
    }
  }).on('success.form.fv', function (e) {
    that.update(this, e);
  });

  HospitalDetail.prototype.update = function (form, e) {
    e.preventDefault();

    var data = $(form).serialize();

    var flag = $(form).find("input[name=flag]").val();
    if (flag === '3') {
      var $testGene = $(".testGene:checked");
      $testGene.each(function (index) {
        var $testGeneTr = $testGene.eq(index).parent().parent();
        data += "&testGenes[" + index + "].id=" + $testGene.eq(index).val();
        data += "&testGenes[" + index + "].price=" + $testGeneTr.find("input.price").val()
      });

      var $pathologyItem = $(".pathologyItem:checked");
      $pathologyItem.each(function (index) {
        data += "&pathologyTestItems[" + index + "].id=" + $pathologyItem.eq(index).val();
      });
    }

    if (this.cooperationDateRange.cooperationStatDate) {
      data += "&contractStartDate=" + this.cooperationDateRange.cooperationStatDate.format("YYYY-MM-DD");
    }
    if (this.cooperationDateRange.cooperationEndDate) {
      data += "&contractTerminationDate=" + this.cooperationDateRange.cooperationEndDate.format("YYYY-MM-DD");
    }
    console.log(JSON.stringify(data));
    $.ajax({
      type: "post",
      data: data,
      url: ctxPath + "be/hospital/edit",
      success: function (resp) {
        window.location.href = location.protocol + '//' + location.host + location.pathname + "?id=" + getQueryString("id");
      },
      complete: function () {
        var $submit = $(form).find("input:submit");
        $submit.removeAttr("disabled");
        $submit.removeClass("disabled");
      }
    });
  };
};
