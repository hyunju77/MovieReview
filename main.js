const express = require('express');
const app = express();
const fs = require('fs');
const mysql = require('mysql');
const hostinfo = require(`./gitignore/port.json`);
const sqlserver = require(`./gitignore/sqlinfo.json`);
const template = require('./html/js/template.js');

const sanitizeHtml = require('sanitize-html');
const url = require('url');
const path = require('path');
const http = require('http');
const qs = require('querystring');

var port = hostinfo.port;
var database = mysql.createConnection({
  host     : sqlserver.host,
  user     : sqlserver.user,
  password : sqlserver.password,
  database : sqlserver.database
});

database.connect();

app.use(express.static('html'));

{//메인페이지
app.get('/', function(request, response) {                          //라우팅
  fs.readdir(`./data`, function(error, FileList) {
    //                      post 테이블의 제목, 작성일, 수정일, user_id를 대입하여 users 테이블의 닉네임, movie_id를 대입하여 movies 테이블의 영화이름 을 가져온다.
    var sql = `SELECT a.post_id, a.title AS post, c.name AS movie, b.nickname AS author, date_format(a.createdate, "%Y-%m-%d") AS createdate, date_format(a.modifydate, "%Y-%m-%d") AS modifydate
                FROM posts AS a
                JOIN users AS b ON b.user_id = a.user_id
                JOIN movies AS c ON c.movie_id = a.movie_id;`;
    database.query(sql, function(error, rows) {

      var table = ""
      for(var count in rows) {
        var numbering = new Number(count);
        table += `<tr><td>` + (numbering+1) + `</td>`
        if (rows[count].post == " ") {
          table += `<td><a href="/post_id=` + rows[count].post_id + `">"` + rows[count].movie + `"에 대한 리뷰</a></td>`
        } else {
          table += `<td><a href="/post_id=` + rows[count].post_id + `">` + rows[count].post + `[` + rows[count].movie + `]</a></td>`
        }
        table += `<td>` + rows[count].author + `</td>`
        if (rows[count].modifydate == null) {
          table += `<td>` + rows[count].createdate + `</td>`
        } else {
          table += `<td>` + rows[count].createdate + `(` + rows[count].modifydate + `)</td></tr>`
        }
      }
      
      var html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
                <title>영화 리뷰 사이트</title>
                <style>
                  body {background-color: azure;}
                  #warapper {display: table; width: 100%;}
                </style>
                <script src="js/jquery-3.5.1.min.js"></script>
                <link rel="stylesheet" href="css/commen.css">
                <link rel="stylesheet" href="css/post_list.css">
          </head>
          <body id="main">
              <header>
                 pagetitle
              </header>
              <div id="myMenu">
                  <div class="h-container">
                      <div class="item middle"><a href="/post_create">리뷰 등록</a></div>
                      <div class="item middle">
                        <form action="/movie_registration" method="post">
                          <input type="submit" value="영화 등록">
                        </form>
                      </div>
                      <div class="item middle">menu 3</div>
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
              <section id="mySection">
                <table border = 1 id="post_list">
                  <thead>
                    <tr>
                      <th>번호</th>
                      <th>제목[영화이름]</th>
                      <th>게시자</th>
                      <th>게시일</th>
                    </tr>
                  </thead>
                  <tbody>
                    ` + table + `
                  </tbody>
                </table>
              </section>
            </body>
        </html>
      `;
      response.send(html);
    });
  });
});
}

{//포스트 열람 (Read)
app.get(`/post_id=` + `:postId`, function(request, response) {
  fs.readdir(`./data`, function(error, filelist) {
    var filteredId = path.parse(request.params.postId).base;
    var sql = `SELECT a.title, c.name, a.description, b.nickname, date_format(a.createdate, "%Y-%m-%d") AS createdate, date_format(a.modifydate, "%Y-%m-%d") AS modifydate
                FROM posts AS a
                JOIN users AS b ON b.user_id = a.user_id
                JOIN movies AS c ON c.movie_id = a.movie_id
                WHERE post_id = ${filteredId};`;
    database.query(sql, function(error, rows) {
      var post_data = rows[0];
      post_data.post_id = filteredId;
      var sql = `SELECT b.nickname, a.description, a.score, date_format(a.createdate, "%Y-%m-%d") AS createdate, a.comment_id, a.post_id
                  FROM comments AS a
                  JOIN users AS b
                  ON a.user_id = b.user_id
                  WHERE a.post_id = ${post_data.post_id};`
      database.query(sql, function(error, rows){
        var comment = new Array();
        for(var count in rows) {
          comment[count] = rows[count];
        }

        var comment_table = ""
        for(var count in comment) {
          comment_table += `
            <tr>
              <td>${comment[count].nickname}</td>
              <td id="${comment[count].comment_id}">${comment[count].description}</td>
              <td>${comment[count].score}</td>
              <td>${comment[count].createdate}</td>
              <td id="${comment[count].comment_id}_edit" >
                <input type="button" value="수정" onclick="comment_edit(${comment[count].comment_id}, ${comment[count].post_id})">
              </td>
              <td>
                <form action="/comment_delete_process" method="post" onsubmit="return recheck(2)">
                  <input type="hidden" name="post_id" value="${comment[count].post_id}">
                  <input type="hidden" name="comment_id" value="${comment[count].comment_id}">
                  <input type="submit" value="삭제">
                </form>
              </td>
            </tr>
          `
        }            

        var html = template.Post_Reader_HTML("영화 리뷰 사이트", post_data, comment_table);
        response.send(html);
      });
    });
  });
});
}

{//포스트 등록 화면 (Create)
app.get(`/post_create`, function(request, response) {
  var sql = `SELECT name FROM movies`
  database.query(sql, function(error, rows) {
    if(error) {
      throw error;
    }
    
    var movies = `<select name="movie_name">`;
    for(var count in rows) {
      movies += `<option value="${count}">${rows[count].name}</option>`;
    }
    movies += `</selcet>`

    var html = template.Editer_HTML(movies);

    response.send(html);
  });
});
}

{//포스트 등록 프로세서
app.post(`/post_create_process`, function(request, response) {
  var body = ""
  request.on('data', function(data){
    body = body + data;
  });
  request.on(`end`, function() {
    var edit = qs.parse(body);
    var title = edit.edit_title;
    var movie = new Number(edit.movie_name);
    var description = edit.edit_description;
    var nickname = edit.user_nickname;
    var user_id;

    var movie_id =  movie + 1;    
    var date = new Date();
    var createdate = template.GetFormatDate(date);

    sql = `SELECT user_id FROM users WHERE nickname = "${nickname}";`;
    database.query(sql, function(error, rows) {
      user_id = rows[0].user_id;

      var sql = "INSERT INTO `moviereview`.`posts` (`title`, `description`, `createdate`, `user_id`, `movie_id`) VALUES ('" + title + "', '" + description + "', '" + createdate + "', '" + user_id + "', '" + movie_id + "');"

      database.query(sql, function(error, result){
        if(error) {
          throw error;
        }
        response.writeHead(302, {Location: `/post_id=${result.insertId}`});
        response.end();
      })
    });
  });
});
}

{//포스트 수정 화면 (Update)
app.post(`/post_update`, function(request, response) {
  var body = ""
  request.on('data', function(data){
    body = body + data;
  });
  request.on(`end`, function() {
    var post = qs.parse(body);
    var post_id = post.id;

    sql = `SELECT * FROM posts WHERE post_id = ${post_id}`;    
    database.query(sql, function(error, rows) {
      var post_data = rows[0];
      post_data.movie_id = new Number(post_data.movie_id);
      post_data.movie_id -= 1;

      sql = `SELECT nickname FROM users WHERE user_id = ${post_data.user_id}`
      database.query(sql, function(error, rows) {
        post_data.nickname = rows[0].nickname;

        sql = `SELECT name FROM movies`
        database.query(sql, function(error, rows) {
          var movies = `<select name="movie_name" value="${post_data.movie_id}">`;
          for(var count in rows) {
            movies += `<option value="${count}">${rows[count].name}</option>`;
          }
          movies += `</selcet>`
      
          var html = template.Editer_HTML(movies, post_data);
          
          response.send(html);
        });
      });
    });
  });
});
}

{//포스터 수정 프로세서
app.post(`/post_update_process`, function(request, response) {
  var body = ""
  request.on('data', function(data){
    body = body + data;
  });
  request.on(`end`, function() {
    var edit = qs.parse(body);
    var title = edit.edit_title;
    var movie = new Number(edit.movie_name);
    var description = edit.edit_description;
    var nickname = edit.user_nickname;
    var post_id = edit.post_id;

    var movie_id =  movie + 1;    
    var date = new Date();
    var modifydate = template.GetFormatDate(date);

    sql = `SELECT user_id FROM users WHERE nickname = "${nickname}";`;
    database.query(sql, function(error, rows) {
      var user_id = rows[0].user_id;

      var sql = `UPDATE posts SET title='${title}', description='${description}', modifydate='${modifydate}', user_id='${user_id}', movie_id='${movie_id}' WHERE post_id = ${post_id};`

      database.query(sql, function(error, result){
        if(error) {
          throw error;
        }
        response.writeHead(302, {Location: `/post_id=${post_id}`});
        response.end();
      })
    });
  });
});
}

{//포스트 삭제 (Delete)
app.post(`/post_delete_process`, function(request, response) {
  var body = ""
  request.on('data', function(data){
    body = body + data;
  });
  request.on(`end`, function() {
    var post = qs.parse(body);
    var filteredId = post.id;
    database.query('DELETE FROM posts WHERE post_id = ?', [filteredId], function(error, result){
      if(error) {
        throw error;
      }
      fs.unlink(`post_id=${filteredId}`, function(error) {
        response.writeHead(302, {Location: `/`});
        response.end();
      });
    });
  });    
});
}

{//댓글 추가
app.post(`/comment_create_process`, function(request, response) {
  var body = ""
  request.on('data', function(data){
    body = body + data;
  });
  request.on(`end`, function() {
    var edit = qs.parse(body);
    var date = new Date();
    edit.createdate = template.GetFormatDate(date);
    var sql = `INSERT INTO comments VALUES (NUll, '${edit.description}', '${edit.score}', '${edit.createdate}', '${edit.user_id}', '${edit.post_id}');`
    database.query(sql, function(error, result){
      if(error) {
        throw error;
      }
      response.writeHead(302, {Location: `/post_id=${edit.post_id}`});
      response.end();
    });
  });
});
}

{//댓글 수정
  app.post(`/comment_update_process`, function(request, response) {
    var body = ""
    request.on('data', function(data){
      body = body + data;
    });
    request.on(`end`, function() {
      var edit = qs.parse(body);
      var sql = `UPDATE comments SET description='${edit.description}' WHERE comment_id = ${edit.comment_id}`
      database.query(sql, function(error, result){
        if(error) {
          throw error;
        }
        response.writeHead(302, {Location: `/post_id=${edit.post_id}`});
        response.end();
      });
    });
  });
  }

{//댓글 삭제
app.post(`/comment_delete_process`, function(request, response) {
  var body = ""
  request.on('data', function(data){
    body = body + data;
  });
  request.on(`end`, function() {
    var edit = qs.parse(body);
    database.query('DELETE FROM comments WHERE comment_id = ?', [edit.comment_id], function(error, result){
      if(error) {
        throw error;
      }
      response.writeHead(302, {Location: `/post_id=${edit.post_id}`});
      response.end();
    });
  });
});
}

app.listen(port, () => console.log(`listening at http://localhost:${port}`));