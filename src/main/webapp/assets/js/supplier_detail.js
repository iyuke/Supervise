/**
 * Created by Felix on 2017/5/17.
 */
var status = $('#page-status').attr('class');
$(document).ready(function () {
  var supplierDetail = new SupplierDetail();

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
    editItemInfo: $('#editItemInfo'),
    viewItemInfo: $('#viewItemInfo'),
  };

  var $form = {
    editBasicInfoForm: $('#editBasicInfoForm'),
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

  //多选框组件
  multiSelectRender($('#supplierType_edit'));

  supplierDetail.basicInfoFormValidation($form.editBasicInfoForm);

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
    supplierDetail.setChecked(elements, checkStatus);
  });

  $checkBox.itemListCheckBox.click(function () {
    var id = this.closest('table').parentNode.parentNode.getAttribute("id");
    var elements = $("div#" + id + " .itemList");
    var allOption = $("div#" + id + " .allOption");
    supplierDetail.setAllOption(elements, allOption[0], $(this).prop('checked'))
  });

  // 项目信息验证
  supplierDetail.itemInfoFormValidation($form.editItemInfoForm);

  (function () {
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
});

var SupplierDetail = new Function();

SupplierDetail.prototype.basicInfoFormValidation = function ($form) {
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
      'supplierType': {
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
    }
  }).on('success.form.fv', function (e) {
    that.update(this, e);
  });
}


SupplierDetail.prototype.setChecked = function (elements, status) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].checked = status;
  }
};

SupplierDetail.prototype.setAllOption = function (elements, allOption, checkStatus) {
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

SupplierDetail.prototype.itemInfoFormValidation = function ($form) {
  var that = this;
  $form.formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      'price': {
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

SupplierDetail.prototype.update = function (form, e) {
  e.preventDefault();
  var data = $(form).serialize();

  var flag = $(form).find("input[name=flag]").val();
  if (flag === '2') {
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
  $.ajax({
    type: "post",
    data: data,
    url: ctxPath + "be/supplier/edit",
    success: function (resp) {
      window.location.href = window.location.href;
    },
    complete: function () {
      var $submit = $(form).find("input:submit");
      $submit.removeAttr("disabled");
      $submit.removeClass("disabled");
    }
  });
};

