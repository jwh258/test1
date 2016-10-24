/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
	var y = dat.getFullYear();
	var m = dat.getMonth() + 1;
	m = m < 10 ? '0' + m : m;
	var d = dat.getDate();
	d = d < 10 ? '0' + d : d;
	return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
	var returnData = {};
	var dat = new Date("2016-01-01");
	var datStr = '';
	for (var i = 1; i < 92; i++) {
		datStr = getDateStr(dat);
		returnData[datStr] = Math.ceil(Math.random() * seed);
		dat.setDate(dat.getDate() + 1);
	}
	return returnData;
}
var aqiSourceData = {
	"北京": randomBuildData(500),
	"上海": randomBuildData(300),
	"广州": randomBuildData(200),
	"深圳": randomBuildData(100),
	"成都": randomBuildData(300),
	"西安": randomBuildData(500),
	"福州": randomBuildData(100),
	"厦门": randomBuildData(100),
	"沈阳": randomBuildData(500)
};
// 用于渲染图表的数据
var chartData = {};
// 记录当前页面的表单选项
var pageState = {
	nowSelectCity: "北京",
	nowGraTime: "day"
};
var formGraTime = document.getElementById('form-gra-time');
var citySelect = document.getElementById('city-select');
var aqiChartWrap = document.getElementsByClassName('aqi-chart-wrap')[0];
/**
 * 渲染图表
 */
function renderChart() {
	var text = '';
	/*生成随机颜色*/
	/*color = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);*/
	/*随机颜色太丑，后决定用自定义颜色*/
	var colors = ['#16324a', '#24385e', '#393f65', '#4e4a67', '#5a4563', '#b38e95', '#edae9e', '#c1b9c2', '#bec3cb', '#9ea7bb', '#99b4ce', '#d7f0f8'];
	for (var item in chartData) {
		/*生成文本*/
		text += '<div title="' + pageState.nowSelectCity + ' ' + item + '\n' + '(平均)AQI：' + chartData[item] + '" style="height:' + chartData[item] + 'px; background-color:' + colors[Math.floor(Math.random() * 11)] + '" class="aqi-bar"></div>' + '<div class="blank"></div>';
	}
	aqiChartWrap.innerHTML = '<div class="title">' + pageState.nowSelectCity + '市01-03月' + getTitle() + '空气质量报告</div><div class="blank"></div>' + text;
}
/**
 * 获取当前统计时间选项
 * */
