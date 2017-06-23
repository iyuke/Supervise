/**
 * Created by Feddiyao on 2017/2/23.
 */
$(document).ready(function () {
  //多选框渲染
  multiSelectRender($('#orgIds'));
  
  //省市区级联变化
  var $province = $('#provinceId_create');
  var $city = $('#cityId_create');
  var $district = $('#districtId_create');

  var $editProvince = $('#provinceId_edit');
  var $editCity = $('#cityId_edit');
  var $editDistrict = $('#districtId_edit');

  var $searchProvince = $('#provinceId_search');
  var $searchCity = $('#cityId_search');
  var $searchDistrict = $('#districtId_search');

  $province.change(function () {
    getCityByProvinceIds($province.val(), $city, $district);
  });

  $city.change(function () {
    getDistrictByCityIds($city.val(), $district);
  });

  $editProvince.change(function () {
    getCityByProvinceIds($editProvince.val(), $editCity, $editDistrict);
  });

  $editCity.change(function () {
    getDistrictByCityIds($editCity.val(), $editDistrict);
  });

  $searchProvince.change(function () {
    getCityByProvinceIds($searchProvince.val(), $searchCity, $searchDistrict);
  });

  $searchCity.change(function () {
    getDistrictByCityIds($searchCity.val(), $searchDistrict);
  });
})
var OrganizationModal = new Function();
