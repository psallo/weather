const apiKey = "13988bad0f9b9e3a1cb9b91d01a823dd";
const kakaoKey = "7c834d08a7968b1f222599a453b350a6";
const reqUrl = "https://api.openweathermap.org/data/2.5/weather";
const iconUrl = "https://openweathermap.org/img/wn/10d@2x.png";
const weathers = {
  myData: {},
  allData: [
    { name: "서울", lat: 37.566295, lon: 126.975147, weather: {} },
    { name: "부산", lat: 35.179554, lon: 129.075642, weather: {} },
    { name: "제주", lat: 33.489011, lon: 126.498302, weather: {} },
    { name: "원주", lat: 37.342219, lon: 127.920162, weather: {} },
    { name: "대구", lat: 35.871435, lon: 128.601445, weather: {} },
    { name: "세종", lat: 36.480012, lon: 127.289069, weather: {} },
    { name: "광주", lat: 35.159545, lon: 126.852601, weather: {} },
    { name: "독도", lat: 37.241411, lon: 131.866147, weather: {} },
    { name: "속초", lat: 38.207015, lon: 128.591849, weather: {} },
  ],
};
function getIcon(code, lg = false) {
  return code
    ? `https://openweathermap.org/img/wn/${code}${lg ? "@2x" : ""}.png`
    : "-";
}
function getOverlay(icon, name, temp) {
  return `
    <div class="map-overlay-warpper" >
      <div class="inner-wrap">
        <div class="icon-wp">
          <img src="${getIcon(icon)}" alt="지도날씨아이콘" class="map-icon" />
        </div>
        <div class="temp-wp">
          <span class="city-name">${name}</span>
          <span class="city-temp">${temp}</span>℃
        </div>
      </div>
    </div>`;
}

function getCoords() {
  return new Promise((resolve) => {
    let defaultLat = 37.566535;
    let defaultLon = 126.9779692;
    window.navigator.geolocation.getCurrentPosition(
      (res) => {
        resolve({
          lat: res?.coords?.latitude ?? defaultLat,
          lon: res?.coords?.longitude ?? defaultLon,
        });
      },
      (err) => {
        console.log(err);
        resolve({ lat: defaultLat, lon: defaultLon });
      }
    );
  });
}
/**
 *
 * @param {number} lat
 * @param {number} lon
 * @returns promise
 */
async function getWeather(lat, lon) {
  const params = { lat, lon, appid: apiKey, units: "metric" };
  const { data } = await axios.get(reqUrl, { params });
  return data;
}

// 현재 위치 데이터
function renderInfo() {
  const { temp, feels_like, temp_max: max, temp_min: min, humidity, } = weathers.myData?.main || {};
  const { description, icon } = weathers.myData?.weather?.[0] || "-";
  const info = document.querySelector(".info-wrapper");
  info.querySelector(".main-temp").innerText = temp || "-";
  info.querySelector(".feels-temp").innerText = feels_like || "-";
  info.querySelector(".max-temp").innerText = max || "-";
  info.querySelector(".min-temp").innerText = min || "-";
  info.querySelector(".humidity").innerText = humidity || "-";
  info.querySelector(".description").innerText = description || "-";
  info.querySelector(".weather-icon").src = getIcon(icon, true);
}

function initMap() {
  const mapEl = document.getElementById("map");
  const mapOption = {
    center: new kakao.maps.LatLng(35.87143, 128.601445),
    level: 13,
    draggable: false,
    scrollwheel: false,
    disableDoubleClick: true,
    disableDoubleClickZoom: true,
  };
  const map = new kakao.maps.Map(mapEl, mapOption);

  weathers.allData.forEach((city) => {
    const { temp } = city.weather?.main;
    const { icon } = city.weather?.weather?.[0]?.icon;
    const Position = new kakaoKey.maps.LatLng(city.lat, city.lon);
    const marker = new kakaoKey.maps.marker({ Position });
    var Overlay = new kakao.maps.CustomOverlay({
      Position,
      content: getOverlay(icon, city.name, temp),
      xAnchor: 0.3,
      yAnchor: 0.91,
    });
    marker.setMap(map);
    Overlay.setMap(map);
  });
}
async function initInfo() {
  const { lat, lon } = await getCoords(); //나의 위치
  weathers.myData = await getWeather(lat, lon);
  renderInfo();
}

async function initMap() {
  const pms = weathers.allData.map((item) => getWeather(item.lat, item.lon));
  const values = await Promise.all(pms);
  weathers.allData.forEach((city, idx) => (city.weather = values[idx]));

async function init() {
  initInfo()
  initMap()
}
}

//전국 데이터

window.addEventListener("load", init);

//QueryString(params)
// https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
