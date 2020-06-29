module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
        <title>${title}</title>
        <style>
            body {background-color: azure;}
        </style>
        <script src="./html/js/jquery-3.5.1.min.js"></script>
        <link rel="stylesheet" href="./html/css/title_header.css">
        <link rel="stylesheet" href="./html/css/menu_bar.css">
        <link rel="stylesheet" href="./html/css/nav.css">
        <link rel="stylesheet" href="./html/css/display_main.css">

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
          ${list}
          ${control}
          ${body}
        </section>
        
        <script src="./html/js/displayer.js"></script>
        <script src="./html/js/initializer.js"></script>
        <script src=""></script>
        <script src=""></script>
    </body>
</html>
    `;
  },list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },authorSelect:function(authors){
    var tag = '';
    var i = 0;
    while(i < authors.length){
      tag += `<option value="${authors[i].id}">${authors[i].name}</option>`;
      i++;
    }
    return `
    <select name="author">
      ${tag}
    </select>
    `
  }
}