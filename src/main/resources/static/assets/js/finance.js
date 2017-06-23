$(document).ready(function () {
    var finance = new Finance();
    // 导出订单列表
    $('#financeExportBtn').on('click', finance.exportOrder);

    // 不同订单财务状态显示不同颜色
    $('.status-label').each(function () {
        var status = $(this).text();
        if (status === '已预付'||status === '未付款') {
            $(this).addClass('label-primary');
        } else if (status.indexOf('需补款')!=-1 || status.indexOf('需退款')!=-1) {
            $(this).addClass('label-danger');
        } else if (status.indexOf('待结清')!=-1) {
            $(this).addClass('label-orange');
        } else {
            $(this).addClass('label-success');
        }
    });

    //日期区间选择器格式设计
    dateRangePickerSet($('.daterange'));

    $('#financeSearchBtn').on('click', function () {
        $('#searchModal').modal('show');
    });

});

var Finance = new Function();
// 导出订单列表
Finance.prototype.exportOrder = function () {
    $("#exportConditionsForm").submit();
};
function search(currentPage) {
    $("#search_form input[name='currentPage']").val(currentPage);
    $("#search_form").submit();
};
//分页
var options = {
    bootstrapMajorVersion: 3,
    alignment: "right",//居右显示
    currentPage: currentPage,//当前页面
    pageSize: pageSize,
    numberOfPages: 5,//一页显示几个按钮（在ul里面生成5个li）
    totalPages: totalPages, //总页数
    pageUrl: function (type, page, current) {
        if (page == current) {
            return "javascript:void(0)";
        } else {
            return 'javascript:search(' + page + ')';
        }
    }

}
$("#PaginatorUl").bootstrapPaginator(options);
