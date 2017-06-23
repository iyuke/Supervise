/**
 * Created by Feddiyao on 2017/2/9.
 */
$(document).ready(function () {
  var order = new Order();
  $('#orderExportBtn').on('click', order.exportOrder);
  $('#orderSearchBtn').on('click', function () {
    $('#searchModal').modal('show');
  });
  // 不同订单状态显示不同颜色
  $('.status-label').each(order.orderStatusSet);
  //分页
  var options = {
    bootstrapMajorVersion:3,
    alignment:"right",//居右显示
    currentPage: currentPage,//当前页面
    pageSize: pageSize,
    numberOfPages: 5,//一页显示几个按钮（在ul里面生成5个li）
    totalPages:totalPages, //总页数
    pageUrl: function(type, page, current){
      if (page==current) {
        return "javascript:void(0)";
      } else {
        return 'javascript:search(' +page+ ')';
      }
    }

  }
  $("#PaginatorUl").bootstrapPaginator(options);
}); // --------------------------------- document ready function end ---------------------------------

var Order = new Function();
// 导出订单列表
Order.prototype.exportOrder = function () {
  $("#exportConditionsForm").submit();
};

function search(currentPage) {
  $("#search_form input[name='currentPage']").val(currentPage);
  $("#search_form").submit();
};

Order.prototype.orderStatusSet = function () {
  var status = $(this).text();
  var reportStatus = $(this).attr('data-reportStatus');
  // 报告出具后的状态显示绿色
  if (status === '报告已上传' || status === '报告已发送' || status === '报告已寄出' || status === '报告已签收') {
    $(this).addClass('label-success');
  } else {
    // 报告未出，则判断是否有超期预警，有，则显示黄色或共色
    if (reportStatus === 'WARNING') {
      $(this).addClass('label-warning');
    } else if (reportStatus === 'EXPIRED') {
      $(this).addClass('label-danger');
    } else {
      $(this).addClass('label-primary');
    }
  }
}
