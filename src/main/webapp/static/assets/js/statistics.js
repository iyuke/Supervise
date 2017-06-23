/**
 * Created by Feddiyao on 2017/2/22.
 */
var page_status = $('#page-status').attr('class');
$(document).ready(function () {
  var statistics = new Statistics();
  var status = $('#page-status').attr('class');

  var $province = $("#orderExport .provinceId");
  var $city = $("#orderExport .cityId");
  var $district = $("#orderExport .districtId");
  var $sale_money_province = $("#sale_money .provinceId");
  var $sale_money_city = $("#sale_money .cityId");
  var $sale_money_district = $("#sale_money .districtId");
  var $sale_money_orgHospital = $("#sale_money .orgHospitalId");
  var $sale_amount_province = $("#sale_amount .provinceId");
  var $sale_amount_city = $("#sale_amount .cityId");
  var $sale_amount_district = $("#sale_amount .districtId");
  var $sale_amount_orgHospital = $("#sale_amount .orgHospitalId");

  var $sale_money_summary = $("#sale_money_summary");
  var $sale_money_summary_province = $sale_money_summary.find(".provinceId");
  var $sale_money_summary_city = $sale_money_summary.find(".cityId");
  var $sale_money_summary_district = $sale_money_summary.find(".districtId");
  var $sale_money_summary_orgHospital = $sale_money_summary.find(".orgHospitalId");
  var $sale_money_summary_department = $sale_money_summary.find(".departmentId");
  var $sale_money_summary_orderType = $("#orderType_search");

  multiSelectRender($sale_money_province);
  multiSelectRender($sale_money_city);
  multiSelectRender($sale_money_district);
  multiSelectRender($sale_money_orgHospital);
  multiSelectRender($sale_money_summary_province);
  multiSelectRender($sale_money_summary_city);
  multiSelectRender($sale_money_summary_district);
  multiSelectRender($sale_money_summary_orgHospital);
  multiSelectRender($sale_money_summary_department);

  dateRangePickerSet('.daterange');


  if (status === 'static') {
    var data_orderFee;
    data_orderFee = {
      'xAxis': ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      'sumIndexes': [3000, 2000, 3300, 5000, 3600, 4900, 7000, 2000, 1000],
      'consultationIndexes': [1000, 500, 2000, 2500, 1600, 1400, 2000, 2000, 300],
      'geneIndexes': [2000, 1500, 1300, 2500, 2000, 1500, 5000, 0, 700]
    };
    var data_orderAmount;
    data_orderAmount = {
      'xAxis': ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      'sumIndexes': [3, 2, 7, 5, 4, 5, 7, 2, 1],
      'consultationIndexes': [1, 1, 3, 3, 2, 2, 7, 1, 1],
      'geneIndexes': [2, 1, 4, 2, 2, 3, 0, 1, 1]
    };

    var data_orderAmount_department;
    data_orderAmount_department = {
      'xAxis': ['病理科', '内科', '妇产科'],
      'sumIndexes': [3, 2, 7],
    };

    var data_fee_summary;

    data_fee_summary = {
      'xAxis': ['安徽', '江西'],
      'xAxisName': '省份',
      'month': ['一月', '二月', '三月'],
      'month1': [3000, 2000],
      'month2': [1000, 500],
      'month3': [2000, 1500]
    };

    window.onload = function () {
      statistics.chartOfOrderFeeStatisticGroupByMonthRender(data_orderFee);
      statistics.chartOfOrderAmountStatisticGroupByMonthRender(data_orderAmount);
      statistics.chartOrderAmountStatisticGroupByDepartment(data_orderAmount_department);
      statistics.chartOrderFeeSummaryStatistic(data_fee_summary);
    }
  }

  $province.change(function () {
    getCityByProvinceIds($province.val(), $city, $district);
  });

  $city.change(function () {
    getDistrictByCityIds($city.val(), $district);
  });

  var myDate = new Date();
  var year = myDate.getFullYear();
  var month = myDate.getMonth() + 1;

  var $sale_money_startYear = $('#sale_money .rangeStartYear');
  var $sale_money_startMonth = $('#sale_money .rangeStartMonth');
  var $sale_money_endYear = $('#sale_money .rangeEndYear');
  var $sale_money_endMonth = $('#sale_money .rangeEndMonth');

  statistics.recentMonthRender($sale_money_startYear, $sale_money_startMonth, $sale_money_endYear,
      $sale_money_endMonth, 12);
  $sale_money_startYear.change(function () {
    resetOptions($sale_money_startMonth);
    statistics.getMonthSelectorOption($sale_money_startMonth, '1');
    resetOptions($sale_money_endYear);
    statistics.yearSelectionRender($sale_money_endYear, $(this).val(), $(this).val(), $(this).val());
    resetOptions($sale_money_endMonth);
    statistics.monthSelectionRender($sale_money_endMonth, '12');
    statistics.getChartOfOrderFeeStatisticGroupByMonth($sale_money_orgHospital.getOrgHospitalIds(),
        statistics.getDate($sale_money_startYear, $sale_money_startMonth), statistics.getDate($sale_money_endYear,
            $sale_money_endMonth));
    statistics.getChartOfOrderAmountStatisticGroupByMonth($sale_money_orgHospital.getOrgHospitalIds(),
        statistics.getDate($sale_money_startYear, $sale_money_startMonth), statistics.getDate($sale_money_endYear,
            $sale_money_endMonth));
  });

  $sale_money_startMonth.change(function () {
    resetOptions($sale_money_endMonth);
    if ($(this).val() > 1) {
      statistics.yearSelectionRender($sale_money_endYear, $sale_money_startYear.val(), Number($sale_money_startYear.val()) + 1,
          $sale_money_endYear.val());
    } else {
      statistics.yearSelectionRender($sale_money_endYear, $sale_money_startYear.val(), $sale_money_startYear.val(),
          $sale_money_endYear.val());
    }
    if ($sale_money_startYear.val() < $sale_money_endYear.val()) {
      statistics.monthSelectionRender($sale_money_endMonth, $(this).val() - 1 , 1, $(this).val())
    } else {
      statistics.monthSelectionRender($sale_money_endMonth, '12', Number($(this).val()) + 1, 12)
    }
    statistics.getChartOfOrderFeeStatisticGroupByMonth($sale_money_orgHospital.getOrgHospitalIds(),
        statistics.getDate($sale_money_startYear, $sale_money_startMonth), statistics.getDate($sale_money_endYear,
            $sale_money_endMonth));
    statistics.getChartOfOrderAmountStatisticGroupByMonth($sale_money_orgHospital.getOrgHospitalIds(),
        statistics.getDate($sale_money_startYear, $sale_money_startMonth), statistics.getDate($sale_money_endYear,
            $sale_money_endMonth));
  });

  $sale_money_endYear.change(function () {
    resetOptions($sale_money_endMonth);
    if ($sale_money_startYear.val() < $sale_money_endYear.val()) {
      statistics.monthSelectionRender($sale_money_endMonth, '', 1, Number($sale_money_startMonth.val()) - 1)
    } else {
      statistics.monthSelectionRender($sale_money_endMonth, '', Number($sale_money_startMonth.val()) + 1, 12)
    }

    statistics.getChartOfOrderFeeStatisticGroupByMonth($sale_money_orgHospital.getOrgHospitalIds(),
        statistics.getDate($sale_money_startYear, $sale_money_startMonth), statistics.getDate($sale_money_endYear,
            $sale_money_endMonth));
    statistics.getChartOfOrderAmountStatisticGroupByMonth($sale_money_orgHospital.getOrgHospitalIds(),
        statistics.getDate($sale_money_startYear, $sale_money_startMonth), statistics.getDate($sale_money_endYear,
            $sale_money_endMonth));
  });

  $sale_money_endMonth.change(function () {
    statistics.getChartOfOrderFeeStatisticGroupByMonth($sale_money_orgHospital.getOrgHospitalIds(),
        statistics.getDate($sale_money_startYear, $sale_money_startMonth), statistics.getDate($sale_money_endYear,
            $sale_money_endMonth));
    statistics.getChartOfOrderAmountStatisticGroupByMonth($sale_money_orgHospital.getOrgHospitalIds(),
        statistics.getDate($sale_money_startYear, $sale_money_startMonth), statistics.getDate($sale_money_endYear,
            $sale_money_endMonth));
  });
  
  $sale_money_orgHospital.getOrgHospitalIds = getOrgHospitalIds;
  if (status === 'dynamic' && $sale_money_province.val() !== undefined && $sale_money_city.val() !== undefined &&
      $sale_money_district.val() !== undefined) {
    getOrgHospitalByIds($sale_money_province.val(), $sale_money_city.val(), $sale_money_district.val(),
        $sale_money_orgHospital, (function () {
          statistics.getChartOfOrderFeeStatisticGroupByMonth($sale_money_orgHospital.getOrgHospitalIds());
          statistics.getChartOfOrderAmountStatisticGroupByMonth($sale_money_orgHospital.getOrgHospitalIds());
        }));
  }

  $sale_money_province.change(function () {
    getCityByProvinceIds($sale_money_province.val(), $sale_money_city, $sale_money_district);
    getOrgHospitalByIds($sale_money_province.val(), $sale_money_city.val(), $sale_money_district.val(),
        $sale_money_orgHospital, (function () {
          statistics.getChartOfOrderFeeStatisticGroupByMonth($sale_money_orgHospital.getOrgHospitalIds(),
              statistics.getDate($sale_money_startYear, $sale_money_startMonth), statistics.getDate($sale_money_endYear,
                  $sale_money_endMonth));
          statistics.getChartOfOrderAmountStatisticGroupByMonth($sale_money_orgHospital.getOrgHospitalIds(),
              statistics.getDate($sale_money_startYear, $sale_money_startMonth), statistics.getDate($sale_money_endYear,
                  $sale_money_endMonth));
        }));
  });

  $sale_money_city.change(function () {
    getDistrictByCityIds($sale_money_city.val(), $sale_money_district);
    getOrgHospitalByIds($sale_money_province.val(), $sale_money_city.val(), $sale_money_district.val(),
        $sale_money_orgHospital, (function () {
          statistics.getChartOfOrderFeeStatisticGroupByMonth($sale_money_orgHospital.getOrgHospitalIds(),
              statistics.getDate($sale_money_startYear, $sale_money_startMonth), statistics.getDate($sale_money_endYear,
              $sale_money_endMonth));
          statistics.getChartOfOrderAmountStatisticGroupByMonth($sale_money_orgHospital.getOrgHospitalIds(),
              statistics.getDate($sale_money_startYear, $sale_money_startMonth), statistics.getDate($sale_money_endYear,
                  $sale_money_endMonth));
        }));
  });

  $sale_money_district.change(function () {
    getOrgHospitalByIds($sale_money_province.val(), $sale_money_city.val(), $sale_money_district.val(),
        $sale_money_orgHospital, (function () {
          statistics.getChartOfOrderFeeStatisticGroupByMonth($sale_money_orgHospital.getOrgHospitalIds(),
              statistics.getDate($sale_money_startYear, $sale_money_startMonth), statistics.getDate($sale_money_endYear,
                  $sale_money_endMonth));
          statistics.getChartOfOrderAmountStatisticGroupByMonth($sale_money_orgHospital.getOrgHospitalIds(),
              statistics.getDate($sale_money_startYear, $sale_money_startMonth), statistics.getDate($sale_money_endYear,
                  $sale_money_endMonth));
        }));
  });
  $sale_money_orgHospital.change(function () {
    statistics.getChartOfOrderFeeStatisticGroupByMonth($sale_money_orgHospital.getOrgHospitalIds(),
        statistics.getDate($sale_money_startYear, $sale_money_startMonth), statistics.getDate($sale_money_endYear,
            $sale_money_endMonth));
    statistics.getChartOfOrderAmountStatisticGroupByMonth($sale_money_orgHospital.getOrgHospitalIds(),
        statistics.getDate($sale_money_startYear, $sale_money_startMonth), statistics.getDate($sale_money_endYear,
            $sale_money_endMonth));
  });

  $sale_money_summary_province.change(function () {
    getCityByProvinceIds($sale_money_summary_province.val(), $sale_money_summary_city, $sale_money_summary_district, "string", function () {
      getOrgHospitalByIds($sale_money_summary_province.val(), $sale_money_summary_city.val(), $sale_money_summary_district.val(),
          $sale_money_summary_orgHospital);
    });
  });

  $sale_money_summary_city.change(function () {
    getDistrictByCityIds($sale_money_summary_city.val(), $sale_money_summary_district, "string", function () {
          getOrgHospitalByIds($sale_money_summary_province.val(), $sale_money_summary_city.val(), $sale_money_summary_district.val(),
              $sale_money_summary_orgHospital);
        }
    );
  });

  $sale_money_summary_district.change(function () {
    getOrgHospitalByIds($sale_money_summary_province.val(), $sale_money_summary_city.val(), $sale_money_summary_district.val(),
        $sale_money_summary_orgHospital);
  });

  $sale_money_summary_orgHospital.change(function () {
    var orgHospitalIds = $sale_money_summary_orgHospital.val();
    if (orgHospitalIds !== null && orgHospitalIds !== undefined && orgHospitalIds.length === 1) {
      getDepartmentsByHospital(orgHospitalIds.pop(0), $sale_money_summary_department);
    }
  });
  if (status === 'dynamic' && $sale_money_summary_province.val() !== undefined && $sale_money_summary_city.val() !== undefined &&
      $sale_money_summary_district.val() !== undefined) {
    getOrgHospitalByIds($sale_money_summary_province.val(), $sale_money_summary_city.val(), $sale_money_summary_district.val(),
        $sale_money_summary_orgHospital);
  }
  var $sale_department_orgHospitalId = $("#gene_sale .orgHospitalId");
  var $sale_department_year = $("#applicationStartYear");
  var $sale_department_month = $("#applicationStartMonth");

  statistics.yearSelectionRender($('.applicationStartYear'), 2015, year);
  statistics.monthSelectionRender($('.applicationStartMonth'), month);
  if (status === 'dynamic') {
    statistics.getChartOfOrderAmountStatisticGroupByDepartment($sale_department_year.val(), $sale_department_month.val(),
        $sale_department_orgHospitalId.val());
  }

  $sale_department_year.change(function () {
    resetOptions($sale_department_month);
    if ($sale_department_year.val() !== '') {
      statistics.monthSelectionRender($('.applicationStartMonth'), '');
    }
  });
  $sale_department_month.change(function () {
    if ($sale_department_orgHospitalId.val() === '' || $sale_department_year.val() === '' ||
        $sale_department_month.val() === '') {
      return;
    }
    statistics.getChartOfOrderAmountStatisticGroupByDepartment($sale_department_year.val(), $sale_department_month.val(),
        $sale_department_orgHospitalId.val())
  });
  $sale_department_orgHospitalId.change(function () {
    if ($sale_department_orgHospitalId.val() === '' || $sale_department_year.val() === '' ||
        $sale_department_month.val() === '') {
      return;
    }
    statistics.getChartOfOrderAmountStatisticGroupByDepartment($sale_department_year.val(), $sale_department_month.val(),
        $sale_department_orgHospitalId.val())
  });

  var $sale_money_summary_startYear = $sale_money_summary.find(".rangeStartYear");
  var $sale_money_summary_startMonth = $sale_money_summary.find(".rangeStartMonth");
  var $sale_money_summary_endYear = $sale_money_summary.find(".rangeEndYear");
  var $sale_money_summary_endMonth = $sale_money_summary.find(".rangeEndMonth");

  $("#ensure").click(function () {
    if (status === 'dynamic') {
      var data = {
        start: $sale_money_summary_startYear.val() + "-" + $sale_money_summary_startMonth.val(),
        end: $sale_money_summary_endYear.val() + "-" + $sale_money_summary_endMonth.val(),
        orderType: $sale_money_summary_orderType.val(),
        provinceIds: $sale_money_summary_province.val(),
        cityIds: $sale_money_summary_city.val(),
        districtIds: $sale_money_summary_district.val(),
        hospitalIds: $sale_money_summary_orgHospital.val(),
        departmentIds: $sale_money_summary_department.val()
      }
      $.ajax({
        url: ctxPath + 'be/statistics/binary-data-statistics',
        contentType: "application/json; charset=utf-8",
        type: 'post',
        data: JSON.stringify(data),
        success: function (resp) {
          statistics.chartOrderFeeSummaryStatistic(resp);
        }
      })
    }
  });
  //月份区间选择器，时间间隔不能超过一年

  //选中最新三个月
  statistics.recentMonthRender($sale_money_summary_startYear, $sale_money_summary_startMonth,
      $sale_money_summary_endYear, $sale_money_summary_endMonth, 3)
  $sale_money_summary_startYear.change(function () {
    resetOptions($sale_money_summary_startMonth);
    statistics.monthSelectionRender($sale_money_summary_startMonth, '');
    resetOptions($sale_money_summary_endYear);
    statistics.yearSelectionRender($sale_money_summary_endYear, $(this).val(), Number($(this).val()) + Number(1));
    resetOptions($sale_money_summary_endMonth);
    statistics.monthSelectionRender($sale_money_summary_endMonth, '')
  });
  $("#ensure").click();

  $sale_money_summary_startMonth.change(function () {
    resetOptions($sale_money_summary_endMonth);
    if ($sale_money_summary_startYear.val() < $sale_money_summary_endYear.val()) {
      statistics.monthSelectionRender($sale_money_summary_endMonth, '', 1, $(this).val())
    } else {
      statistics.monthSelectionRender($sale_money_summary_endMonth, '', $(this).val(), 12)
    }
  });

  $sale_money_summary_endYear.change(function () {
    resetOptions($sale_money_summary_endMonth);
    if ($sale_money_summary_startYear.val() < $sale_money_summary_endYear.val()) {
      statistics.monthSelectionRender($sale_money_summary_endMonth, '', 1, $sale_money_summary_startMonth.val())
    } else {
      statistics.monthSelectionRender($sale_money_summary_endMonth, '', $sale_money_summary_startMonth.val(), 12)
    }
  });

  //只选中一家医院时可以选择其下属科室，否则科室框不可选
  $sale_money_summary_orgHospital.change(function () {
    if ($(this).val() != null && $(this).val() != '' && $(this).val().length == 1) {
      //todo:读取医院的科室列表
    } else {
      $sale_money_summary_department.empty();
      $sale_money_summary_department.multiselect('enable');
      $sale_money_summary_department.multiselect('rebuild');
    }
  })

});

