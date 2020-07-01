module.exports = {
  Post_Reader_HTML:function(title, post_data, comment_data) {
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
              <link rel="stylesheet" href="css/common.css">
          </head>
          <body>
              <table id="table_body" >
                  <tr id="header">
                      <td colspan="3">
                          웹페이지 타이틀 + 로고
                      </td>
                  </tr>
                  <tr>
                      <td colspan="3" class="top_menu">
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
                      </td>
                  </tr>
                  <tr>
                      <td id="navigation" class="sideline">
                          <ul>
                              <strong>장르별</strong>
                              <li><a href="">드라마</a></li>
                              <li><a href="">액션</a></li>
                          </ul>
                          <ul>
                              <strong>연도별</strong>
                              <li><a href="">(1990~2000)</a></li>
                              <li><a href="">(2000~2010)</a></li>
                              <li><a href="">(2010~2020)</a></li>
                          </ul>
                      </td>
                      <td id="middle_side" class="sideline">
                          <h3>${post_data.title}</h3>
                          ${create_modify_date}
                          <hr size="1" color="grey">
                          ${post_data.description}
                          <br><br><br>
                          <hr size="10" color="grey">
                          <br><br><br>
                          <div>
                            <form name="comment_creater" action="/comment_create_process" method="post" onsubmit="return comment_data_intergrity(creater)">
                              <input type="hidden" name="post_id" value="${post_data.post_id}">
                              <input type="hidden" name="user_id" value="1">
                              <input type="hidden" name="score" value="5">
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
                            <table border = 1 class="comments">
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
                      </td>
                      <td id="right_side" class="sideline">
                          <div class="movie">
                              <h2 id="right_side_title">영화목록</h2>
                              <ul>
                                  <li data-url="move1.html">라스트 데이스 아오브아</li>
                                  <li data-url="move2.html">영화이름2(개봉년도)</li>
                              </ul>
                          <div id="left_right_button">
                              <button class="go_left"> << </button>
                              &emsp;&ensp;6/1&ensp;&emsp;
                              <button class="go_right"> >> </button>
                          </div>
                      </td>
                  </tr>
              </table>
              <script src="js/html_functions.js"></script>
          </body>
      </html>
    `
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
        <link rel="stylesheet" href="css/common.css">
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

$(document).ready(function(){
  $("#description_box").load("movie1.html");
});
