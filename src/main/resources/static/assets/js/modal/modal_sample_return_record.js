/**
 * Created by Feddiyao on 2017/2/17.
 */
$(document).ready(function () {
  var sampleReturnRecordModal = new SampleReturnRecordModal();
  //Modal显示消失的时候重置验证表单
  $('#sampleReturnModal').on('hidden.bs.modal', function () {
    $('#sampleReturnModal #expressNo').val("")
  });
  //样本返还记录的上传前端验证
  sampleReturnRecordModal.sampleReturnFormValidation($('#orderType').val());
});

var SampleReturnRecordModal = new Function();

//样本返还记录上传前端验证
SampleReturnRecordModal.prototype.sampleReturnFormValidation = function(orderType) {
  $('#sampleReturnForm').formValidation({
        framework: 'bootstrap',
        excluded: ':disabled',
        locale: 'zh_CN',
        fields: {
          'sampleReturnRecord.expressNo': {
            validators: {
              notEmpty: {}
            }
          },
          'sampleReturnRecord.pathologyNo': {
            validators: {
              notEmpty: {}
            }
          },
          'total': {
            excluded: false,
            validators: {
              notEmpty: {
                message: '样本返还信息至少需填写一个'
              }
            }
          },
          'sampleReturnRecord.paraffinNum': {
            validators: {
              numeric: {
                message: '请输入有效的数字'
              }
            }
          },
          'sampleReturnRecord.heNum': {
            validators: {
              numeric: {
                message: '请输入有效的数字'
              }
            }
          },
          'sampleReturnRecord.ihcNum': {
            validators: {
              numeric: {
                message: '请输入有效的数字'
              }
            }
          },
          'sampleReturnRecord.orgHospReportNum': {
            validators: {
              numeric: {
                message: '请输入有效的数字'
              }
            }
          },
          'sampleReturnRecord.medicalHistoryNum': {
            validators: {
              numeric: {
                message: '请输入有效的数字'
              }
            }
          },
          'sampleReturnRecord.receiptNum': {
            validators: {
              numeric: {
                message: '请输入有效的数字'
              }
            }
          },
          'sampleReturnRecord.geneReportNum': {
            validators: {
              numeric: {
                message: '请输入有效的数字'
              }
            }
          },
          'sampleReturnRecord.consultationReportNum': {
            validators: {
              numeric: {
                message: '请输入有效的数字'
              }
            }
          }
        }
      })
      .on('success.form.fv', function (e) {
        var options={
          dataType: 'json',
          success: function (data) {
            if (data.code == '200') {
              layer.msg("上传成功！");
              delayDetailReload(activeTabUrl("sampleTab"));
            } else {
              layer.msg(data.message);
            }
          }
        };
        $('#sampleReturnForm').ajaxForm(options);
      })
      .on('keyup', 'input[name="sampleReturnRecord.paraffinNum"], input[name="sampleReturnRecord.heNum"], ' +
          'input[name="sampleReturnRecord.ihcNum"], input[name="sampleReturnRecord.orgHospReportNum"],' +
          'input[name="sampleReturnRecord.medicalHistoryNum"], input[name="sampleReturnRecord.receiptNum"],' +
          'input[name="sampleReturnRecord.otherMaterials"], input[name="sampleReturnRecord.remark"],' +
          'input[name="sampleReturnRecord.geneReportNum"], input[name="sampleReturnRecord.consultationReportNum"]',
          function(e) {
            // Set the total field value
            if ($('#sampleReturnForm').find('[name="sampleReturnRecord.paraffinNum"]').val() == "" &&
                $('#sampleReturnForm').find('[name="sampleReturnRecord.heNum"]').val() == "" &&
                $('#sampleReturnForm').find('[name="sampleReturnRecord.ihcNum"]').val() == "" &&
                $('#sampleReturnForm').find('[name="sampleReturnRecord.orgHospReportNum"]').val() == "" &&
                $('#sampleReturnForm').find('[name="sampleReturnRecord.medicalHistoryNum"]').val() == "" &&
                $('#sampleReturnForm').find('[name="sampleReturnRecord.receiptNum"]').val() == "" &&
                $('#sampleReturnForm').find('[name="sampleReturnRecord.otherMaterials"]').val() == "" &&
                $('#sampleReturnForm').find('[name="sampleReturnRecord.remark"]').val() == ""
            ) {
              if ($('#sampleReturnForm').find('[name="sampleReturnRecord.geneReportNum"]').val() == "" ||
                  $('#sampleReturnForm').find('[name="sampleReturnRecord.consultationReportNum"]').val() == "") {
                $('#sampleReturnForm').find('[name="total"]').val('');
              } else {
                $('#sampleReturnForm').find('[name="total"]').val('true');
              }
            } else {
              $('#sampleReturnForm').find('[name="total"]').val('true');
            }
            // Revalidate it
            $('#sampleReturnForm').formValidation('revalidateField', 'total');
          });
  if (orderType == 'GENE') {
    $('#sampleReturnForm').data('formValidation').enableFieldValidators('sampleReturnRecord.pathologyNo', false)
  }
};