var getOrgHospitalIds = function () {
  if (this.val() === null) {
    var orgHospitalIds = new Array();
    for (var i = 0; i < $(this).find("option").length; i++) {
      var j = i;
      orgHospitalIds[j] = $(this).find("option")[j].value;
    }
    return orgHospitalIds;
  } else {
    return this.val();
  }
};
var Statistics = new Function();

//订单销售金额
// 基于准备好的dom，初始化echarts实例

Statistics.prototype.getChartOfOrderFeeStatisticGroupByMonth = function(orgHospitalIds, startDate, endDate) {
  var that = this;
  $.ajax({
    url: ctxPath + 'be/statistics/order-statistics',
    type:'post',
    data:{
      orgHospitalIds:orgHospitalIds,
      startDate: startDate,
      endDate: endDate,
      type:'fee',
      unit:'10000'
    },
    success: function (respbd) {
      that.chartOfOrderFeeStatisticGroupByMonthRender(respbd);
    }
  })
};

Statistics.prototype.chartOfOrderFeeStatisticGroupByMonthRender = function (respbd) {
  if (respbd != null) {
    var chartOrderFeeStatisticGroupByMonth = echarts.init(document.getElementById('orderFeeStatisticGroupByMonth'));
    var option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['总计', '疑难病理', '分子病理']
      },
      toolbox: {
        show: true,
        feature: {
          mark: {show: true},
          dataView: {show: true, readOnly: false},
          magicType: {show: true, type: ['line', 'bar']},
          restore: {show: true},
          saveAsImage: {show: true}
        },
        right: '20px'
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          data: respbd.xAxis,
          name: '月份'
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '销售金额（万元）',
        }
      ],
      series: [
        {
          name: '总计',
          type: 'bar',
          data: respbd.sumIndexes,
          markLine: {
            data: []
          },
        },
        {
          name: '疑难病理',
          type: 'bar',
          data: respbd.consultationIndexes,
          markLine: {
            data: []
          },
        },
        {
          name: '分子病理',
          type: 'bar',
          data: respbd.geneIndexes,
          markLine: {
            data: []
          },
        }
      ]
    };
    chartOrderFeeStatisticGroupByMonth.setOption(option);
    //用于使chart自适应高度和宽度
    window.addEventListener("resize", function () {
      throttle(chartOrderFeeStatisticGroupByMonth.resize, chartOrderFeeStatisticGroupByMonth);
    });
  }
};

