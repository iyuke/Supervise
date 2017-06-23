/**
 * Created by Feddiyao on 2017/5/16.
 */
$(document).ready(function () {
  var pathologyTestPrice = new PathologyTestPrice();
  var status = $('#page-status').attr('class')
  var $iframe = $('#pathologyTestPriceGroupByProvince');
  var province = '上海市';
  
  //省份下拉可选框选动态效果实现
  $('.province_select').on('click', function () {
    var defaultHtml = $('#provinceDropdown')[0].childNodes[1].nodeValue;
    var oldParam = '%parame%';
    var updateParam = province = this.innerHTML;
    $('#pathologyTestPriceEditBtn').attr("href", "./edit?provinceId=" + $(this).attr("value"));
    var renderElement = $('#provinceDropdownBtn');
    pathologyTestPrice.updateHtml(defaultHtml, oldParam, updateParam, renderElement);
  });

  //搜索modal显示
  $('#testPriceSearchBtn').on('click', function () {
    $('#testPriceSearchModal').modal();
  });

  //搜索modal搜索提交事件
  window.onload = function(){
    $('#search_form_submit').on('click', function () {
      $('#testPriceSearchModal').modal('hide');
      $iframe.attr('src', 'pathology_testprice_groupby_province.html');
    })
  };

  //删除按钮的提示信息
  $('#pathologyTestPriceDeleteBtn').on('click', function () {
    layer.confirm('是否删除' + province + "省级收费表", {
      btn: ['是', '否'],
      closeBtn: 0
    }, function (index) {
      //进行删除操作

      layer.close(index)
    }, function (index) {
      return;
    })
  });

  //监听iframe的加载事件完成
  $iframe.load(function () {
    //设置iframe高度自适应
    pathologyTestPrice.setIframeHeight(this);

    //为iframe中的元素添加监听事件
    $(this).contents().find('.viewTestContentDetail').on('click', function () {
      // $('#testContentDetailModal').modal();
      if (status === 'dynamic') {
        var id = $(this).attr("id");
        pathologyTestPrice.detail(id)
      }  else {
        $('#testContentDetailModal').modal();
      }
    });
  });


});

var PathologyTestPrice = new Function();

PathologyTestPrice.prototype.updateHtml = function (defaultHtml, oldParam, updateParam, renderElement) {
  renderElement.html(defaultHtml.replace(oldParam, updateParam));
};



PathologyTestPrice.prototype.setIframeHeight = function (iframe) {
  if (iframe) {
    var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
    if (iframeWin.document.body) {
      iframe.height = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
    }
  }
};

PathologyTestPrice.prototype.detail = function (id) {
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

PathologyTestPrice.prototype._showEdit = function (msg) {
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