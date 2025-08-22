/**
 * 동기/비동기 - 이벤트루프/스택/큐/webAPI
 * email: 문자를 주고받는 서비스
 * telnet: 원격접속: port23
 * ftp: file transfer protocol(통신규약): port21
 */
function fn1() {
  console.log("fn1");
}
function fn2() {
  console.log("fn2");
}
function getData() {
  // fetch().then().then().catch().finally()
  fetch("https://jsonplaceholder.typicode.com/posts", {
    headers: {
      "Content-type": "application/json",
      Authorizition: "bearer ",
    },
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
}
// function cb () {
//   console.log("cb2")
// }
// setTimeout (cb, 5000);
// fn1()
// fn2()

// getData();

function getData2() {
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts",
    success: (data) => console.log(data),
  });
}

// getData2();

function getData3() {
  axios.get("https://jsonplaceholder.typicode.com/posts").then((response) => {
    const { data, headers, config } = response;
    console.log(data);
  });
}

// getData3();

function myPromise(url) {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((res) => resolve(res.data))
      .catch((err) => reject(err));
  });
}
// console.log()
// myPromise("https://jsonplaceholder.typicode.com/posts")
//   .then((result) => console.log(result))
//   .catch((err) => console.log(err));

async function getData4() {
  const {data} = await axios.get("https://jsonplaceholder.typicode.com/posts");
  console.log(data);
}

getData4()