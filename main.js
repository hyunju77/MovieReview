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
        table += `<td>` + rows[count].post_id + `</td>`
        if (rows[count].post == null) {
          table += `<td><a href="/post_id=` + rows[count].post_id + `">"` + rows[count].movie + `"에 대한 리뷰</a></td>`
        } else {
          table += `<td><a href="/post_id=` + rows[count].post_id + `">` + rows[count].post + `[` + rows[count].movie + `]</a></td>`
        }
        table += `<td>` + rows[count].author + `</td>`
        if (rows[count].modifydate == null) {
          table += `<td>` + rows[count].createdate + `</td>`
        } else {
          table += `<td>` + rows[count].createdate + `(` + rows[count].modifydate + `)</td>`
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
                      <div class="item middle">menu 1</div>
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

        var html = template.HTML("영화 리뷰 사이트", rows[0].title, rows[0].createdate, rows[0].modifydate, rows[0].description);
        response.send(html);
      });
    });
});



app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

/*
var express = require('express');
var path = require('path');
var app = express();
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./html/js/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');

db.connect();
app.use(express.static('html'));

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        db.query('SELECT * FROM topic', function(error, topics){
          console.log(topics);
          var list = template.list(topics);
          var Dhtml = template.HTML("Main", list, ``, ``);
           response.writeHead(200);
           response.end(Dhtml);
        })
      } else {
        db.query(`SELECT * FROM topic`, function(error,topics){
          if(error){
            throw error;
          }
          db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[queryData.id], function(error2, topic){
            if(error2){
              throw error2;
            }
            console.log(topic);
           var title = topic[0].title;
           var description = topic[0].description;
           var list = template.list(topics);
           var Dhtml = template.HTML(title, list,
             `<h2>${title}</h2>
             ${description}
             <p>$by ${topic[0].name}</p>
             `,
             ` <a href="/create">create</a>
                 <a href="/update?id=${queryData.id}">update</a>
                 <form action="delete_process" method="post">
                   <input type="hidden" name="id" value="${queryData.id}">
                   <input type="submit" value="delete">
                 </form>`
           );
           response.writeHead(200);
           response.end(Dhtml);
          })
       });
       }
    } else if(pathname === '/create'){
      db.query(`SELECT * FROM topic`, function(error,topics){
        db.query('SELECT * FROM author', function(error2, authors){
          var title = 'Create';
          var list = template.list(topics);
          var Dhtml = template.HTML(title, list,
            `
            <form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                ${template.authorSelect(authors)}
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(Dhtml);
        });
      });
    } else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query('INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)',
            [post.title, post.description, 1],
            function(error, result){
              if(error){
                throw error;
              }
              response.writeHead(302, {Location: `/?id=${result.insertId}`});
              response.end();
            }
          )
      });
    } else if(pathname === '/update'){
      // fs.readdir('./data', function(error, filelist
      db.query('SELECT * FROM topic', function(error, topics){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic){
          if(error2){
            throw error2;
          }
          console.log(topics);
          var list = template.list(topics);
          var Dhtml = template.HTML(topic[0].title, list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${topic[0].id}">
              <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
              <p>
                <textarea name="description" placeholder="description">${topic[0].description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update?id=${topics[0].title}">update</a>
            `
          );
          response.writeHead(200);
          response.end(Dhtml);
        });
      })
    } else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query('UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?', [post.title, post.description, post.id], function(error, result){
            response.writeHead(302, {Location: `/?id=${post.id}`});
            response.end();
          })
      });
    } else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query('DELETE FROM topic WHERE id=?', [post.id], function(error, result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/`});
            response.end();
          })
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
*/