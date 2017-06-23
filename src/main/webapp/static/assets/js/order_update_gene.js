/**
 * Created by Feddiyao on 2017/2/9.
 */
var $form = $('#application\\.doctor\\.mobilePhone').closest('form');
var formElementRevalidate = formElementRevalidateFactory($('#application\\.doctor\\.mobilePhone').closest('form'));
$(document).ready(function () {
  var orderCreateGene = new OrderCreateGene();
  var $hospitalId = $('#orgHospitalId');
  var $departmentId = $("#departmentId");
  var $doctorId = $('#application\\.doctor\\.id');
  var $receiverId = $('#reportReceiverId');

  //送检医院下拉菜单监听事件
  $hospitalId.change(function(){
    orderCreateGene.departmentAndDoctorRender($hospitalId, $departmentId, $doctorId)
  });
  //送检科室下拉菜单监听事件
  $departmentId.change(function(){
    orderCreateGene.doctorRender(this, $doctorId, $receiverId)
  });
  //送检医生下啦菜单监听事件
  $doctorId.change(function () {
    fetchUserPhone($doctorId, $('#application\\.doctor\\.mobilePhone'));
  });

  var $testTypes = $('#application\\.testTypes');
  var $testItems = $('#application\\.testItems');
  var $testGenes = $('#application\\.testGenes');

  //检测类型下拉菜单监听事件
  $testTypes.change(function () {
    loadTestItemByTestType($testTypes, $testItems);
  });
  //检测项目下拉菜单监听事件
  $testItems.change(function () {
    setTestGeneByItems($testItems, $testGenes);
  });

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

  multiSelectRender($testTypes);

  multiSelectRender($testItems);

  multiSelectRender($testGenes);

  //加载样本信息
  (function() {
    if ($form.attr('id') === 'editForm') {
      loadSampleInfo();
    }
  })();

  //离开该页面时，提示表单未提交
  confirmLeaveForm();

  //表单提交前端验证
  orderGeneFormValidate('#' + $form.attr('id'));

  //取消编辑按钮
  $('#cancel').click(function() {
    window.location.href="detail?orderNo=" + $('#orderNo').val();
  });
});

var OrderCreateGene = new Function();
OrderCreateGene.prototype.departmentAndDoctorRender = function ($hospitalId, $departmentId, $doctorId) {
  loadDepartmentListByOrg($hospitalId, $departmentId, "", "送检科室");
  resetOptions($doctorId, "送检医生");
  $("#application\\.doctor\\.mobilePhone").val('');
  formElementRevalidate('application.doctor.id');
  formElementRevalidate('application.doctor.mobilePhone');
};

OrderCreateGene.prototype.doctorRender = function (department, $doctorId, $receiverId) {
  var orgId = $(department).val();
  if (orgId == "") {
    //科室为空时，查询医院的全部医生
    resetOptions($doctorId, "送检医生");
  } else {
    loadDoctorListByOrg(orgId, $doctorId, $receiverId);
  }
  $("#application\\.doctor\\.mobilePhone").val('');
  formElementRevalidate('application.doctor.mobilePhone');
}

//渲染用户信息
function userInfoRender(data) {
  if (data != "") {
    $("#patient\\.fullName").val(data.fullName);
    $("#patient\\.age").val(data.age);
    $("#patient\\.gender").val(data.gender);
    $("#patient\\.nation").val(data.nation);
    $("#patient\\.nativePlace").val(data.nativePlace);
    $("#patient\\.email").val(data.email);
    $("#patient\\.address").val(data.address);
    formElementRevalidate('patient.fullName');
    formElementRevalidate('patient.age');
    formElementRevalidate('patient.gender');
    layer.msg('加载成功');
  }
}
