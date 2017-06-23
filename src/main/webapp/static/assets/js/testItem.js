$(document).ready(function () {
    var testItem = new TestItem();
    var status = $('#page-status').attr('class')

    $('#testItemCreateBtn').on('click', function () {
        $('#createModal').modal('show');
    });
    $('.testItemSearch').on('click', function () {
        $("#testType_search").val($(this).attr("value"));
        $("#search_form").submit();
    });
    // 显示编辑检测项目信息框，并填充 检测项目信息
    $('.edit_btn').on('click', function () {
        if (status === 'dynamic') {
            var testItemId = $(this).attr('id');
            testItem.detailShow(testItemId);
        }  else {
            $('#editModal').modal('show');
        }
    });
    $(".delete_btn").on("click", function(){
        var id = $(this).attr("id");
        layer.confirm("您即将删除检测项目'" + $(this).attr("testItemName") + "'，请确认！", {
            btn:['确认', '取消'],
            closeBtn: 0
        }, function(index) {
            var params = {
                id: id
            }
            $.ajax({
                type: 'POST',
                url: ctxPath +'be/test-item/delete',
                data: params,
                dataType: 'JSON',
                success: function (msg) {
                    if (msg.code == 200) {
                        location.reload();
                    }else{
                        layer.msg(msg.message);
                    }
                }
            });
        }, function (index) {
            return;
        })
    });
});
var TestItem = new Function();
TestItem.prototype.detailShow = function(testItemId) {
    var params = {
        id: testItemId
    };
    var that = this;
    $.ajax({
        type: 'get',
        url: ctxPath + 'be/test-item/edit',
        data: params,
        dataType: 'json',
        success: function (msg) {
            if (msg.error == null) {
                that._showEdit(msg);
            }
        },
        error: function (msg) {
            alert("error");
        }
    });
};
// 设置编辑 检测项目信息各字段的值
TestItem.prototype._showEdit = function (testItem) {
    $(" #id_edit").val(testItem.id);
    $(" #name_edit").val(testItem.name);
    $(" #testType_edit").val(testItem.testType);

    var checkboxes = $("#editModal input[name='testGeneIds']");
    for (var i = 0; i < testItem.testGeneIds.length; i++) {
        for (var j = 0; j < checkboxes.length; j++) {
            if (checkboxes[j].getAttribute("value") == testItem.testGeneIds[i]) {
                checkboxes[j].checked = true;
                break;
            }
        }
    }
    checkSelectAll();

    $('#editModal').modal('show');

};
//根据已加载的检测内容设置全选框是否为选中
function checkSelectAll() {
    var checkboxes = $("#editModal input[name='testGeneIds']");
    var isAllSelected = true;
    for (var i = 0; i < checkboxes.length; i++) {
        if (!checkboxes[i].checked) {
            isAllSelected = false;
        }
    }
    //轮询结束后，给最后一个tab项的全选框设值
    $("#editModal input[name='allOption']")[0].checked = isAllSelected;
}
function search(currentPage) {
    $("#search_form input[name='currentPage']").val(currentPage);
    $("#search_form").submit();
};

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
            return 'javascript:search(' +page+ ')';
        }
    }
}
$("#PaginatorUl").bootstrapPaginator(options);