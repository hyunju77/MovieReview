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
        table += `<tr><td>` + rows[count].post_id + `</td>`
        if (rows[count].post == null) {
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
                      <div class="item middle"><a href="/create">리뷰 등록</a></div>
                      <div class="item middle">menu 2</div>
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

app.get(`/post_id=` + `:postId`, function(request, response) {
    fs.readdir(`./data`, function(error, filelist) {
      var filteredId = path.parse(request.params.postId).base;
      var sql = `SELECT a.title, c.name, a.description, b.nickname, date_format(a.createdate, "%Y-%m-%d") AS createdate, date_format(a.modifydate, "%Y-%m-%d") AS modifydate
                  FROM posts AS a
                  JOIN users AS b ON b.user_id = a.user_id
                  JOIN movies AS c ON c.movie_id = a.movie_id
                  WHERE post_id = ${filteredId}`;
      database.query(sql, function(error, rows) {
        var html = template.HTML("영화 리뷰 사이트", rows[0].title, rows[0].createdate, rows[0].modifydate, rows[0].description, `
          <form action="/delete_process" method="post">
            <input type="hidden" name="id" value="${filteredId}">
            <input type="submit" value="delete">
          </form>
        `);
        response.send(html);
      });
    });
});

app.post(`/delete_process`, function(request, response) {
  var body = ""
  request.on('data', function(data){
    body = body + data;
  });
  request.on(`end`, function() {
    var post = qs.parse(body);
    var filteredId = post.id;
    var post = qs.parse(body);
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

app.get(`/create`, function(request, response) {
  var sql = `SELECT name FROM movies`
  database.query(sql, function(error, rows) {
    if(error) {
      throw error;
    }
    
    var movies = "<select>";
    for(var count in rows) {
      movies += `<option value="${count}">${rows[count].name}</option>`;
    }
    movies += `</selcet>`

    var html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>게시물 작성</title>
      </head>
      <body>
        <form name="post_editer" action="/crafte_process" method="post" onsubmit="return data_integrity()">
            <p><input type="text" id="edit_title" name="edit_title" placeholder = "제목(생략가능)"></input></p>
            영화 제목 : ${movies}<input type="hidden">
            <p><textarea id="edit_description" name="edit_description" placeholder = "내용"></textarea><p>
            <p><input type="submit"><input type="button" onclick="console.log(data_integrity())"></P>
        </form>
        <script src="js/data_integrity.js"></script>
      </body>
    </html>
    `;
    
    response.send(html);
  });
});

app.post(`/create_process`, function(request, response) {

});

app.listen(port, () => console.log(`listening at http://localhost:${port}`));