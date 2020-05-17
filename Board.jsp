<html>
    <head>
        <title>영화 리뷰 게시판</title>
        <meta charset="utf-8">
        <!--중앙 홈페이지-->
        <style>

        </style>
    </head>
    <body>
        <select id="selectBoard" resultType="egovMap">
            SELECT  boardno,
                    title,
                    content,
                    writer,
                    TO_CHAR (createdate, 'YYYY-MM-DD HH24:MI') as createdate
            FROM    blogboard
        </select>
        <thead class="text-center">
            <td>번호</td>
            <td>글 제목</td>
            <td>글쓴이</td>
            <td>작성일</td>
        </thead>
        <script>
            $(function(){
                $(".rowClick").click(function()  {
                    alert($(this).children().eq(0).text());
                    var boardno = $(this).children().eq(0).text();

                    location.href="boardDetail.do?boardno=" + boardno;
                })
            })
        </script>
        <tbody class="text-center">
            <c:forEach items = "${board}" var="board">
                <tr>
                    <td><c:out value="${board.boardno"></c:out></td>
                    <td class="text-center">
                        <c:out value="${board.title"></c:out>
                    </td>
                    <td><c:out value="${board.writer"></c:out></td>
                    <td><c:out value="${board.createdate"></c:out></td>
                </tr> <!--</c:out> ?-->
            </c:forEach>
            </tbody>

    </body>
</html>