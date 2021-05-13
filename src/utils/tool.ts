import { FRONT_URL } from './serverConfig'


export const convertObj2Url = (data) => {
  var _result = [];
  for (var key in data) {
    var value = data[key];
    if (value.constructor == Array) {
      value.forEach(function (_value) {
        _result.push(key + "=" + _value);
      });
    } else {
      _result.push(key + '=' + value);
    }
  }
  return _result.join('&');
}

export const getEnv = () => {
  const userAgent = navigator.userAgent
  if (JSON.stringify(userAgent).indexOf('Android') > -1 || JSON.stringify(userAgent).indexOf('iPhone') > -1) {
    return 'mobile'
  } else {
    return 'pc'
  }
}

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y; // 判断是否为NaN
  }
}
// 深比较对象内容是否一致（索引地址可以不一样）
export function deepEqual(objA, objB) {
  if (is(objA, objB)) return true;

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;

  for (var i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !deepEqual(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

function addZero(num) {
  return Number(num) < 10 ? `0${num}` : num;
}

export const formatDate = (year, month, day, hour, minute) => {
  const newmonth = addZero(month);
  const newday = addZero(day);
  const newhour = addZero(hour);
  const newminute = addZero(minute);

  return year + '-' + newmonth + '-' + newday + ' ' + newhour + ":" + newminute;
};

// 获取当前时间
export const getDate = (value) => {
  let date = '';
  if (value) {
    date = new Date(value);
  } else {
    date = new Date();
  }
  const y = date.getFullYear(),
    m = date.getMonth() + 1,
    d = date.getDate(),
    h = date.getHours(), //获取当前小时数(0-23)
    f = date.getMinutes();
  return formatDate(y, m, d, h, f);
};

// 获取对应年份月份的天数
export const getMonthDay = (year, month) => {
  var d = new Date(year, month, 0);
  return d.getDate();
};

//根据时间2019-01-02 09：12  得到 ['2019','1','2','9','12']
export const getArrWithTime = (str) => {
  let arr1 = str.split(' ');
  let arr2 = (arr1[0]).split('-');
  let arr3 = arr1[1].split(':');
  let arr = arr2.concat(arr3);
  arr[1] = arr[1].startsWith('0') ? arr[1].substr(1, arr[1].length) : arr[1];
  arr[2] = arr[2].startsWith('0') ? arr[2].substr(1, arr[2].length) : arr[2];
  arr[3] = arr[3].startsWith('0') ? arr[3].substr(1, arr[3].length) : arr[3];
  arr[4] = arr[4].startsWith('0') ? arr[4].substr(1, arr[4].length) : arr[4];
  return arr;
};

// 获取月份天数
export const getDayList = (year, month) => {
  const dayList = [];
  var d = new Date(year, month, 0);
  for (let i = 1; i <= d.getDate(); i++) {
    dayList.push(i + "日");
  }

  return dayList;
};

// 获取最近的年、月、日、时、分的集合
export const getPickerViewList = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const yearList = [];
  const monthList = [];
  const dayList = getDayList(year, month);
  const hourList = [];
  const minuteList = [];

  for (let i = 1970; i <= 2070; i++) {
    yearList.push(i + "年");
  }
  for (let i = 1; i <= 12; i++) {
    monthList.push(i + "月");
  }

  for (let i = 0; i <= 23; i++) {
    hourList.push(i + "点");
  }
  for (let i = 0; i <= 59; i++) {
    minuteList.push(i + "分");
  }
  return { yearList, monthList, dayList, hourList, minuteList };
};

export const getUserIdCookie = () => {
  if (document.cookie.length > 0) {
    return document.cookie.split("=")[1];
  }
  return '';
}

export const setUserIdCookie = (userId) => {
  document.cookie = `userId=${userId};expires=${new Date((new Date()).getTime() + 2 * 60 * 60000).toUTCString()}`
}