/**
 * Created by Feddiyao on 2017/5/22.
 */
$form = $('#createForm');
$(document).ready(function () {
  var pre_order = new Pre_order();
  $('#sampleDate').datepicker({
    format: 'yyyy-mm-dd',
    language: 'zh-CN',
    autoclose: true,
    todayHighlight: true
  });

  var $element = {
    expressTypeSelector : $('#expressType'),
    paymentTypeSelector : $('#paymentType'),
    expressNoInput: $('.expressNo'),
    paymentTypeInput : $('.paymentType'),
    discountReasonInput : $('.discountReason'),
    discountSelector : $('.discount')
  };

  //配置微信转发等各项功能的基本参数
  // pre_order.wxConfig();

  //图片添加和gallery展示
  var $gallery = $("#gallery"), $galleryImg = $("#galleryImg"),
      $uploaderInput = $(".uploaderInput:last"),
      $uploaderFiles = $("#uploaderFiles");

  pre_order.uploadFile($uploaderInput, $uploaderFiles, $gallery, $galleryImg);

  //底端bar的选中样式变化
  $('.weui-navbar__item').on('click', function () {
    $(this).addClass('weui-bar__item_on').siblings('.weui-bar__item_on').removeClass('weui-bar__item_on');
  });

  //表单验证
  pre_order.pre_formValidation($form);

  $element.expressTypeSelector.on('change', function () {
    $form.formValidation('revalidateField', 'expressNo');
    if ($(this).val() !== 'OTHERS') {
      $element.expressNoInput.show();
    } else {
      $element.expressNoInput.hide();
    }
  });

  $element.paymentTypeSelector.on('change', function () {
    $form.formValidation('revalidateField', 'receivablePrice');
    $form.formValidation('revalidateField', 'discountReason');
    if ($(this).val() === 'MONTHLY') {
      $element.paymentTypeInput.hide();
    } else {
      $element.paymentTypeInput.show();
    }
  })

  $element.discountSelector.change(function () {
    $form.formValidation('revalidateField', 'discountReason');
    var hasDiscount = $('.discount:checked').val();
    if (hasDiscount === 'true') {
      $element.discountReasonInput.show();
    } else {
      $element.discountReasonInput.hide();
    }
  });
});

var Pre_order = new Function();

Pre_order.prototype.wxConfig = function () {
  wx.config({
    appId: 'wx3d217570b080c004',
    timestamp: sign.timestamp,
    nonceStr: sign.nonceStr,
    signature: sign.signature,
    jsApiList: [
      // 所有要调用的 API 都要加到这个列表中
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'scanQRCode',
      'chooseImage',
      'uploadImage'
    ]
  });


  var shareTitle = '快速录单';
  var shareDesc = '衡道医学快速录单';
  var shareLink = 'http://www.itisnull.com/pages/pms2/src/main/resources/templates/mini/pre_order.html';
  var imageUrl = 'http://www.itisnull.com/pages/zb/env.jpg';

  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，
  // 所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
  wx.ready(function(){

    // 分享到朋友圈
    wx.onMenuShareTimeline({
      title: shareTitle, // 分享标题
      link: shareLink, // 分享链接
      imgUrl: imageUrl, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });

    // 分享给朋友
    wx.onMenuShareAppMessage({
      title: shareTitle, // 分享标题
      desc: shareDesc, // 分享描述
      link: shareLink, // 分享链接
      imgUrl: imageUrl, // 分享图标
      type: 'link', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function () {
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });

    wx.onMenuShareQQ({
      title: shareTitle, // 分享标题
      desc: shareDesc, // 分享描述
      link: shareLink, // 分享链接
      imgUrl: imageUrl, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });

    //扫码
    document.querySelector('#barcodeGet').onclick = function() {
      wx.scanQRCode({

        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          $('#barcode').val(result.split(',')[1]);
        }
      });
    };

    document.querySelector('#hospitalIdGet').onclick = function() {
      wx.scanQRCode({

        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          $('#hospitalId').val(result.split(',')[1]);
        }
      });
    };

    document.querySelector('#expressNoGet').onclick = function() {
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
          var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
          $('#expressNo').val(result.split(',')[1]);
        }
      });
    };
  });
};

