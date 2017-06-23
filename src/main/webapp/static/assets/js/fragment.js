/**
 * Created by Feddiyao on 2017/2/24.
 */
$(document).ready(function () {
  var fragment = new Fragment();
  // 文件上传组件
  $('input[type="file"]').fileinput({
    overwriteInitial: true,
    initialCaption: "请选择要上传的文件",
    showUpload: false
  });

  // 日历组件
  $('.datepicker').datepicker({
    format: 'yyyy-mm-dd',
    language: 'zh-CN',
    autoclose: true,
    todayHighlight: true
  });

  $.ajaxSetup({
    //TODO 后台数据完成封装后，可开启此方法
//    beforeSend: function(xhr, settings) {
//      if('success' in settings && typeof settings.success == 'function') {
//        settings.success = ajaxSuccess(settings.success);
//      }
//    },
    error: function (data, textStatus) {
      if ('undefined' !== typeof data.responseJSON) {
        layer.confirm(data.responseJSON.message, {
          btn: ['确定'],
          closeBtn: 0
        }, function (index) {
          layer.close(index)
        })
      } else {
        HDC.CAlert(data.responseText);
      }
      if (data.responseText.toLowerCase().indexOf("login required") > -1) {
        window.location.href = ctxPath + "be/login";
      }
    }
  });

  //菜单渲染
  var status = $('#page-status').attr('class');
  if (status === 'dynamic') {
    fragment.menuShow();
  }
});

var Fragment = new Function();
Fragment.prototype.menuShow = function () {
  var that = this;
  $.ajax({
    type: 'get',
    dataType: 'json',
    url: ctxPath + 'be/menu',
    success: function (msg) {
      if (msg.error == null) {
        that._showTreeMenu(msg);
        $("#tree-menu").on("click", "a", function () {
          var href = this.getAttribute("href");
          var links = $("div#疑难病理会诊系统 a");
          for (var j = 0; j < links.length; j++) {
            var url = links[j].getAttribute("href");
            if (href.indexOf(url) != -1) {
              if (href != "#") {
                var pn = links[j].parentNode;
                pn.setAttribute("class", "active")
                var pp = pn.parentNode;
                if (pp.getAttribute("class").indexOf("treeview-menu") > -1) {
                  var treeNode = pp.parentNode;
                  treeNode.setAttribute("class", "treeview active");
                }
              } else {
                var ul = $(links[j]).next();
                if (ul.is(".treeview-menu") && ul.is(":visible")) {
                  ul.slideUp(200);
                  ul.parent().removeClass("active");
                }
              }
            } else if (url != "#") {
              var pp = links[j].parentNode;
              pp.removeAttribute("class");
            }
          }
          var ul = $(this).next();
          if (ul.is(".treeview-menu") && !ul.is(":visible")) {
            ul.slideDown(200);
            ul.parent().addClass("active");
          } else {
            ul.slideUp(200);
            ul.parent().removeClass("active");
          }
        });
      }
    }
  });
};

/**
 * Show Tree Menu
 */
Fragment.prototype._showTreeMenu = function (menus) {
  var level1Arr = new Array();
  var level1Index = 0;
  var level2Arr = new Array();
  var level2Index = 0;
  var level3Arr = new Array();
  var level3Index = 0;
  for (var index in menus) {
    var menu = menus[index];
    if (menu.level == "1") {
      level1Arr[level1Index++] = menu;
    } else if (menu.level == "2") {
      level2Arr[level2Index++] = menu;
    } else if (menu.level == "3") {
      level3Arr[level3Index++] = menu;
    }
  }

  var html = "";
  for (var i = 0; i < level1Index; i++) {
    var parentName = level1Arr[i].name;
    for (var j = 0; j < level2Index; j++) {
      var pName = level2Arr[j].parentName;
      var name = level2Arr[j].name;
      var hasChild = false;
      if (pName == parentName) {
        var htmlChild = "";
        for (var k = 0; k < level3Index; k++) {
          var childName = level3Arr[k].parentName;
          if (childName == name) {
            hasChild = true;
            htmlChild += '<li><a href="' + ctxPath + level3Arr[k].href + '">' + level3Arr[k].name + '</a></li>';
          }
        }
        if (hasChild) {
          html += '<li class="treeview">' +
              '<a href="' + level2Arr[j].href + '"><span>' + level2Arr[j].name + '</span> <i class="fa fa-angle-left pull-right"></i></a>' +
              '<ul class="treeview-menu">' +
              htmlChild + '</ul></li>';
        } else {
          html += '<li><a href="' + ctxPath + level2Arr[j].href + '"><span>' + level2Arr[j].name + '</span></a></li>';
        }
      }
    }
    $('.sidebar-menu').append(html);
    if (i == 0) {
      $("#" + parentName + "").show();
    } else {
      $("#" + parentName + "").hide();
    }
  }
  this._setMenuActive();
}

/**
 * Set Menu Active
 */
Fragment.prototype._setMenuActive = function () {
  var currentUrl;
  if (window.currentUrlSet) {
    currentUrl = currentUrlSet;
  } else {
    currentUrl = window.location.href;
  }
  if (currentUrl.charAt(currentUrl.length - 1) == "#") {
    currentUrl = currentUrl.substring(0, currentUrl.length - 1);
  }
  var sidebars = $("#tree-menu ul.sidebar-menu");
  for (var i = 0; i < sidebars.length; i++) {
    var links = sidebars[i].getElementsByTagName("a");
    for (var j = 0; j < links.length; j++) {
      var url = links[j].getAttribute("href");
      if (currentUrl.indexOf(url) != -1) {
        var pn = links[j].parentNode;
        pn.setAttribute("class", "active")
        var pp = pn.parentNode;
        if (pp.getAttribute("class").indexOf("treeview-menu") > -1) {
          var treeNode = pp.parentNode;
          treeNode.setAttribute("class", "treeview active");
        }
      } else if (url != "#") {
        var pp = links[j].parentNode;
        pp.removeAttribute("class");
      }
    }
  }
}