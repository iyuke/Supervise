/**
 * Created by Felixzuo on 2017/5/14.
 */
$(document).ready(function() {
  var supplier = new Supplier();

  var btn = {
    statusBtn:$('.cooperationState'),
    searchBtn:$('#supplierSearchBtn')
  };
  supplier.setSupplierStatusColor(btn.statusBtn);

  $('.deleteBtn').on('click', function () {
    supplier.deleteRecord(this);
  });

  btn.searchBtn.on('click', function() {
    $('#searchModal').modal();
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
        return 'javascript:search(' + page + ')';
      }
    }

  }
  $("#PaginatorUl").bootstrapPaginator(options);
});

var Supplier = new Function();
Supplier.prototype.setSupplierStatusColor = function($elements) {
    $elements.each(function() {
    var status = $(this).text();
    if (status === '合作中') {
      $(this).addClass('label-success');
    } else if (status === '已终止') {
      $(this).addClass('label-warning');
    }
  });
}

function search(currentPage) {
  $("#search_form #currentPage").val(currentPage);
  $("#search_form").submit();
}

//删除supplier
Supplier.prototype.deleteRecord = function(element) {
  var id = $(element).attr("id");
  var name = $(element).val();
  layer.confirm("您即将删除机构名称='" + name + "'的机构管理记录，请确认！", {
    btn: ['确认', '取消'],
    closeBtn: 0
  },function (index) {
    var params = {
      recordId: id
    }
    $.ajax({
      type: 'POST',
      url: ctxPath + 'be/organization/delete',
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

