/**
 * Created by Feddiyao on 2017/4/24.
 */
$(document).ready(function () {
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
})