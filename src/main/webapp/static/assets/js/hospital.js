var status = $('#page-status').attr('class');
$(document).ready(function () {
  var hospital = new Hospital();

  var btn = {
    statusBtn: $('.cooperationState'),
    searchBtn: $('#hospitalSearchBtn'),
    departmentViewBtn: $('.departmentView'),
    departmentAddBtn: $('.departmentAdd'),
    cooperationInfoAddBtn: $('.cooperationInfoAdd'),
    detailView: $('.detailView')
  };

  btn.statusBtn.each(hospital.setHospitalStatusColor);

  btn.searchBtn.on('click', function () {
    $('#searchModal').modal();
  });

  btn.cooperationInfoAddBtn.on('click', function () {
    window.location.href = 'hospital_detail.html?edit=cooperation';
  });

  btn.detailView.on('click', function () {
    window.location.href = 'hospital_detail.html';
  });

  btn.departmentViewBtn.on('click', function () {
    var departmentInfoHtml = $(this).parents("tr").find(".departments").html();
    $("#department_detail").html(departmentInfoHtml);
    $('#departmentDetailModal').modal();
  });

  btn.departmentAddBtn.on('click', function () {
    var parentId = $(this).attr("id");
    $("#parent_id").val(parentId);
    $('#createDepartmentModal').modal();
  });

  $('.deleteBtn').on('click', function () {
    hospital.deleteRecord(this);
  });

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

});
var Hospital = new Function();

Hospital.prototype.setHospitalStatusColor = function () {
  var status = $(this).text();
  if (status === '已拜访') {
    $(this).addClass('label-primary');
  } else if (status === '未签约有合作') {
    $(this).addClass('label-transition')
  } else {
    $(this).addClass('label-success')
  }
};

function search(currentPage) {
  $("#search_form #currentPage").val(currentPage);
  $("#search_form").submit();
};

//删除Hospital
Hospital.prototype.deleteRecord = function(element) {
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