function getTitle() {
	switch (pageState.nowGraTime) {
		case "day":
			return "每日";
		case "week":
			return "周平均";
		case "month":
			return "月平均";
		case "month-week":
			return "每个月的周平均";
	}
}
/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
	// 确定是否选项发生了变化 
	if (pageState.nowGraTime == this.value) {
		return;
	} else {
		pageState.nowGraTime = this.value;
	}
	// 设置对应数据
	initAqiChartData();
	// 调用图表渲染函数
	renderChart();
}
/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
	// 确定是否选项发生了变化 
	if (pageState.nowSelectCity == this.value) {
		return;
	} else {
		pageState.nowSelectCity = this.value;
	}
	// 设置对应数据
	initAqiChartData();
	// 调用图表渲染函数
	renderChart();
}
/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
	var pageRadio = formGraTime.getElementsByTagName('input');
	for (var i = 0; i < pageRadio.length; i++) {
		pageRadio[i].addEventListener('click', graTimeChange)
	}
}
/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
	// 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
	var cityList = '';
	for (var i in aqiSourceData) {
		cityList += '<option>' + i + '</option>';
	}
	citySelect.innerHTML = cityList;
	// 给select设置事件，当选项发生变化时调用函数citySelectChange
	citySelect.addEventListener('change', citySelectChange);
}
/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
	// 将原始的源数据处理成图表需要的数据格式
	// 处理好的数据存到 chartData 中
	var nowCityData = aqiSourceData[pageState.nowSelectCity];
	//nowCityData是确定的一个城市的92天aqi数组，key是日期，nowCityData[key]是降水量
	/**
	 * 按天计算
	 * */
	if (pageState.nowGraTime == 'day') {
		chartData = nowCityData;
	}
	/**
	 * 按周计算
	 * */
	else if (pageState.nowGraTime == 'week') {
		chartData = {};
		var countSum = 0,//aqi总数
			daySum = 0,// 天数
			week = 0;//周
		console.clear();//清空控制台
		//将nowCityData对象强转为二维数组
		var arrCityData = [];
		for (var item in nowCityData) {
			arrCityData.push([item, nowCityData[item]]);
		}
		// console.log(arrCityData);//看一眼对不对
		for (var i = 0; i < arrCityData.length; i++) {
			console.log(((new Date(arrCityData[i][0])).getMonth() + 1) + '月' + (new Date(arrCityData[i][0])).getDate() + '日，' + '星期' + (new Date(arrCityData[i][0])).getDay() + '，aqi：' + arrCityData[i][1]);
			if ((new Date(arrCityData[i][0])).getDay() == 6) {//星期6最后一天  结算本周
				countSum += arrCityData[i][1];
				daySum++;
				chartData['第' + (week + 1) + '周'] = Math.floor(countSum / daySum);
				console.log('本周总数：' + countSum + ' 平均数：' + chartData['第' + (week + 1) + '周']);
				countSum = 0;
				daySum = 0;
				week = week + 1;
				// continue;
			} else if (arrCityData[i] == arrCityData[arrCityData.length - 1]) {//如果是最后一组数据  补全一周
				chartData['第' + (week + 1) + '周'] = Math.floor(countSum / daySum);
				console.log('本周总数：' + countSum + ' 平均数：' + chartData['第' + (week + 1) + '周']);
				// continue;
			}
			else {
				countSum += arrCityData[i][1];
				daySum++;
			}
		}
		/**
		 * 另一种写法
		 * */
		// for (var item in nowCityData) {
		// 	console.log(((new Date(item)).getMonth() + 1) + '月' + (new Date(item)).getDate() + '日，' + '星期' + (new Date(item)).getDay() + '，aqi：' + nowCityData[item]);
		// 	if ((new Date(item)).getDay() == 6) {
		// 		countSum += nowCityData[item];
		// 		daySum++;
		// 		chartData['第' + (week + 1) + '周'] = Math.floor(countSum / daySum);
		// 		countSum = 0;
		// 		daySum = 0;
		// 		week = week + 1;
		// 		continue;
		// 	} else if (item = xxx.lastchild) {
		// 		if ((new Date(item)).getDay() != 6) {
		// 			chartData['第' + (week + 1) + '周'] = Math.floor(countSum / daySum);
		// 		}
		// 	}
		// 	else {
		// 		countSum += nowCityData[item];
		// 		daySum++;
		// 	}
		// }
	}
	/**
	 * 按月计算
	 * */
	else if (pageState.nowGraTime == 'month') {
		chartData = {};
		var countSum = 0,//aqi总数
			daySum = 0,//天数
			month = 0;//yue
		//将nowCityData对象强转为二维数组
		var arrCityData = [];
		for (var item in nowCityData) {
			arrCityData.push([item, nowCityData[item]]);
		}
		console.clear();//清空控制台
		// console.log(arrCityData[3][0]);
		for (var i = 0; i < arrCityData.length; i++) {
			console.log(((new Date(arrCityData[i][0])).getMonth() + 1) + '月' + (new Date(arrCityData[i][0])).getDate() + '日，' + '星期' + (new Date(arrCityData[i][0])).getDay() + '，aqi：' + arrCityData[i][1]);
			if (chkDay(arrCityData[i][0]) == true) {//结算本月
				countSum += arrCityData[i][1];
				daySum++;
				chartData[(month + 1) + '月'] = Math.floor(countSum / daySum);
				console.log('本月总数：' + countSum + ' 平均数：' + chartData[(month + 1) + '月']);
				countSum = 0;
				daySum = 0;
				month = month + 1;
				// continue;
			} else if (arrCityData[i] == arrCityData[arrCityData.length - 1]) {//如果是最后一组数据  补全一周
				chartData[(month + 1) + '月'] = Math.floor(countSum / daySum);
				console.log('本月总数：' + countSum + ' 平均数：' + chartData[(month + 1) + '月']);
				// continue;
			}
			else {
				countSum += arrCityData[i][1];
				daySum++;
			}
		}
	}
	/**
	 * 月-周结算
	 * */
	else if (pageState.nowGraTime == 'month-week') {
		chartData = {};
		var countSum = 0,//aqi总数
			daySum = 0,// 天数
			week = 0,//周
			month = 0;//月
		console.clear();//清空控制台
		//将nowCityData对象强转为二维数组
		var arrCityData = [];
		for (var item in nowCityData) {
			arrCityData.push([item, nowCityData[item]]);
		}
		// console.log(arrCityData);//看一眼对不对
		for (var i = 0; i < arrCityData.length; i++) {
			console.log(((new Date(arrCityData[i][0])).getMonth() + 1) + '月' + (new Date(arrCityData[i][0])).getDate() + '日，' + '星期' + (new Date(arrCityData[i][0])).getDay() + '，aqi：' + arrCityData[i][1]);
			if (chkDay(arrCityData[i][0]) == true) {//月底强制结束一周
				countSum += arrCityData[i][1];
				daySum++;
				chartData[(month + 1) + '月，第' + (week + 1) + '周，共' + daySum + '天'] = Math.floor(countSum / daySum);
				console.log('本周总数：' + countSum + ' 平均数：' + chartData[(month + 1) + '月，第' + (week + 1) + '周，共' + daySum + '天']);
				countSum = 0;
				daySum = 0;
				week = 0;
				month = month + 1;
				// continue;
			} else if ((new Date(arrCityData[i][0])).getDay() == 6) {//星期6最后一天  结算本周
				countSum += arrCityData[i][1];
				daySum++;
				chartData[(month + 1) + '月，第' + (week + 1) + '周，共' + daySum + '天'] = Math.floor(countSum / daySum);
				console.log('本周总数：' + countSum + ' 平均数：' + chartData[(month + 1) + '月，第' + (week + 1) + '周，共' + daySum + '天']);
				countSum = 0;
				daySum = 0;
				week = week + 1;
				// continue;
			} else if (arrCityData[i] == arrCityData[arrCityData.length - 1]) {//如果是最后一组数据  补全一周
				chartData[(month + 1) + '月，第' + (week + 1) + '周，共' + daySum + '天'] = Math.floor(countSum / daySum);
				console.log('本周总数：' + countSum + ' 平均数：' + chartData[(month + 1) + '月，第' + (week + 1) + '周，共' + daySum + '天']);
				// continue;
			}
			else {
				countSum += arrCityData[i][1];
				daySum++;
			}
		}
	}
}
/**
 * 判断日期是否为当月最后一天
 *
 * 没有日期格式合法性判断
 *
 * */
function chkDay(dat) {
	// console.log(dat);
	var year = dat.slice(0, 4);
	var month = dat.slice(5, 7);
	var day = dat.slice(8, 10);
	// console.log(year);
	// console.log(month);
	// console.log(day);
	if ((month == 4 || month == 6 || month == 9 || month == 11) && (day == 30)) {
		return true;
	} else if ((month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) && (day == 31)) {
		return true;
	} else if (month == 2) {//2月比较特殊 需要判断是不是闰年
		if (isLeapYear(year) && (day == 29)) {
			return true;
		} else if (!isLeapYear(year) && (day == 28)) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
	// 判断闰年
	function isLeapYear(Year) {
		if (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0)) {
			return (true);
		} else {
			return (false);
		}
	}
}
/**
 * 初始化函数
 */
function init() {
	initGraTimeForm();
	initCitySelector();
	initAqiChartData();
	renderChart()
}
init();