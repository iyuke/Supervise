
$(document).ready(function () {
    var testItemModal = new TestItemModal();
    testItemModal.formValidation($('#createForm'));
    testItemModal.formValidation($('#editForm'));

    //重置验证表单
    $('#createModal').on('hidden.bs.modal', function () {
        $('#createForm').formValidation('resetForm', true);
    });
    $('#editModal').on('hidden.bs.modal', function () {
        $('#editForm').formValidation('resetForm', true);
    });
    $("input[name='allOption']").click(function () {
        var checkStatus = this.checked;
        var elements = $("input[name='testGeneIds']");
        setChecked(elements, checkStatus);
    })

    $("input[name='testGeneIds']").click(function () {
        var elements = $("input[name='testGeneIds']");
        var allOption = $("input[name='allOption']");
        setAllOption(elements, allOption, $(this).prop('checked'))
    })
});
function setChecked(elements, status) {
    for (var i = 0; i < elements.length; i++) {
        elements[i].checked = status;
    }
    $("#editTestItem").formValidation('revalidateField', "testGeneIds");
}
// 设置全选/非全选
function setAllOption(elements, allOption, checkStatus) {
    if (checkStatus) {
        var isAllSelected = true;
        for (var i = 0; i < elements.length; i++) {
            if (!elements[i].checked) {
                isAllSelected = false;
                break;
            }
        }
        allOption.prop('checked', isAllSelected);
    } else {
        allOption.prop('checked', false);
    }
}
var TestItemModal = new Function();
TestItemModal.prototype.formValidation= function ($element) {
    $element.formValidation({
        framework: 'bootstrap',
        excluded: ':disabled',
        locale: 'zh_CN',
        fields: {
            'name':{
                validators:{
                    notEmpty:{}
                }
            },
            'testType': {
                validators:{
                    notEmpty:{}
                }
            },
            'testGeneIds': {
                validators:{
                    notEmpty:{}
                }
            }
        }
    }).on('success.form.fv', function (e) {
        var options = {
            dataType: 'json',
            success: function (data) {
                if (data.code == '200') {
                    location.reload();
                }
            },
        };
        $element.ajaxForm(options);
    });
}