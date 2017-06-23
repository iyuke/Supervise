package com.supervise.common.util;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.time.DateUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

public class DateUtil {

    public static final String YEAR_FORMAT = "yyyy";

    public static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    public static final String DATE_FORMAT = "yyyy-MM-dd";

    public static final String YEAR_MONTH_FORMAT = "yyyy-MM";

    public static final String TRANS_TIME_FORMAT = "yyyyMMddHHmmss";

    /**
     * 获取当天日期
     */
    public static Date getToday() {
        return Calendar.getInstance().getTime();
    }

    /**
     * 获取当天零点的日期时间
     */
    public static Date getStartOfToday() {
        return getStartOfDay(getToday());
    }

    public static Calendar getCalenderOfStartOfToday() {
        Calendar now = Calendar.getInstance();
        now.setTime(getStartOfToday());
        return now;
    }

    /**
     * 获取前一天零点的日期时间
     */
    public static Date getStartOfYesterday() {
        Calendar now = getCalenderOfStartOfToday();

        // 天数回滚一天
        now.add(Calendar.DATE, -1);

        return now.getTime();
    }

    /**
     * 获取明天零点的日期时间
     */
    public static Date getStartOfTomorrow() {
        Calendar now = getCalenderOfStartOfToday();

        // 天数回滚一天
        now.add(Calendar.DATE, 1);

        return now.getTime();
    }

    /**
     * 获取上月第一天零点日期时间
     */
    public static Date getFirstDayOfLastMonth() {
        Calendar now = getCalenderOfStartOfToday();
        // 如果当前月份是一月，则将年份回滚至前一年
        if (now.get(Calendar.MONDAY) == Calendar.JANUARY) {
            now.roll(Calendar.YEAR, false);
        }
        // 月数回滚一天
        now.roll(Calendar.MONTH, false);
        now.set(Calendar.DATE, 1);

        return now.getTime();
    }

    /**
     * 获取当月第一天零点日期时间
     */
    public static Date getFirstDayOfMonth() {
        Calendar now = getCalenderOfStartOfToday();
        now.set(Calendar.DATE, 1);

        return now.getTime();
    }

    public static String getTodayDate() {
        return getDate(getToday());
    }

    public static String getYesterdayDate() {
        return getDate(getStartOfYesterday());
    }

    public static Date getEndOfDay(Date date) {
        return DateUtils.addMilliseconds(DateUtils.ceiling(date, Calendar.DATE), -1);
    }

    public static Date getStartOfDay(Date date) {
        return DateUtils.truncate(date, Calendar.DATE);
    }

    public static Date getLastDayOfMonth(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        return calendar.getTime();
    }

    public static String getLastMonthDate() {
        Calendar now = Calendar.getInstance();
        now.add(Calendar.MONTH, -1);
        return format(now.getTime(), YEAR_MONTH_FORMAT);
    }

