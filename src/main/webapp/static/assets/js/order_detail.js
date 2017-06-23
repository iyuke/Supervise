/**
 * Created by Feddiyao on 2017/2/17.
 */
var status = $('#page-status').attr('class');
$(document).ready(function () {
  var report = new Report();
  var express = new Express();
  var fee = new Fee(orderNo);
  var attachment = new Attachment();
  var sampleReturnRecord = new SampleReturnRecord();
  var invoice = new Invoice();
  //处理tab页
  if (status === 'static') {
    $('.nothing-info').remove();
    var orderType = getQueryString('type');
    if (orderType === 'consultation') {
      $('.baseInformTab').find('a').attr('href', '#base_info');
      $('#basic_sh_inform').remove();
      $('#basic_gene_inform').remove();
      $('.reportTab')[2].remove();
      $('.reportTab')[0].remove();
    }
    if (orderType === 'pathology') {
      $('.baseInformTab').find('a').attr('href', '#basic_sh_infom');
      $('#basic_gene_inform').remove();
      $('#base_info').remove();
      $('.reportTab')[2].remove();
      $('.reportTab')[1].remove();
    }
    if (orderType === 'gene') {
      $('.baseInformTab').find('a').attr('href', '#basic_gene_inform');
      $('#basic_sh_inform').remove();
      $('#base_info').remove();
      $('.reportTab')[1].remove();
      $('.reportTab')[0].remove();
    }
  }
  // 处理当前活动tab页
  (function () {
    if (activeTab == "") {
      return;
    }
    $("#" + activeTab).trigger("click");
  })();

  // 日历组件
  $('#paymentDate').datepicker({
    format: 'yyyy-mm-dd',
    language: 'zh-CN',
    autoclose: true,
    todayHighlight: true
  }).on('changeDate', function (e) {
    // Revalidate the date field
    $('#financeForm').formValidation('revalidateField', 'paymentDate');
  });

  // 日历组件
  $('#invoiceDate').datepicker({
    format: 'yyyy-mm-dd',
    language: 'zh-CN',
    autoclose: true,
    todayHighlight: true
  }).on('changeDate', function (e) {
    // Revalidate the date field
    $('#invoiceForm').formValidation('revalidateField', 'invoiceDate');
  });

  // 不同财务状态显示不同颜色
  $('.status-label').each(function () {
    fee.setFeeStatusColor(this);
  });

  //设置财务初始状态下input隐藏
  fee.defaultSet();

  //发票创建前端验证
  window.onload = function () {
    invoice.invoiceFormValidation($('#invoiceForm'));
  };

  //发票状态修改备注revalidate
  $('#invoiceStatus').on('change', function () {
    $('#invoiceForm').formValidation('revalidateField', 'remark');
  });

  //初始状态发票取消编辑按钮不显示
  $('.resetInvoiceEdit').hide()

  //编辑发票按钮事件
  $('.editInvoiceStatus').on('click', function () {
    var table = $(this).parent().parent().parent().find('table');
    var td = table.find('td');
    var invoiceInfo = {
      invoiceId: $(this).parent().find("input.invoiceId").val(),
      invoiceNo: td[0].innerHTML,
      invoiceDate: td[1].innerHTML,
      invoiceStatus: td[2].innerHTML,
      remark: td[3].innerHTML
    };
    invoice.invoiceEdit(invoiceInfo);
  });

  //显示编辑检测报告附件Modal
  $('.editUploadReportBtn').on('click', function () {
    report.editReportModalShow(this, 'consultationReport');
  });

  //显示编辑检测报告附件Modal
  $('.editUploadGeneReportBtn').on('click', function () {
    report.editReportModalShow(this, 'geneReport');
  });

  //显示附件Gallery
  $('.gallery').find('img').on('click', function (event) {
    attachment.galleryShow(event, this);
  });

  //删除报告附件
  $('.del-attachment').on('click', function () {
    attachment.deleteAttachment(this, 'reportTab');
  });

  //删除发票附件
  $('.del-attachment-invoice').on('click', function () {
    attachment.deleteAttachment(this, 'invoiceTab');
  });

  //删除附件
  $('.del-attachment-tab').on('click', function () {
    attachment.deleteAttachment(this, 'attachmentTab');
  });

  //异步加载物流信息
  $('#expressTab').on('click', function () {
    express.expressRefresh();
  });
  if ($('#expressTab').parent().attr('class') == 'active') {
    express.expressRefresh();
  }

  //发送报告
  $('.sendReport').on('click', report.sendReport);

  //删除报告
  $('.del-dst-report').on('click', report.deleteReport);

  //删除发票
  $('.del-invoice').on('click', invoice.deleteInvoice);

  //删除物流
  $('.del-express-btn').on('click', function () {
    var a = $(this).parent().parent().find('td')[1].innerText
    express.deleteExpressInfo(a, orderNo)
  });

  //删除样本返还记录button
  $('.sampleReturnBtn').on('click', function () {
    sampleReturnRecord.deleteSampleReturnRecord($(this))
  });

  //退款Modal的展示
  $('#refundUploadBtn').on('click', function () {
    $('#refundModal').modal()
  });

  //补款Modal的展示
  $('#arrearsUploadBtn').on('click', function () {
    $('#arrearsModal').modal('show')
  });

  //确认订单金额结清
  $('#feeClearedBtn').on("click", function () {
    fee.setFeeStatusCleared()
  });

  //展示更多日志
  $('#loadMoreLog').on('click', function () {
    getMoreOrderLog();
  });

  //手风琴效果展示
  accordionsForMoreInform('Status');
  accordionsForMoreInform('Finance');
  accordionsForMoreInform('SampleReturn');


  //点击编辑按钮,数据显示为可编辑
  $('#editFinanceBtn').on('click', function () {
    fee.resetToEdit();
    fee.financeEditFormValidation();

    //取消财务信息的编辑
    $('#resetEdit').on('click', fee.financeEditCancel)
  });

});

