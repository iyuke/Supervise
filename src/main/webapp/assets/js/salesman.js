/**
 * Created by Feddiyao on 2017/5/10.
 */
 $(document).ready(function () {
   var salesman = new Salesman()
   $('#samlesmanSearchBtn').on('click', function () {
     $('#searchModal').modal();
   })
   // 重置用户密码
   $('.resetPasswd').on("click", function () {
     var id = $(this).attr('id');
     salesman.passwordReset(id)
   });

 });

var Salesman = new Function();
Salesman.prototype.passwordReset = function (id) {
  var params = {
    userId: id
  }
  $.ajax({
    type: 'POST',
    url: ctxPath + 'be/user/reset-password',
    data: params,
    dataType: 'JSON',
    success: function (msg) {
      layer.msg("重置默认密码成功！");
    }
  });
}
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

function search(currentPage) {
  $("#search_form input[name='currentPage']").val(currentPage);
  $("#search_form").submit();
};