    public static Date getLastMonthDate(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MONTH, -1);
        return calendar.getTime();
    }

    public static String getDate(Date date) {
        return format(date, DATE_FORMAT);
    }

    public static String getCurrent() {

        Calendar now = Calendar.getInstance();

        return format(now.getTime(), DATE_TIME_FORMAT);
    }

    public static String getCurrentDay() {

        Calendar now = Calendar.getInstance();

        return format(now.getTime(), DATE_FORMAT);
    }

    public static Date getCurrentTime() {
        return Calendar.getInstance().getTime();
    }

    /**
     * 得到当年的第一天的零点零分
     *
     * @param now
     * @return
     */
    public static Date getFirstDateOfCurrentYear(Date now) {
        return parse(format(now, YEAR_FORMAT), YEAR_FORMAT);
    }

    /**
     * 获取两个日期之间的差额天数
     */
    public static int getDaysBetween(Date param1, Date param2) {
        int days = (int) (Math.abs(param2.getTime() - param1.getTime()) / (24 * 3600 * 1000));
        return days;
    }

    public static String format(Date date) {
        return format(date, DATE_TIME_FORMAT);
    }

    public static String format(Date date, String dateFormat) {
        if (date == null) {
            return "";
        }
        SimpleDateFormat formatter = new SimpleDateFormat(dateFormat);
        return formatter.format(date);
    }

    public static Date parse(String date) {
        SimpleDateFormat formatter = new SimpleDateFormat(DATE_TIME_FORMAT);
        try {
            return formatter.parse(date);
        } catch (ParseException e) {
            return null;
        }
    }

    public static Date parse(String date, String format) {
        SimpleDateFormat formatter = new SimpleDateFormat(format);
        try {
            return formatter.parse(date);
        } catch (ParseException e) {
            return null;
        }
    }

    public static Date parseDate(String date) {
        SimpleDateFormat formatter = new SimpleDateFormat(DATE_FORMAT);
        try {
            return formatter.parse(date);
        } catch (ParseException e) {
            return null;
        }
    }

    /**
     * 获取在所给日期上增加或减少相应天数之后的日期
     *
     * @param date
     * @param day
     * @return
     */
    public static Date rollDates(Date date, int day) {
        Calendar now = Calendar.getInstance();
        now.setTime(date);

        now.add(Calendar.DATE, day);

        return now.getTime();
    }

    /**
     * 获取在所给日期上增加或减少相应分钟数之后的日期
     *
     * @param date
     * @param minutes
     * @return
     */
    public static Date rollMinutes(Date date, int minutes) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.MINUTE, minutes);

        return calendar.getTime();
    }

    /**
     * 获取超时时间
     *
     * @param offSet
     * @return
     */
    public static Date getExpiryDate(int offSet) {
        Calendar now = Calendar.getInstance();

        now.set(Calendar.HOUR_OF_DAY, now.get(Calendar.HOUR_OF_DAY) + offSet);

        return now.getTime();
    }

    /**
     * 根据所传时分秒生成时间
     *
     * @param date
     * @param hour
     * @param minute
     * @param second
     * @return
     */
    public static Date createTime(Date date, int hour, int minute, int second) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, hour);
        calendar.set(Calendar.MINUTE, minute);
        calendar.set(Calendar.SECOND, second);
        calendar.set(Calendar.MILLISECOND, 0);

        return calendar.getTime();
    }

    /**
     * 获取所给时间的小时数
     *
     * @param date
     * @return
     */
    public static int getHourOfDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.HOUR_OF_DAY);
    }

    /**
     * 获取所给时间的分钟数
     *
     * @param date
     * @return
     */
    public static int getMinute(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.MINUTE);
    }

    /**
     * 将所给时间的分钟数向上取整至30分钟或整点
     *
     * @param date
     * @return
     */
    public static Date roundUpHalfOrOneHour(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        int minute = calendar.get(Calendar.MINUTE);

        // 如果分钟数小于30，则向上取整至30分钟
        if (minute < 30) {
            calendar.set(Calendar.MINUTE, 30);
            // 如果分钟数大于30，则向上取整至下一个整点
        } else if (minute > 30) {
            calendar.set(Calendar.HOUR_OF_DAY, calendar.get(Calendar.HOUR_OF_DAY) + 1);
            calendar.set(Calendar.MINUTE, 0);
        }

        return calendar.getTime();
    }

    /**
     * 获取连续格式的交易时间字符串
     *
     * @return
     */
    public static String getTransTime() {
        Calendar now = Calendar.getInstance();
        return format(now.getTime(), TRANS_TIME_FORMAT);
    }

    /**
     * 得到当前日期是周几，返回的是数字 0是周日--6是周六
     *
     * @param date
     * @return
     */
    public static int getTheDayOfWeekIndex(String date) {
        try {
            SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd");
            Calendar cd = Calendar.getInstance();
            cd.setTime(fmt.parse(date));
            int dayOfWeek = cd.get(Calendar.DAY_OF_WEEK);
            return dayOfWeek;
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return -1;
    }

    /***
     * 获取当前日期的两个工作日之后的Calendar
     * Author hedoyoung
     ***/
    public static Calendar getTwoWorkDaysLater() {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(new Date());
        Calendar twoWorkDaysLater = Calendar.getInstance();
        twoWorkDaysLater.setTime(new Date());
        if (calendar.get(Calendar.DAY_OF_WEEK) == 1 || calendar.get(Calendar.DAY_OF_WEEK) == 2 || calendar.get(Calendar.DAY_OF_WEEK) == 3 || calendar.get(Calendar.DAY_OF_WEEK) == 4) {
            //如果今天是周日、一、二、三，那么两个工作日后就是【今天+2】
            twoWorkDaysLater.set(Calendar.DATE, calendar.get(Calendar.DATE) + 2);
        } else if (calendar.get(Calendar.DAY_OF_WEEK) == 5 || calendar.get(Calendar.DAY_OF_WEEK) == 6) {
            //如果今天是周四、周五，那么两个工作日后就是下周一【今天+4】
            twoWorkDaysLater.set(Calendar.DATE, calendar.get(Calendar.DATE) + 4);
        }
        return twoWorkDaysLater;
    }

    /**
     * 得到几天前的时间
     *
     * @param d
     * @param day
     * @return
     */
    public static Calendar getDateBefore(Date d, int day) {
        Calendar now = Calendar.getInstance();
        now.setTime(d);
        now.set(Calendar.DATE, now.get(Calendar.DATE) - day);
        return now;
    }

    /**
     * 得到几天后的时间
     *
     * @param d
     * @param day
     * @return
     */
    public static Calendar getDateAfter(Date d, int day) {
        Calendar now = Calendar.getInstance();
        now.setTime(d);
        now.set(Calendar.DATE, now.get(Calendar.DATE) + day);
        return now;
    }

    /**
     * 获取当前毫秒时间
     *
     * @return
     */
    public static long getCurrentMilliSecond() {
        return Calendar.getInstance().getTimeInMillis();
    }

    /**
     * 获取日期中的某数值。如获取月份
     *
     * @param date     日期
     * @param dateType 日期格式
     * @return 数值
     */
    private static int getDateValueByType(Date date, int dateType) {
        int num = 0;
        Calendar calendar = Calendar.getInstance();
        if (date != null) {
            calendar.setTime(date);
            num = calendar.get(dateType);
        }
        return num;
    }

    /**
     * 获取日期的年份。失败返回0。
     *
     * @param date 日期
     * @return 年份
     */
    public static int getYear(Date date) {
        return getDateValueByType(date, Calendar.YEAR);
    }

    /**
     * 获取日期的月份。失败返回0。
     *
     * @param date 日期
     * @return 月份
     */
    public static int getMonth(Date date) {
        return getDateValueByType(date, Calendar.MONTH) + 1;
    }

    /**
     * dateRange:10/01/2016 - 10/18/2016
     * 将它解析成Date类型
     **/
    public static List<Date> dateRangeStringToDate(String dateRange) {
        List<Date> list = new ArrayList<Date>();
        if (StringUtils.isNotBlank(dateRange)) {
            dateRange = StringUtils.trim(dateRange);
            String[] dateRangeArray = dateRange.split("-");
            if (dateRangeArray != null && dateRangeArray.length == 2) {
                String beginDateStr = StringUtils.trim(dateRangeArray[0]);
                String endDateStr = StringUtils.trim(dateRangeArray[1]) + ":23:59:59";
                Date beginDate = DateUtil.parse(beginDateStr, "MM/dd/yyyy");
                Date endDate = DateUtil.parse(endDateStr, "MM/dd/yyyy:HH:mm:ss");
                list.add(beginDate);
                list.add(endDate);
                return list;
            }
        }
        return null;
    }

    /**
     * 获取当前日期是一年中的第几天
     *
     * @return 月份
     */
    public static int getTodayOfYear() {
        Calendar ca = Calendar.getInstance();
        return ca.get(Calendar.DAY_OF_YEAR);
    }

    /**
     * 查询在两个日期时间的所有年月份的字符串集合，包含结束月份
     *
     * @param start 开始月份
     * @param end   结束月份
     * @return 计算得到的年月份字符串结果集
     */
    public static List<String> yearMonthRangeToStringListClosed(Date start, Date end) {
        List<String> dateStringList = new ArrayList<String>();
        Calendar startCalendar = Calendar.getInstance();
        startCalendar.setTime(start);
        while (start.getTime() <= end.getTime()) {
            dateStringList.add(DateUtil.format(start, "yyyy-MM"));
            startCalendar.add(Calendar.MONTH, 1);
            start = startCalendar.getTime();
        }
        return dateStringList;
    }
    /*
     * startDate: 10/2016
     * endDate: 5/2015
     * 获取两个日期的相隔月份
     */
    public static int getMonthRange(Date startDate, Date endDate) {
        int startMonth = getDateValueByType(startDate, Calendar.MONTH);
        int startYear = getDateValueByType(startDate, Calendar.YEAR);
        int endMonth = getDateValueByType(endDate, Calendar.MONTH);
        int endYear = getDateValueByType(endDate, Calendar.YEAR);
        int yearRange = endYear - startYear;
        int monthRange = endMonth - startMonth;
        if (yearRange < 0) {
            return 0;
        } else if (yearRange == 0) {
            if (monthRange < 0) {
                return 0;
            } else {
                return monthRange + 1;
            }
        } else {
            return monthRange + 12 * yearRange + 1;
        }
    }
}
