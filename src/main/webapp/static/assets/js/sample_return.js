/**
 * Created by Alex on 2017/2/22.
 */
$(document).ready(function ()  {
  dateRangePickerSet('.daterange')

  $('#searchBtn').on('click', function(){
    $('#searchModal').modal('show');
  });
  $('#importBtn').on('click', function() {
    $('#uploadModal').modal('show');
  });
  $('#exportTemplateBtn').on('click', function() {
    $('#excelTemplateDownloadModal').modal('show');
  });

  $(".delete_btn").on("click", deleteRecord);

  $("#exportSampleReturnList").on("click", exportList);

  $("#PaginatorUl").bootstrapPaginator(options);
});

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

var deleteRecord = function() {
  var deleteRecordId = $(this).attr("recordId");
  layer.confirm("您即将删除订单号='" + $(this).attr("orderNo") + "'的样本返还记录，请确认！", {
    btn: ['确认', '取消'],
    closeBtn: 0
  },function (index) {
    var params = {
      recordId: deleteRecordId
    }
    $.ajax({
      type: 'POST',
      url: ctxPath + 'be/sample/return/delete',
      data: params,
      dataType: 'JSON',
      success: function (msg) {
        if (msg.code == 200) {
          layer.close(index)
          location.reload();
        }else{
          layer.msg(msg.message);
        }
      }
    });
  }, function(index) {
    return;
  })
}

var exportList = function() {
  $("#downloadForm").submit();
}

var search = function(currentPage) {
  $("#search_form input[name='currentPage']").val(currentPage);
  $("#search_form").submit();
};

