/**
 * Created by Feddiyao on 2017/5/18.
 */
$(document).ready(function () {
  var testPriceUpdate = new TestPriceUpdate();
  var status = $('#page-status').attr('class');

  //判断是否为列表页面跳转的需要添加合作信息
  (function () {
    var editElement = getQueryString('type');
    if (editElement === 'edit') {
     $('#province').attr('disabled', 'disabled');
    }
  })();

  var $checkBox = {
    allOptionCheckBox: $('.allOption'),
    contentListCheckBox: $('.contentList')
  };

  //项目信息中全选框的js效果
  $checkBox.allOptionCheckBox.click(function () {
    var checkStatus = this.checked;
    testPriceUpdate.setChecked($checkBox.contentListCheckBox, checkStatus);
  });

  $checkBox.contentListCheckBox.click(function () {
    var elements = $checkBox.contentListCheckBox;
    var allOption = $checkBox.allOptionCheckBox;
    testPriceUpdate.setAllOption(elements, allOption[0], $(this).prop('checked'))
  });

  $('.viewTestContentDetail').on('click', function () {
    // $('#testContentDetailModal').modal();
    if (status === 'dynamic') {
      var id = $(this).attr("id");
      if ($(this).attr("value") == "edit") {
        testPriceUpdate.detailEdit(id);
      } else if ($(this).attr("value") == "create") {
        testPriceUpdate.detailCreate(id);
      }
    }  else {
      $('#testContentDetailModal').modal();
    }
  })

  testPriceUpdate.testPriceUpdateFormValidation($('#testPriceCreateForm'))
});

var TestPriceUpdate = new Function();

TestPriceUpdate.prototype.detailEdit = function (id) {
  var that = this;
  $.ajax({
    type: 'GET',
    url: ctxPath + 'be/pathology-test/detailEdit?priceId='+id,
    dataType: 'JSON',
    success: function (msg) {
      if (msg.error == null) {
        that._showEdit(msg);
      }
    },
    error: function (msg) {
      alert("error");
    }
  });
};

TestPriceUpdate.prototype.detailCreate = function (id) {
  var that = this;
  $.ajax({
    type: 'GET',
    url: ctxPath + 'be/pathology-test/detailCreate?contentId='+id,
    dataType: 'JSON',
    success: function (msg) {
      if (msg.error == null) {
        that._showEdit(msg);
      }
    },
    error: function (msg) {
      alert("error");
    }
  });
};

TestPriceUpdate.prototype._showEdit = function (msg) {
  $("#nameDetail").html(msg.name);
  $("#priceCodeDetail").html(msg.priceCode);
  $("#methodDetail").html(msg.method);
  $("#sampleRequirementDetail").html(msg.sampleRequirement);
  $("#preservationNormalTemperatureDetail").html(msg.preservationNormalTemperature);
  $("#preservationRefrigerationDetail").html(msg.preservationRefrigeration);
  $("#preservationFreezingDetail").html(msg.preservationFreezing);
  $("#reportRequirementDetail").html(msg.reportRequirement);
  $("#priceDetail").html(msg.price);
  $("#clinicSignificanceDetail").html(msg.clinicSignificance);
  $("#testContentDetailModal").modal('show');
};

TestPriceUpdate.prototype.setChecked = function (elements, status) {
  for (var i = 0; i < elements.length; i++) {
    elements[i].checked = status;
  }
};

TestPriceUpdate.prototype.setAllOption = function (elements, allOption, checkStatus) {
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

TestPriceUpdate.prototype.testPriceUpdateFormValidation = function ($form) {
  var that = this;
  $form.formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      'price': {
        validators: {
          integer: {
            message: '请输入有效的数字'
          }
        }
      },
      'province': {
        validators: {
          notEmpty: {}
        }
      }
    }
  }).on('success.form.fv', function (e) {
    // Prevent form submission
    e.preventDefault();
    //提交后按钮不能再次点击
    $('input[type="submit"]').prop('disabled', true);
    if (that._testPriceCheck($form)) {
      // You can get the form instance
      var $formTarget = $(e.target);
      // and the FormValidation instance
      var fv = $formTarget.data('formValidation');
      // Use the defaultSubmit() method if you want to submit the form
      // See http://formvalidation.io/api/#default-submit
      fv.defaultSubmit();
    }
  })
};

TestPriceUpdate.prototype._testPriceCheck = function ($form) {
  var testPriceIndexes = $form.find('.checkbox');
  var testPrice = $form.find(".contentPrice");
  for (var i = 0; i < testPrice.size(); i++) {
    if (testPriceIndexes[i + 1].checked) {
      if ($.trim(testPrice[i].value) == '' || testPrice[i].value == null) {
        layer.msg("请为勾选的检测内容输入价格!");
        return false;
      }
    }
  }
  return true;
};