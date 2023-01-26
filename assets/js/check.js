const username = document.getElementById("checkUsername");
const text = username.innerText;
if (text === "유저") {
  const verificationBox = document.querySelector("#checkEmail");
  const checkTextBox = document.querySelector(".check-text-box");
  const time = document.getElementById("time");
  verificationBox.style.display = "none";
  checkTextBox.innerText = "님 3초 뒤 로그인 페이지로 이동합니다 ☕";
  setInterval(() => {
    let timeNum = Number(time.innerText);
    ++timeNum;
    time.innerText = timeNum;
  }, 1000);

  setTimeout(() => {
    window.location.href = "/";
  }, 3000);
}
