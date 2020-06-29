//날짜 유효성 검사
function is_not_date(d) {
    var re = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    //         yyyy -       MM      -       dd           
    if (re.test(d))
        return false;
    return true;
}

//게시물 수정, 저장 전 유효성 검사
function data_integrity() {
    var data = document.post_editer
    if(data.edit_title.value.length > 255) {
        alert("제목의 길이가 초과됬습니다!\n(최대 255자)");
        return false;
    }
    if(data.edit_description.value.length == 0) {
        alert("내용을 입력해주십시오.");
        return false;
    }
    if(data.edit_description.value.length > 65535) {
        alert("내용이 너무 깁니다.\n(최대 65535자)");
        return false;
    }
    return true;
}

      