var Report = new Function();

//发送报告
Report.prototype.sendReport = function () {
  layer.msg("正在处理信息，请稍后");
  $.ajax({
    method: 'post',
    data: {orderNo: orderNo},
    dataType: 'json',
    url: ctxPath + 'be/order/report/mail',
    success: function (data) {
      //TODO 开启beforeSend的Setup后，可取消code判断，直接对数据进行处理
      if (data.code == '200') {
        layer.msg('邮件已发送！');
      } else {
        layer.msg(data.message);
      }
    }
  })
};

//编辑报告的Modal展示
Report.prototype.editReportModalShow = function (element, reportType) {
  if (ctxPath == 'contextPath') {
    $("editUploadReportModal").modal();
    return;
  }
  $.ajax({
    type: 'post',
    url: ctxPath + 'be/order/report/detail',
    data: {
      reportId: $(element).closest("div").find("input[name='reportId']").val(),
      reportType: $(element).closest("div").find("input[name='reportType']").val()
    },
    dataType: 'json',
    success: function (data) {
      if (reportType === 'geneReport') {
        $('#editUploadGeneReportModal input[name="reportId"]').val(data.id);
        $('#editUploadGeneReportModal input[name="reportIssuedDate"]').val(data.reportIssuedDate);
        $('#editUploadGeneReportModal').modal();
      } else {
        $('#editUploadReportModal input[name="reportId"]').val(data.id);
        $('#editUploadReportModal select[name="orgPathologyNos"]').val(data.pathologyNOs);
        $('#editUploadReportModal select[name="orgPathologyNos"]').multiselect("refresh");
        $('#editUploadReportModal select[name="dstHospitalId"]').val(data.dstHospitalId);
        $('#editUploadReportModal input[name="consultationNo"]').val(data.consultationNo);
        $('#editUploadReportModal input[name="reportIssuedDate"]').val(data.reportIssuedDate);
        $('#editUploadReportModal').modal();
      }
    }
  });
};

