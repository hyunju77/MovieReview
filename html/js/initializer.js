//변수 선언, 초기값 입력, 페이지 로드 시 명령 호출 관련

var user_info = new Array();    //유저 정보 저장    [아이디, 비밀번호, 닉네임, 이메일]
var movie_info = new Array();   //영화 정보 저장    [제목, 장르, 개봉연도]
var post = new Array();         //포스터 정보 저장  [제목, 영화제목, 게시자, 게시일, 포스트내용]
var is_login = false;           //로그인 상태


//관리자 계정 추가
user_info.push(["master", "master", "개발자", "master@gmail.com", 0]);

//더미 포스트 데이터
post.push(["제목", "영화제목", "닉네임", "날짜", "포스트내용"]);

//로드 후 초기 페이지
list_displayer();                 //게시물 리스트 표시
menu_able_display(is_login);      //로그인 상태에 따른 메뉴 비/활성화 상태 표시(글자색 바꿈)
