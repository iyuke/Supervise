/**
 * Created by Feddiyao on 2017/2/13.
 */
var $form = $("#applicationDate").closest('form');
var formName = $form.attr('id')
var formElementRevalidate = formElementRevalidateFactory($("#applicationDate").closest("form"));
$(document).ready(function () {
  var orderCreateBase = new OrderCreateBase();
  // 日历组件
  $('.datepicker').datepicker({
    format: 'yyyy-mm-dd',
    language: 'zh-CN',
    autoclose: true,
    todayHighlight: true
  }).on('changeDate', function (e) {
    // Revalidate the date field
    formElementRevalidate('applicationDate');
    formElementRevalidate('tissueSampleDates');
    formElementRevalidate('application.sampleInfo.lastMenstruationDate');
    formElementRevalidate('application.sampleInfo.inspectionDate')
  });

  var $hospitalId = $("#orgHospitalId");
  var $departmentId = $("#departmentId");
  var $doctorId = $("#application\\.doctor\\.id");
  var $receiverId = $("#reportReceiverId");
  //送检医院下拉菜单监听事件
  $hospitalId.change(function () {
    orderCreateBase.departmentAndDoctorRender($hospitalId, $departmentId, $doctorId);
  });
  //送检科室下拉菜单监听事件
  $departmentId.change(function () {
    var orgId = $(this).val();
    orderCreateBase.doctorRender(orgId, $hospitalId, $doctorId);
  });

  //表单验证
  orderBaseFormValidation('#' + $form.attr('id'));

  //妇科样本/病理检验的显示内容变化
  orderCreateBase.sampleInformRender();

  //离开该页面时，提示表单未提交
  confirmLeaveForm();
});

