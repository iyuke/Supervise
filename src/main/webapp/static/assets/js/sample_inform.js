/**
 * Created by Alex on 2017/2/24.
 */
$(document).ready(function () {

  // 不同订单状态显示不同颜色
  $('.status-label').each(setStateColor);

  $("#sampleInformExport_btn").on("click", exportSampleInform);

  $("#sampleInformCreate").on("click", createSampleInform);

  $(".sampleInformState_btn").on("click", updateState);

  $("#PaginatorUl").bootstrapPaginator(options);
}); // --------------------------------- document ready function end ---------------------------------

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

};

var createSampleInform = function() {
  var hasSchedule = $(this).attr("hasSchedule");
  if ("true" == hasSchedule) {
    $("#sampleInformModal").modal("show");
  } else {
    layer.msg("您的医院尚未设置收样周期,请联系衡道医学工作人员进行设置");
  }
};

var exportSampleInform = function() {
  $("#downloadForm").submit();
};

var updateState = function () {
  var sampleInformId = $(this).attr('id')
  layer.confirm("确认修改收样状态？", {
    btn:['确认', '取消'],
    closeBtn: 0
  }, function(index){
    $.ajax({
      type:'post',
      url:ctxPath + 'be/sample/inform/update-status',
      data:{
        sampleInformId: sampleInformId,
      },
      dataType:'json',
      success:function(msg){
        if(msg.code == "200"){
          layer.msg("操作成功！");
          layer.close(index);
          location.reload();
        } else {
          layer.msg(data.message);
        }
      }
    })
  }, function (index) {
    return;
  })
};

var search = function (currentPage) {
  $("#search_form input[name='currentPage']").val(currentPage);
  $("#search_form").submit();
};

var setStateColor = function () {
  var status = $(this).text();
  if (status === '报告已上传' || status === '报告已发送' || status === '报告已寄出' || status === '报告已签收') {
    $(this).addClass('label-success');
  } else {
    $(this).addClass('label-primary');
  }
};