//删除报告
Report.prototype.deleteReport = function () {
  var reportId = $(this).closest("div").find("input[name='reportId']").val();
  var reportType = $(this).closest("div").find("input[name='reportType']").val();
  layer.confirm("确认删除报告", {
    btn: ['确认', '取消']
  }, function (index) {
    $.ajax({
      type: 'post',
      url: ctxPath + 'be/order/report/delete',
      data: {
        reportId: reportId,
        reportType: reportType
      },
      dataType: 'json',
      success: function (msg) {
        if (msg.code == "200") {
          layer.msg("操作成功！");
          delayDetailReload(activeTabUrl("reportTab"));
        } else {
          layer.msg(data.message);
        }
      }
    });
  }, function (index) {
    return;
  })
};

var Attachment = new Function();

//删除附件
Attachment.prototype.deleteAttachment = function (element, tabName) {
  var objId = $(element).closest("li").find("input[name='objId']").val();
  var appendixId = $(element).closest("li").find("input[name='appendixId']").val();
  var attachmentType = $(element).closest("li").find("input[name='attachmentType']").val()
  layer.confirm("确认删除附件？", {
    btn: ['确认', '取消'],
    closeBtn: 0
  }, function (index) {
    $.ajax({
      type: 'post',
      url: ctxPath + 'be/order/attachment/delete',
      data: {
        objId: objId,
        appendixId: appendixId,
        attachmentType: attachmentType,
      },
      dataType: 'json',
      success: function (msg) {
        if (msg.code == "200") {
          layer.msg("操作成功！");
          delayDetailReload(activeTabUrl(tabName));
        } else {
          layer.msg(data.message);
        }
      }
    });
    layer.close(index)
  }, function (index) {
    return;
  })
};

//展示附件gallery
Attachment.prototype.galleryShow = function (event, element) {
  event = event || window.event;
  var target = event.target || event.srcElement,
      gallery = target.src ? target.parentNode : target,
      options = {index: gallery, event: event};
  var galleries = $(element).parent().parent().parent().parent().find('a.mailbox-attachment-icon');
  blueimp.Gallery(galleries, options);
};

var SampleReturnRecord = new Function();

//删除样本返还记录
SampleReturnRecord.prototype.deleteSampleReturnRecord = function ($element) {
  var deleteRecordId = $element.attr("recordId");
  layer.confirm("您即将删除选中的物流单号='" + $element.attr("expressNo") + "'的样本返还记录，请确认！", {
    btn: ['确认', '取消'],
    closeBtn: 0
  }, function (index) {
    $.ajax({
      type: 'POST',
      url: ctxPath + 'be/sample/return/delete',
      data: {
        recordId: deleteRecordId
      },
      dataType: 'JSON',
      success: function (msg) {
        if (msg.code == 200) {
          layer.msg("删除成功！");
          delayDetailReload(activeTabUrl("sampleTab"));
          layer.close(index)
        } else {
          layer.msg(msg.message);
        }
      }
    });
  }, function (index) {
    return;
  })
};

var Fee = function (orderNo) {
  this.orderNo = orderNo;
};

//财务编辑状态页面设置
Fee.prototype.resetToEdit = function () {
  $('#financeForm').find('label[class="control-label"]').hide();
  $('#financeForm').find('input').show();
  $('#financeForm').find('div[class="box-footer"]').show();
  $('#financeForm').find('select').show();
  $('#financeForm').find('label[name="refund"]').hide();
  $('#financeForm').find('label[name="arrears"]').hide();
  $('.editFinanceBtn').hide();
  $('.resetEdit').show();
};

