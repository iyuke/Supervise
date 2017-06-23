/**
 * Created by Feddiyao on 2017/2/15.
 */
var $form = $('#dstHospitalIds').closest('form');
$(document).ready(function () {
  // 日历组件
  $('.datepicker').datepicker({
    format: 'yyyy-mm-dd',
    language: 'zh-CN',
    autoclose: true,
    todayHighlight: true
  }).on('changeDate', function (e) {
    // Revalidate the date field
    $form.formValidation('revalidateField', 'application.applicationDate');
    $form.formValidation('revalidateField', 'order.paymentDate');
  });

  //多选框组件
  multiSelectRender($('#dstHospitalIds'));

  //绑定医院和医生的级联
  var $categoriesLvlOne = $("#orgHospitalId");
  var $categoriesLvlTwo = $("#doctorId");
  var $receiverId = $("#reportReceiverId");
  $categoriesLvlOne.change(function () {
    loadDoctorListByOrg($categoriesLvlOne.val(), $categoriesLvlTwo, $receiverId);
  });

  //加载样本信息
  (function() {
    if ($form.attr('id') === 'editForm') {
      loadSampleInfo();
    }
  })();

  //离开该页面时，提示表单未提交
  confirmLeaveForm();

  orderFromValidate('#' + $form.attr('id'))

  //取消编辑按钮
  $('#cancel').click(function() {
    window.location.href="detail?orderNo=" + $('#orderNo').val();
  });
}); // --------------------------------- document ready function end ---------------------------------

//渲染用户信息
function userInfoRender(data) {
  $("#patientFullName").val(data.fullName);
  $("#patientAge").val(data.age);
  $("#patientGender").val(data.gender);
  $("#patientNation").val(data.nation);
  $("#patientNativePlace").val(data.nativePlace);
  $("#patientEmail").val(data.email);
  $("#patientAddress").val(data.address);
  var formElementRevalidate = formElementRevalidateFactory($("#patientFullName").closest("form"));
  formElementRevalidate('patient.fullName');
  formElementRevalidate('patient.gender');
  formElementRevalidate('patient.age');
  layer.msg("加载成功");

}