//订单销售量
Statistics.prototype.getChartOfOrderAmountStatisticGroupByMonth = function (orgHospitalIds, startDate, endDate) {
  var that = this;
  //订单销售量
  $.ajax({
    url: ctxPath + 'be/statistics/order-statistics',
    type: 'post',
    data: {
      orgHospitalIds: orgHospitalIds,
      startDate: startDate,
      endDate: endDate,
      type: 'amount'
    },
    success: function (respbd) {
      that.chartOfOrderAmountStatisticGroupByMonthRender(respbd)
    }
  })
};

Statistics.prototype.chartOfOrderAmountStatisticGroupByMonthRender = function (respbd) {
  if (respbd != null) {
    // 基于准备好的dom，初始化echarts实例
    var chartOrderAmountStatisticGroupByMonth = echarts.init(document.getElementById('orderAmountStatisticGroupByMonth'));

    option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['总计', '疑难病理', '分子病理']
      },
      toolbox: {
        show: true,
        feature: {
          mark: {show: true},
          dataView: {show: true, readOnly: false},
          magicType: {show: true, type: ['line', 'bar']},
          restore: {show: true},
          saveAsImage: {show: true}
        },
        right: '20px'
      },
      calculable: true,
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: respbd.xAxis,
          name: '月份'
        }
      ],
      yAxis: [
        {
          name: '销售量'
        }
      ],
      series: [
        {
          name: '总计',
          type: 'line',
          data: respbd.sumIndexes,
          markLine: {
            data: []
          }
        },
        {
          name: '疑难病理',
          type: 'line',
          data: respbd.consultationIndexes,
          markLine: {
            data: []
          }
        },
        {
          name: '分子病理',
          type: 'line',
          data: respbd.geneIndexes,
          markLine: {
            data: []
          }
        }
      ]
    };
    chartOrderAmountStatisticGroupByMonth.setOption(option);
    //用于使chart自适应高度和宽度
    window.addEventListener("resize", function () {
      throttle(chartOrderAmountStatisticGroupByMonth.resize, chartOrderAmountStatisticGroupByMonth);
    });
  }
}