//财务信息编辑前端验证
Fee.prototype.financeEditFormValidation = function () {
  var that = this;
  //编辑财务信息的前端验证
  $('#financeForm').formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      'receivablePrice': {
        validators: {
          notEmpty: {},
          numeric: {
            message: '请输入有效的数字'
          }
        }
      },
      'paymentDate': {
        validators: {
          notEmpty: {}
        }
      },
      'paymentType': {
        validators: {
          notEmpty: {}
        }
      },
      'orderPrice': {
        validators: {
          numeric: {
            message: '请输入有效的数字'
          }
        }
      },
      'serviceFee': {
        validators: {
          numeric: {
            message: '请输入有效的数字'
          }
        }
      }
    }
  }).on('success.form.fv', function (e) {
    if (status === 'dynamic') {
      that._commitFee();
    }
  });
};

//编辑订单金额
Fee.prototype._commitFee = function () {
  var options = {
    type: 'post',
    dataType: 'json',
    url: ctxPath + 'be/order/fee/edit',
    beforeSubmit: function (arr, $form, options) {
      $('#financeForm').find('label[class="control-label"]').show();
      $('#financeForm').find('label[name="refund"]').show();
      $('#financeForm').find('label[name="arrears"]').show();
      $('#financeForm').find('input').hide();
      $('#financeForm').find('select').hide();
      $('.editFinanceBtn').show();
      $('.resetEdit').hide();
    },
    success: function (data) {
      if (data.code == '200') {
        layer.msg('操作成功！');
        delayDetailReload(activeTabUrl("feeTab"))
      } else {
        layer.msg(data.message);
      }
    }
  };
  $('#financeForm').ajaxForm(options);
};

//取消财务信息编辑
Fee.prototype.financeEditCancel = function () {
  $('#financeForm').find('label[class="control-label"]').show();
  $('#financeForm').find('label[name="refund"]').show();
  $('#financeForm').find('label[name="arrears"]').show();
  $('#financeForm').find('input').hide();
  $('#financeForm').find('div[class="box-footer"]').hide();
  $('#financeForm').find('select').hide();
  $('.editFinanceBtn').show();
  $('.resetEdit').hide();
};

// 确认费用结清
Fee.prototype.setFeeStatusCleared = function () {
  var that = this;
  layer.confirm("确认费用结清？", {
    btn: ['确认', '取消'],
    closeBtn: 0
  }, function (index) {
    $.ajax({
      type: 'post',
      dataType: 'json',
      data: {
        orderNo: that.orderNo
      },
      url: ctxPath + 'be/order/fee/cleared',
      success: function (data) {
        layer.msg("操作成功！");
        delayDetailReload(activeTabUrl("feeTab"))
      }
    });
  }, function (index) {
    return;
  });
};

//设置财务状态颜色
Fee.prototype.setFeeStatusColor = function (element) {
  var status = $(element).text();
  if (!status.indexOf('已预付') || !status.indexOf('未付款')) {
    $(element).addClass('text-blue');
  } else if (!status.indexOf('需补款') || !status.indexOf('需退款')) {
    $(element).addClass('text-red');
  } else if (!status.indexOf('待结清')) {
    $(element).addClass('text-orange')
  } else {
    $(element).addClass('text-green')
  }
};

//财务初始状态设置
Fee.prototype.defaultSet = function () {
  $('#financeForm').find('input').hide();
  $('#financeForm').find('div[class="box-footer"]').hide();
  $('#financeForm').find('select').hide();
  $('.resetEdit').hide();
};

var Invoice = new Function();

