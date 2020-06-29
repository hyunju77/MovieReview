module.exports = {
  HTML:function(title, sectiontitle, createdate, modifydate, body, control) {
    if(modifydate == null){
      var create_modify_date = `<h5>게시일 : ${createdate}</h5>`;
    } else {
      var create_modify_date = `<h5>게시일 : ${createdate} (수정됨 : ${modifydate})</h5>`;
    }

    if(!control) {
      control = "";
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
        <nav id="wrapper">
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
            <h3>${sectiontitle}</h3>
            ${create_modify_date}
            ${body}
            ${control}
          </section>
        </nav>
    </body>
</html>
    `;
  }
}