Statistics.prototype.getChartOfOrderAmountStatisticGroupByDepartment = function (year, month, orgHospitalId) {
  var that = this;
  $.ajax({
    url: ctxPath + 'be/statistics/order-gene-statistics',
    type: 'post',
    data: {
      orgHospitalId: orgHospitalId,
      year: year,
      month: month
    },
    dataType: 'json',
    success: function (respbd) {
      $('#inform-message').html('');
      if (respbd != null) {
        that.chartOrderAmountStatisticGroupByDepartment(respbd);
      }
    },
    error: function (message) {
      var respbd = {
        sumIndexes: [],
        xAxis: []
      }
      that.chartOrderAmountStatisticGroupByDepartment(respbd);
      $('#inform-message').html(message.responseJSON.message)
    }
  })
};

Statistics.prototype.chartOrderAmountStatisticGroupByDepartment = function (respbd) {
  var chartOrderAmountStatisticGroupByDepartment = echarts.init(document.getElementById('orderAmountStatisticGroupByDepartment'));

  // 指定图表的配置项和数据
  var option = {
    toolbox: {
      show: true,
      feature: {
        mark: {show: true},
        dataView: {show: true, readOnly: false},
        magicType: {show: true, type: ['line', 'bar']},
        restore: {show: true},
        saveAsImage: {show: true}
      },
      right: '20px'
    },
    xAxis: {
      data: respbd.xAxis,
      name: '科室'
    },
    yAxis: {
      name: '销售量'
    },
    series: [{
      name: '销售量',
      type: 'bar',
      label: {
        normal: {
          show: true
        }
      },
      data: respbd.sumIndexes,
      barMaxWidth: '40px',
      itemStyle: {
        normal: {
          color: '#61a0a8',
        }
      }
    }]
  };

  // 使用刚指定的配置项和数据显示图表。
  chartOrderAmountStatisticGroupByDepartment.setOption(option);
  //用于使chart自适应高度和宽度
  window.addEventListener("resize", function () {
    throttle(chartOrderAmountStatisticGroupByDepartment.resize, chartOrderAmountStatisticGroupByDepartment);
  });
};