//发票提交的前端验证
Invoice.prototype.invoiceFormValidation = function ($form) {
  $form.formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      'invoiceNo': {
        validators: {
          notEmpty: {},
        }
      },
      'invoiceDate': {
        validators: {
          notEmpty: {}
        }
      },
      'invoiceStatus': {
        validators: {
          notEmpty: {}
        }
      },
      'remark': {
        validators: {
          callback: {
            message: '请输入备注',
            callback: function () {
              var invoiceStatus = $form.find('[name="invoiceStatus"]').val();
              var remark = $form.find('[name="remark"]').val();
              if (invoiceStatus !== '' && invoiceStatus === 'NORMAL') {
                return true;
              } else if (remark !== '') {
                return true;
              } else {
                return false;
              }
            }
          }
        }
      }
    }
  }).on('success.form.fv', function (e) {
    e.preventDefault();
    layer.confirm('您确定要保存吗？', {
      btn: ['确定', '取消']
    }, function () {
      var form = $(this).serializeArray();
      var formData = new FormData(document.getElementById("invoiceForm"));
      formData.append("appendix", $("#appendix")[0].files[0])
      $.ajax({
        type: 'post',
        data: formData,
        dataType: "json",
        processData: false,
        contentType: false,
        url: '/pms/be/invoice/save',
        success: function (resp) {
          if (resp.code == '200') {
            window.location.href = location.protocol + '//' + location.host + location.pathname + "?orderNo="
                + getQueryString("orderNo") + "&activeTab=invoiceTab";
          }
        }
      });
    });

  });
};

//发票编辑的动态效果
Invoice.prototype.invoiceEdit = function (msg) {
  var invoiceForm = document.getElementById("invoiceForm");
  invoiceForm.scrollIntoView();
  setTimeout(function () {
    var $invoiceFormInput = $(invoiceForm).find(".backgroud-color-hint");
    $invoiceFormInput.addClass("invoice-hint");
    setTimeout(function () {
      $invoiceFormInput.removeClass("invoice-hint");
    }, 2000);
  }, 200);
  var that = this;
  $("#editInvoiceId").val(msg.invoiceId);
  $('#invoiceNo').val(msg.invoiceNo);
  $('#invoiceDate').val(msg.invoiceDate);
  if (msg.invoiceStatus === '正常') {
    $('#invoiceStatus').val('NORMAL');
  } else {
    $('#invoiceStatus').val('ABNORMAL');
  }
  $('#remark').val(msg.remark);

  //修改页面创建有关信息
  $('#invoice_btn').val('提交');
  $('#invoice_management h5')[0].innerHTML = '编辑发票';
  $('.resetInvoiceEdit').show();

  //前端验证
  $('#invoiceForm').data('formValidation').resetForm();

  $('#resetInvoiceEdit').on('click', function () {
    that._resetEdit()
  })
};

//取消发票编辑
Invoice.prototype._resetEdit = function () {
  $("#editInvoiceId").val('');
  $('#invoiceNo').val('');
  $('#invoiceDate').val('');
  $('#invoiceStatus').val('NORMAL');
  $('#remark').val('');

  //修改页面编辑有关信息
  $('#invoice_btn').val('添加');
  $('#invoice_management h5')[0].innerHTML = '创建发票';
  $('.resetInvoiceEdit').hide();

  $('#invoiceForm').data('formValidation').resetForm();
};

Invoice.prototype.deleteInvoice = function () {
  var invoiceId = $(this).parent().find("input.invoiceId").val();
  layer.confirm('您确定要删除发票吗？', {
    btn: ['确定', '取消']
  }, function () {
    $.ajax({
      type: 'post',
      url: '/pms/be/invoice/delete',
      data: {
        invoiceId: invoiceId
      },
      dataType: 'json',
      success: function (resp) {
        if (resp.code == '200') {
          window.location.href = location.protocol + '//' + location.host + location.pathname + "?orderNo="
              + getQueryString("orderNo") + "&activeTab=invoiceTab";
        }
      }
    });
  });
}

var Express = new Function();

