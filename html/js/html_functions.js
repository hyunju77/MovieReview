//날짜 유효성 검사
function is_not_date(d) {
    var re = /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
    //         yyyy -       MM      -       dd           
    if (re.test(d))
        return false;
    return true;
}

//게시물 수정, 저장 전 유효성 검사
function post_data_integrity() {
    var data = document.post_editer
    if(data.edit_title.value.length > 255) {
        alert("제목의 길이가 초과됬습니다!\n(최대 255자)");
        return false;
    }
    if(data.edit_title.value.length == 0) {
        data.edit_title.value = " ";
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

//댓글 내용 유효성 검사
function comment_data_intergrity(mod) {
    if(mod == "creater") {
        var data = document.comment_creater;    
    } else if(mod == "editer") {
        var data = document.comment_editer;
    }
    if(data.description.value.length == 0) {
        alert("내용을 입력해 주시오.");
        data.description.focus();
        return false;
    }
    if(data.description.value.length > 255) {
        alert("댓글 길이가 초과했습니다.\n(최대 255자)");
        data.description.focus();
        return false;
    }

    var score = $('.starR1.on').length + $('.starR2.on').length
    data.score.value = score;
    return true;
}

//포스트 별점 주기
$('.starRev span').click(function(){
    $(this).parent().children('span').removeClass('on');
    $(this).addClass('on').prevAll('span').addClass('on');
    return false;
  });

//댓글 수정을 위한 텍스트박스 제공
function comment_edit(comment_id, post_id) {
    var target = document.getElementById(comment_id);
    var original = target.innerHTML;
    target.innerHTML = `
        <form name="comment_editer" action="/comment_update_process" method="post" onsubmit="return comment_data_intergrity(editer)">
            <input type="hidden" name="comment_id" value="${comment_id}">
            <input type="hidden" name="post_id" value="${post_id}">
            <input type="text" name="description" placeholder="댓글 입력" value="${original}">
            <input type="submit" value="수정">
        </form>
    `;
    document.getElementById(`${comment_id}_edit`).innerHTML = `
        <input type="button" value="취소" onclick='comment_edit_cancel(${comment_id}, "${original}", ${post_id})'>
    `;
}

//댓글 수정 취소
function comment_edit_cancel(comment_id, original, post_id) {
    document.getElementById(`${comment_id}`).innerHTML = original;
    document.getElementById(`${comment_id}_edit`).innerHTML = `
        <input type="button" value="수정" onclick="comment_edit(${comment_id}, ${post_id})">
    `;
}



  //삭제 확인 스크립트
function recheck(target) {
    if(target == 1) {
        target = "게시물";
    } else if(target = 2) {
        target = "댓글";
    }
    if(confirm(`이 ${target}을 삭제하시겠습니까?\n삭제된 ${target}의 내용은 복구할 수 없습니다.`)) {
        return true;
    } else {
        return false;
    }
}

/*사진이나 제목 클릭 → 해당 페이지 불러오기*/
$(".movie li").click(function{
    var _this =$(this);     //선택한 li의 url을 찾는다
    var liurl =_this.data("url");       
    $(".notebook").html();      //새로운 내용 갱신
    $.ajax({        //http 요청 전송
        type : 'post'       
        url : liurl,        
        dataType : 'html',  
        success : function(data) {
            $(".notebook").html(data);
        }
    });
});

//div 안에 페이지 불러오기 
$(document).ready(function(){

    $("#div1").load("가져올페이지");

});


