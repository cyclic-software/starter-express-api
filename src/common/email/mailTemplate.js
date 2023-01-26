export const mailTemplate = (email, codeNum) => {
  return `
        <strong>Cafe Small House</strong>
        <br/>
        <hr/>
        <form method="post" action="http://localhost:5000/api/users/check">
          <p style="font-size:25px">로그인 버튼을 클릭해주세요</p>
          <input type="hidden" name="email" value=${email} />
          <input type="hidden" name="checkEmail" value=${codeNum} />
          <button style="color:#0984e3; font-size: 25px;">로그인</button>
        </form>
        <br/>
        <p>감사합니다</p>
        <p>&copy; ${new Date().getFullYear()} Cafe Small House</p>
        `;
};