Pre_order.prototype.uploadFile = function ($uploaderInput, $uploaderFiles, $gallery, $galleryImg) {
  var that = this;
  var tmpl = '<li class="weui-uploader__file %uploaderInput%" style="background-image:url(%url%)"></li>';
  $uploaderInput.on("change", function(e){
    var inputId = $(this).attr('inputId');
    var id = inputId.split('_')[1];
    $clone = $(this)
        .clone().appendTo('.weui-uploader__input-box .form-group')
        .removeAttr('inputId')
        .insertAfter($(this));
    $('.uploaderInput:last').attr('inputId', 'uploaderInput_' + Number(Number(id) + Number(1)));
    var src, url = window.URL || window.webkitURL || window.mozURL, files = e.target.files;
    for (var i = 0, len = files.length; i < len; ++i) {
      var file = files[i];

      if (url) {
        src = url.createObjectURL(file);
      } else {
        src = e.target.result;
      }

      $uploaderFiles.append($(tmpl.replace('%url%', src).replace('%uploaderInput%', inputId)));
    }
    $(this).hide();

    var $uploaderInput = $(".uploaderInput:last");
    that.uploadFile($uploaderInput, $uploaderFiles, $gallery, $galleryImg);
  });

  $uploaderFiles.on("click", "li", function(){
    var that = this;
    $galleryImg.attr("style", this.getAttribute("style"));
    $gallery.fadeIn(100);
    $('.navbar-fixed-bottom').hide();
    $('.weui-icon_gallery-delete').on('click', function () {
      $('.uploaderInput').each(function () {
        if ($(that).attr('class').split('_')[3] == $(this).attr('inputId').split('_')[1]) {
          $(this).remove();
        }
      });
      $(that).remove();
    })
  });
  $gallery.on("click", function(){
    $gallery.fadeOut(100);
    $('.navbar-fixed-bottom').show();
  });
};

Pre_order.prototype.pre_formValidation = function ($form) {
  $form.formValidation({
    framework: 'bootstrap',
    excluded: ':disabled',
    locale: 'zh_CN',
    fields: {
      'barcode': {
        validators: {
          notEmpty: {},
        }
      },
      'hospitalId': {
        validators: {
          notEmpty: {}
        }
      },
      'patient.name': {
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
          notEmpty: {}
        }
      },
      'testType': {
        validators: {
          notEmpty: {}
        }
      },
      'sampleType': {
        validators: {
          notEmpty: {}
        }
      },
      'sampleNum': {
        validators: {
          notEmpty: {}
        }
      },
      'expressType': {
        validators: {
          notEmpty: {}
        }
      },
      'expressNo': {
        validators: {
          callback: {
            message: '请输入物流单号',
            callback: function () {
              var expressType = $('#expressType').val();
              if (expressType !== 'OTHERS' && $('#expressNo').val() === '') {
                return false;
              } else {
                return true;
              }
            }
          }
        }
      },
      'paymentType': {
        validators: {
          notEmpty: {}
        }
      },
      'receivablePrice': {
        validators: {
          callback: {
            message: '请输入支付金额',
            callback: function () {
              var paymentType = $('#paymentType').val();
              return paymentType !== 'MONTHLY' && $('#expressNo').val() === '' ? 'false' : 'true';
            }
          }
        }
      },
      'discountReason': {
        validators: {
          callback: {
            message: '请输入折扣原因',
            callback: function () {
              var hasDiscount = $('.discount:checked').val();
              var paymentType = $('#paymentType').val();
              return hasDiscount === 'true' && $('#discountReason').val() === '' && paymentType !== 'MONTHLY' ? 'false' : 'true';
            }
          }
        }
      },
    }
  })
    .on('click', '#sample-add', function () {
      var $template = $('.sample:last');
      $clone = $template
          .clone().appendTo('.sampleInfo')
          .removeClass('hide')
          .removeClass('no-margin')
          .insertAfter($template);
      $option = $clone.find('[name="sampleType"]');
      $form.formValidation('addField', $option);
      $option = $clone.find('[name="sampleNum"]');
      $form.formValidation('addField', $option);
      $option = $clone.find('[name="sampleDate"]');
      $form.formValidation('addField', $option);
      $option = $clone.find('[name="sampleNo"]');
      $form.formValidation('addField', $option);
      $clone.find('[name="sampleDate"]').datepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        autoclose: true,
        todayHighlight: true
      })
      $('.sample:last').find('[name="sampleType"]').val('');
      $('.sample:last').find('[name="sampleNum"]').val('');
      $('.sample:last').find('[name="sampleDate"]').val('');
      $('.sample:last').find('[name="sampleNo"]').val('');
    })
    .on('success.form.fv', function (e) {
      // Prevent form submission
      e.preventDefault();
      //提交后按钮不能再次点击
      $('input[type="submit"]').prop('disabled', true);
      if ($('#uploaderFiles')[0].innerHTML !== '') {
        // You can get the form instance
        var $form = $(e.target);
        // and the FormValidation instance
        var fv = $form.data('formValidation');
        // Use the defaultSubmit() method if you want to submit the form
        // See http://formvalidation.io/api/#default-submit
        fv.defaultSubmit();
      } else {
        alert('尚未上传图片');
      }
    })
};