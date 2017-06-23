
$(document).ready(function () {
    var testgeneModal = new TestGeneModal();
    testgeneModal.formValidation($('#createForm'));
    testgeneModal.formValidation($('#editForm'));

    multiSelectRender($('#cancers_create'));
    multiSelectRender($('#cancers_edit'));

    //重置验证表单
    $('#createModal').on('hidden.bs.modal', function () {
        $('#createForm').formValidation('resetForm', true);
    });
    $('#editModal').on('hidden.bs.modal', function () {
        $('#editForm').formValidation('resetForm', true);
    });
});

var TestGeneModal = new Function();
TestGeneModal.prototype.formValidation= function ($element) {
    $element.formValidation({
        framework: 'bootstrap',
        excluded: ':disabled',
        locale: 'zh_CN',
        fields: {
            'name': {
                validators: {
                    notEmpty: {}
                }
            },
            'price': {
                validators: {
                    numeric: {
                        message: '请输入有效的数字',
                        transformer: function ($field, validatorName, validator) {
                            var value = $field.val();
                            var verify = /^[0-9]+([.]\d{1,2})?$/;
                            if (!verify.test(value)) {
                                return false;
                            } else {
                                return value.replace(',', '');
                            }
                        }
                    }
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