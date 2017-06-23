$(document).ready(function () {
    var testGene = new TestGene();
    var status = $('#page-status').attr('class')

    $('#testGeneSearchBtn').on('click', function () {
        $('#searchModal').modal('show');
    });
    $('#testGeneCreateBtn').on('click', function () {
        $('#createModal').modal('show');
    });
    // 显示编辑 检测内容信息框，并填充 检测内容信息
    $('.edit_btn').on('click', function () {
        if (status === 'dynamic') {
            var testGeneId = $(this).attr('id');
            testGene.detailShow(testGeneId);
        }  else {
            $('#editModal').modal('show');
        }
    });
    $(".delete_btn").on("click", function(){
        var id = $(this).attr("id");
        layer.confirm("您即将删除检测内容'" + $(this).attr("testGeneName") + "'，请确认！", {
            btn:['确认', '取消'],
            closeBtn: 0
        }, function(index) {
            var params = {
                id: id
            }
            $.ajax({
                type: 'POST',
                url: ctxPath +'be/test-gene/delete',
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
var TestGene = new Function();
TestGene.prototype.detailShow = function(testGeneId) {
    var params = {
        id: testGeneId
    };
    var that = this;
    $.ajax({
        type: 'get',
        url: ctxPath + 'be/test-gene/edit',
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
// 设置编辑 检测内容信息各字段的值
TestGene.prototype._showEdit = function (testGene) {
    $(" #id_edit").val(testGene.id);
    $(" #name_edit").val(testGene.name);
    $(" #price_edit").val(testGene.price);
    $(" #sampleRequirement_edit").val(testGene.sampleRequirement);
    $(" #experimentalMethod_edit").val(testGene.experimentalMethod);
    $(" #reportTime_edit").val(testGene.reportTime);
    $(" #description_edit").val(testGene.description);
    $('#cancers_edit').multiselect('deselectAll', false);
    for (var i = 0; i < testGene.cancers.length; i++) {
      $('#cancers_edit').multiselect('select', testGene.cancers[i]);
    }

    $('#editModal').modal('show');

};

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