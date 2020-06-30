module.exports = {
  Post_Reader_HTML:function(title, post_data, comment_data, back, modify, remove) {
    if(!post_data.modifydate){
      var create_modify_date = `<h5>게시일 : ${post_data.createdate}</h5>`;
    } else {
      var create_modify_date = `<h5>게시일 : ${post_data.createdate} (수정됨 : ${post_data.modifydate})</h5>`;
    }
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
              <title>${title}</title>
              <script src="js/jquery-3.5.1.min.js"></script>
              <link rel="stylesheet" href="css/commen.css">
              <link rel="stylesheet" href="css/post_read.css">
          </head>
          <body id="main">
              <div id="myMenu">
                  <div class="h-container">
                    <div class="item middle">
                      <form action="/" method="get">
                        <input type="submit" value="돌아가기" href="/">
                        </form>
                      </div>
                      <div class="item middle">
                        <form action="/post_update" method="post">
                          <input type="hidden" name="id" value="${post_data.post_id}">
                          <input type="submit" value="변경">
                        </form>
                      </div>
                      <div class="item middle">
                        <form action="/post_delete_process" method="post" onsubmit="return recheck(1)">
                          <input type="hidden" name="id" value="${post_data.post_id}">
                          <input type="submit" value="삭제">
                        </form>
                      </div>
                      <div class="item last">login</div>
                  </div>
              </div>
                <nav id="myNav">
                    navigation
                    <ul>장르
                        <a href=""><li>장르1</li></a>
                        <a href=""><li>장르2</li></a>
                    </ul>
                    <ul>연도
                        <a href=""><li>(2000~2010)</li></a>
                        <a href=""><li>(2010~2020)</li></a>
                    </ul>
                </nav>
                <section id="post_Section">
                  <h3>${post_data.title}</h3>
                  ${create_modify_date}
                  ${post_data.description}
                </section>
                <div>
                  <form name="comment_editer" action="/comment_create_process" method="post" onsubmit="return comment_data_intergrity()">
                    <input type="hidden" name="post_id" value="${post_data.post_id}">
                    <input type="hidden" name="user_id" value="1">
                    <input type="hidden" name="score" value="2.5">
                    <input type="text" name="description" placeholder="댓글 입력">
                    <table>
                      <tr>
                        <td> 평점 : </td>
                        <td>
                          <div class="starRev">
                            <span class="starR1 on">별1_왼쪽</span>
                            <span class="starR2 on">별1_오른쪽</span>
                            <span class="starR1 on">별2_왼쪽</span>
                            <span class="starR2 on">별2_오른쪽</span>
                            <span class="starR1 on">별3_왼쪽</span>
                            <span class="starR2">별3_오른쪽</span>
                            <span class="starR1">별4_왼쪽</span>
                            <span class="starR2">별4_오른쪽</span>
                            <span class="starR1">별5_왼쪽</span>
                            <span class="starR2">별5_오른쪽</span>
                          </div>
                        </td>
                    </table>
                    <input type="submit" value="등록">
                  </form>
                  <table border = 1 id="comments">
                    <tr>
                      <th>닉네임</th>
                      <th>댓글내용</th>
                      <th>평점</th>
                      <th>작성일</th>
                      <th>수정</th>
                      <th>삭제</th>
                    </tr>
                    ${comment_data}
                  </table>
                </div>
              </nav>
              <script src="js/html_functions.js"></script>
          </body>
      </html>
    `;
  },

  Editer_HTML:function(movies, post_data) {
    if(arguments.length == 1) {
      var back = ``
      var form = `
      <form name="post_editer" action="/post_create_process" method="post" onsubmit="return post_data_integrity()">
        <p><input type="text" name="edit_title" placeholder = "제목(생략가능)"></input></p>
        영화 제목 : ${movies}<input type="hidden" name="user_nickname" value="관리자">
        <p><textarea name="edit_description" placeholder = "내용"></textarea><p>
        <p><input type="submit">
      </form>
      `;
    } else {
      var back = `post_id=${post_data.post_id}`
      var form = `
        <form name="post_editer" action="/post_update_process" method="post" onsubmit="return post_data_integrity()">
          <input type="hidden" name="post_id" value="${post_data.post_id}">
          <p><input type="text" name="edit_title" placeholder = "제목(생략가능)" value="${post_data.title}"></input></p>
          영화 제목 : ${movies}<input type="hidden" name="user_nickname" value="${post_data.nickname}">
          <p><textarea name="edit_description" placeholder = "내용">${post_data.description}</textarea><p>
          <p><input type="submit">
        </form>
      `;
    }

    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>게시물 작성</title>
        <link rel="stylesheet" href="css/commen.css">
      </head>
      <body>
        <div id="myMenu">
          <div class="h-container">
            <div class="item middle">
              <form action="/${back}" method="get">
                <input type="submit" value="돌아가기">
              </form>
            </div>
            <div class="item middle">menu2</div>
            <div class="item middle">menu3</div>
            <div class="item last">login</div>
          </div>
        </div>
        <section>
            ${form}
          <script src="js/html_functions.js"></script>
        </section>
      </body>
    </html>
    `;
  },

  GetFormatDate:function(date) {
    var year = date.getFullYear();              //yyyy
    var month = (1 + date.getMonth());          //M
    month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
    var day = date.getDate();                   //d
    day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
    return  year + '-' + month + '-' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
  }
}