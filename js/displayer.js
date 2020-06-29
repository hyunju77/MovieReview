//Section(주내용) 부분의 동적화 담당

//로그인 상태에 따른 메뉴 비/활성화 상태 표시(글자색 바꿈)
function menu_able_display(is_login) {
    if(is_login == true) {
        $(function(){
            $(".item.middle").css("color", "#ffffff");
        });
    } else {
        $(function(){
            $(".item.middle").css("color", "#aaaaaa");
        });
    }
}

//게시물 리스트 표시
function list_displayer() {
    document.getElementById("mySection").innerHTML = `
    <table border = 1>
        <thead>
            <tr>
                <th>번호</th>
                <th>제목(영화이름)</th>
                <th>게시자</th>
                <th>게시일</th>
            </tr>
        </thead>
        <tbody id="post_list">
        </tbody>
    </table>
    `;

    var target_list = document.getElementById("post_list");

    for(i in post) {
        var post_number = Number(i) + 1;
        target_list.innerHTML = target_list.innerHTML + `
        <tr>
            <td>` + post_number + `</td>
            <td><a>` + post[i][0] + `(` + post[i][1] + `)</a></td>
            <td>` + post[i][2] + `</td>
            <td>` + post[i][3] + `</td>
        </tr>`;
    }
}

function post_displayer() {

}