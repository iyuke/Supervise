/**
 * Created by Feddiyao on 2017/2/15.
 */
$(document).ready(function () {
  //searchModal 送检医院下拉菜单监听事件
  var $hospitalId_search = $("#searchModal #orgHospitalId");
  var $departmentId_search = $("#searchModal #departmentId");
  var $doctorId_search = $("#searchModal #doctorId");
  $hospitalId_search.change(function () {
    loadDepartmentListByOrg($hospitalId_search, $departmentId_search, "");
    resetOptions($doctorId_search, "请选择");
  });
  $departmentId_search.change(function () {
    var orgId = $(this).val();
    if (orgId == "") {
      //科室为空时，查询医院的全部医生
      resetOptions($doctorId_search, "请选择");
    }
    loadDoctorListByOrg(orgId, $doctorId_search);
  });
})