//物理信息刷新
Express.prototype.expressRefresh = function () {
  var that = this;
  var element = $('tr[name="express"]');
  for (var i = 0; i < element.length; i++) {
    var expressNo = $(element[i]).find('a').html();
    var newest = $(element[i]).find('td[name = "newest-express"]');
    this._expressFetch(expressNo, newest)
  }
};
//读取物流信息
Express.prototype._expressFetch = function (expressNo, newest) {
  $.ajax({
    type: 'get',
    url: ctxPath + 'be/express/fetch',
    data: {
      expressNo: expressNo
    },
    dataType: 'json',
    success: function (data) {
      if (data != null) {
        newest.html('<span class="text-orange">' + data.time + '，' + data.context + '</span>');
      }
    },
    error: function () {
      newest.html("未读取到对应的物流信息")
    }
  });
};

//删除物流信息
Express.prototype.deleteExpressInfo = function (expressNo, orderNo) {
  layer.confirm("确认删除物流信息？", {
    btn: ['确认', '取消'],
    closeBtn: 0
  }, function (index) {
    $.ajax({
      type: 'post',
      url: ctxPath + 'be/express/delete',
      data: {
        expressNo: expressNo,
        orderNo: orderNo
      },
      dataType: 'json',
      success: function (msg) {
        if (msg.code == "200") {
          layer.msg("操作成功！");
          layer.close(index);
          delayDetailReload(activeTabUrl("expressTab"));
        } else {
          layer.msg(data.message);
        }
      }
    });
  }, function (index) {
    return;
  })
};

//手风琴效果
var accordionsForMoreInform = function (informType) {
  //展开更多信息手风琴效果
  $("#more" + informType + "InformBtn").on('click', function () {
    $("tr[name='other" + informType + "']").collapse('show');
    $("tr[name='more" + informType + "Inform']").hide();
  });
  //保证手风琴收缩效果,箭头显示和内容缩起异步
  $("#less" + informType + "InformBtn").on("click", function () {
    otherHide(informShow)
  });
  function otherHide(callback) {
    $("tr[name='other" + informType + "']").collapse('hide');
    setTimeout(function () {
      callback()
    }, 315);
  }

  function informShow() {
    $("tr[name='more" + informType + "Inform']").show()
  }
};

var getMoreOrderLog = function () {
  var currentPage = $("#logCurrentPage").val();
  var pageSize = $("#logPageSize").val();
  var a = $(".timeline")[0];
  var childNodeslength = $(".timeline")[0].childNodes.length;
  var dateLabelHtml = $(".timeline")[0].childNodes[childNodeslength - 4].nodeValue;
  var logHtml = $(".timeline")[0].childNodes[childNodeslength - 2].nodeValue;
  $.ajax({
    type: 'post',
    data: {
      orderNo: orderNo,
      currentPage: currentPage,
      pageSize: pageSize
    },
    dataType: 'json',
    url: ctxPath + 'be/order/log',
    success: function (data) {
      var $li = $("#loadMoreLog");
      if (data.length === 0) {
        layer.msg("日志已全部加载完成");
        $li.hide();
      } else {
        $("#logCurrentPage").val(parseInt(currentPage) + 1);
        var $timeLine = $(".time-label").last();
        var timeLineValue = $timeLine.children().text();
        timeLineValue = timeLineValue.trim();
        var html = '';
        for (var i = 0; i < data.length; i++) {
          var map = data[0];
          for (var key in map) {
            var dateLabel = dateFormat(new Date(key), "isoDate");
            //判断当前分页的日期分组是新建分组还是接在前一分页的日期分组中
            if (dateLabel != timeLineValue) {
              html += dateLabelHtml.replace("dateLabel", dateLabel);
            }
            var array = map[key];
            for (var j = 0, len = array.length; j < len; j++) {
              var log = array[j];
              var createTime = new Date(log.createTime);
              html += logHtml.replace("log.creatorName", log.creatorName).replace("dateFormat(createTime, 'isoTime')",
                  dateFormat(createTime, 'isoTime')).replace("log.action", log.action).replace("log.detail",
                  log.detail);
            }
          }
        }
        $li.before(html);
      }
    }
  });
};