Statistics.prototype.getSeriesOfOrderFeeSummaryStatistic = function (respbd) {
  if (page_status === 'static') {
    return [
      {
        name: '一月',
        type: 'bar',
        data: respbd.month1,
        markLine: {
          data: []
        },
        label: {
          normal: {
            show: true
          }
        },
      },
      {
        name: '二月',
        type: 'bar',
        data: respbd.month2,
        markLine: {
          data: []
        },
        label: {
          normal: {
            show: true
          }
        },
      },
      {
        name: '三月',
        type: 'bar',
        data: respbd.month3,
        markLine: {
          data: []
        },
        label: {
          normal: {
            show: true
          }
        },
      }
    ]
  } else {
    var seriesResult = [];
    for (var key in respbd.series) {

      var series = {
        name: key,
        type: 'bar',
        data: respbd.series[key],
        markLine: {
          data: []
        },
        label: {
          normal: {
            show: true
          }
        },
      };
      seriesResult.push(series);
    }
    return seriesResult;
  }
}
Statistics.prototype.chartOrderFeeSummaryStatistic = function (respbd) {
  var chartOrderFeeSummaryStatistic = echarts.init(document.getElementById('chartOrderFeeSummaryStatistic'));

  // 指定图表的配置项和数据
  var option = {
    toolbox: {
      show: true,
      feature: {
        mark: {show: true},
        dataView: {show: true, readOnly: false},
        magicType: {show: true, type: ['line', 'bar']},
        restore: {show: true},
        saveAsImage: {show: true}
      },
      right: '20px'
    },
    legend: {
      data: respbd.legend
    },
    xAxis: {
      data: respbd.xAxis,
      name: respbd.xAxisName,
    },
    yAxis: {
      name: '销售金额（万元）'
    },
    series: this.getSeriesOfOrderFeeSummaryStatistic(respbd)
  };

  // 使用刚指定的配置项和数据显示图表。
  chartOrderFeeSummaryStatistic.setOption(option);
  //用于使chart自适应高度和宽度
  window.addEventListener("resize", function () {
    throttle(chartOrderFeeSummaryStatistic.resize, chartOrderFeeSummaryStatistic)
  });
};