var OrderCreateBase = new Function();
OrderCreateBase.prototype.sampleInformRender = function () {
  //选为是妇科样本/病理检验前关闭妇科样本的前端验证
  $form.data('formValidation').enableFieldValidators('application.sampleInfo.lastMenstruationDate',
      false);
  $form.data('formValidation').enableFieldValidators('application.sampleInfo.menstruationBloodVolume', false);
  $form.data('formValidation').enableFieldValidators('application.sampleInfo.inspectionPlace', false);
  $form.data('formValidation').enableFieldValidators('application.sampleInfo.inspectionDate', false);
  $form.data('formValidation').enableFieldValidators('application.sampleInfo.treatmentDate', false);
  $form.data('formValidation').enableFieldValidators('application.sampleInfo.dosage', false);

  //编辑数据加载之后判断如果是妇科样本、病理检验、做过治疗等
  if($('input[name=application\\.sampleInfo\\.isGynecologySample]:checked').val()=="false") {
    $('.OandGDepartmentBaseInfo').hide();
  }else{
    $('.OandGDepartmentBaseInfo').show();
    $('#editForm').data('formValidation').enableFieldValidators('application.sampleInfo.lastMenstruationDate', true);
    $('#editForm').data('formValidation').enableFieldValidators('application.sampleInfo.menstruationBloodVolume',
        true);
  }
  if($('input[name=application\\.sampleInfo\\.isTreated]:checked').val()=="false") {
    $('.OandGDepartmentOtherInfo').hide();
  }else{
    $('.OandGDepartmentOtherInfo').show();
    $('#editForm').data('formValidation').enableFieldValidators('application.sampleInfo.treatmentDate', true);
    $('#editForm').data('formValidation').enableFieldValidators('application.sampleInfo.dosage', true);

  }
  if($('input[name=application\\.sampleInfo\\.hasPathologyInspection]:checked').val()=="false") {
    $('.pathologyExaminationInfo').hide();
  }else{
    $('.pathologyExaminationInfo').show();
    $('#editForm').data('formValidation').enableFieldValidators('application.sampleInfo.inspectionPlace', true);
    $('#editForm').data('formValidation').enableFieldValidators('application.sampleInfo.inspectionDate', true);
  }

  // 如果是妇产科系样本则显示对应信息填写输入框
  $('input[name=application\\.sampleInfo\\.isGynecologySample]').change(function () {
    var treatmentVal =$('input[name=application\\.sampleInfo\\.isTreated]:checked').val();
    if ($(this).val() === 'true') {
      $('.OandGDepartmentBaseInfo').show(300);
      $form.data('formValidation').enableFieldValidators('application.sampleInfo.lastMenstruationDate', true);
      $form.data('formValidation').enableFieldValidators('application.sampleInfo.menstruationBloodVolume', true);
      if (treatmentVal === 'true') {
        $('.OandGDepartmentOtherInfo').show(300);
        $form.data('formValidation').enableFieldValidators('application.sampleInfo.treatmentDate', true);
        $form.data('formValidation').enableFieldValidators('application.sampleInfo.dosage', true);
      }
    } else {
      $('.OandGDepartmentOtherInfo').hide(300);
      $('.OandGDepartmentBaseInfo').hide(300);
      $('#application\\.sampleInfo\\.lastMenstruationDate').val('');
      $('#application\\.sampleInfo\\.menstruationBloodVolume').val('');
      $('#application\\.sampleInfo\\.menstruationCycle').val('');
      $('#application\\.sampleInfo\\.urinePregnancyReaction').val('');
      $('#application\\.sampleInfo\\.lastParturitionOrAbortion').val('');
      $('#application\\.sampleInfo\\.uterineCurettageDate').val('');
      $('#application\\.sampleInfo\\.otherInfo').val('');
      $('input[name=application\\.sampleInfo\\.isTreated]').get(1).checked = true;
      $('#application\\.sampleInfo\\.treatmentDate').val('');
      $('#application\\.sampleInfo\\.dosage').val('');
      $form.data('formValidation').enableFieldValidators('application.sampleInfo.lastMenstruationDate', false);
      $form.data('formValidation').enableFieldValidators('application.sampleInfo.menstruationBloodVolume', false);
      $form.data('formValidation').enableFieldValidators('application.sampleInfo.treatmentDate', false);
      $form.data('formValidation').enableFieldValidators('application.sampleInfo.dosage', false);
    }
  });

  //若患者经过治疗则显示对应信息填写输入框
  $('input[name=application\\.sampleInfo\\.isTreated]').change(function () {
    if ($(this).val() === 'true') {
      $('.OandGDepartmentOtherInfo').show(300);
      $form.data('formValidation').enableFieldValidators('application.sampleInfo.treatmentDate', true);
      $form.data('formValidation').enableFieldValidators('application.sampleInfo.dosage', true);
    } else {
      $('.OandGDepartmentOtherInfo').hide(300);
      $('#application\\.sampleInfo\\.treatmentDate').val('');
      $('#application\\.sampleInfo\\.dosage').val('');
      $form.data('formValidation').enableFieldValidators('application.sampleInfo.treatmentDate', false);
      $form.data('formValidation').enableFieldValidators('application.sampleInfo.dosage', false);
    }
  });

  //若患者经过病理检验则显示对应信息填写输入框
  $('input[name=application\\.sampleInfo\\.hasPathologyInspection]').change(function () {
    if ($(this).val() === 'true') {
      $('.pathologyExaminationInfo').show(300);
      $form.data('formValidation').enableFieldValidators('application.sampleInfo.inspectionPlace', true);
      $form.data('formValidation').enableFieldValidators('application.sampleInfo.inspectionDate', true);
    } else {
      $('.pathologyExaminationInfo').hide(300);
      $('#application\\.sampleInfo\\.inspectionPlace').val('');
      $('#application\\.sampleInfo\\.inspectionDate').val('');
      $('#application\\.sampleInfo\\.pathologyNo').val('');
      $('#application\\.sampleInfo\\.pathologyDiagnosis').val('');
      $form.data('formValidation').enableFieldValidators('application.sampleInfo.inspectionPlace', false);
      $form.data('formValidation').enableFieldValidators('application.sampleInfo.inspectionDate', false);
    }
  });
};

OrderCreateBase.prototype.departmentAndDoctorRender = function ($hospitalId, $departmentId, $doctorId) {
  loadDepartmentListByOrg($hospitalId, $departmentId, "", "送检科室");
  resetOptions($doctorId, "送检医生");
  $("#application\\.doctor\\.mobilePhone").val('');
  formElementRevalidate('departmentId');
  formElementRevalidate('application.doctor.id');
};

OrderCreateBase.prototype.doctorRender = function (orgId, $hospitalId, $doctorId) {
  if (orgId == "") {
    //科室为空时，查询医院的全部医生
    resetOptions($doctorId, "送检医生");
  } else {
    loadDoctorListByOrg(orgId, $doctorId, "", "送检医生");
  }
  $("#application\\.doctor\\.mobilePhone").val('');
};

//渲染用户信息
function userInfoRender(data) {
  $("#patient\\.fullName").val(data.fullName);
  $("#patient\\.age").val(data.age);
  $("#patient\\.gender").val(data.gender);
  $("#patient\\.mobilePhone").val(data.mobilePhone);
  $("#patient\\.nativePlace").val(data.nation);
  $("#patient\\.email").val(data.email);
  $("#patient\\.address").val(data.address);
  $('#patient\\.postcode').val(data.postcode);
  $('#patient\\.marry').val(data.marry);
  $('#patient\\.career').val(data.career);
  formElementRevalidate('patient.fullName');
  formElementRevalidate('patient.gender');
  formElementRevalidate('patient.age');
  formElementRevalidate('patient.mobilePhone');
}