//渲染年份下拉框
Statistics.prototype.yearSelectionRender = function (selector, startYear, endYear, selectItem) {
  var newHTML = '';
  var template = $(selector).parent()[0].childNodes[1].nodeValue;
  var selected = selectItem == undefined ? endYear : selectItem;
  for (var i = endYear; i >= startYear; i--) {
    if (i == selected) {
      newHTML += template.replace(new RegExp('%year', "gm"), i).replace('>', 'selected>');
    } else {
      newHTML += template.replace(new RegExp('%year', "gm"), i);
    }
  }
  $(selector).html(newHTML);
};

//渲染月份下拉框
Statistics.prototype.monthSelectionRender = function (selector, selectItem, startMonth, endMonth) {
  var newHTML = '';
  var template = $(selector).parent()[0].childNodes[1].nodeValue;
  var start = startMonth == undefined ? 1 : startMonth;
  var end = endMonth == undefined ? 12 : endMonth
  for (var i = start; i <= end; i++) {
    if (i == selectItem) {
      newHTML += template.replace(new RegExp('%month', "gm"), i).replace('>', 'selected>');
    } else {
      newHTML += template.replace(new RegExp('%month', "gm"), i);
    }
  }
  $(selector).html(newHTML);
};

//选中最近的月份
Statistics.prototype.recentMonthRender = function ($startYearSelector, $startMonthSelector, $endYearSelector, $endMonthSelector, monthRange) {
  var myDate = new Date();
  var year = myDate.getFullYear();
  var month = myDate.getMonth() + 1;

  if (month <= monthRange) {
    this.yearSelectionRender($startYearSelector, 2015, year, year - 1);
    this.yearSelectionRender($endYearSelector, year - 1, year);
    this.monthSelectionRender($startMonthSelector, month + 13 - monthRange);
  } else {
    this.yearSelectionRender($startYearSelector, 2015, year);
    this.yearSelectionRender($endYearSelector, year, year);
    this.monthSelectionRender($startMonthSelector, month - monthRange + 1);
  }

  this.monthSelectionRender($endMonthSelector, month);
};

//获取起始日期
Statistics.prototype.getDate = function ($yearElement, $monthElement, $dayElement) {
  if ($yearElement != undefined && $yearElement.val() == '') {
    return '';
  } else {
    if ($monthElement != undefined && $monthElement.val() == '') {
      return $yearElement.val()
    } else {
      if ($dayElement != undefined && $dayElement.val() == '') {
        return $yearElement.val() + '-' + $monthElement.val() + '-' + $dayElement.val()
      } else {
        return $yearElement.val() + '-' + $monthElement.val()
      }
    }
  }
};

function throttle(method, context) {
  clearTimeout(method.tId);
  method.tId = setTimeout(function () {
    method.call(context);
  }, 500);
}