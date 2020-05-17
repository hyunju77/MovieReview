@Controller
public class BoardController {
    @Resource (name="boardService")
    private BoardService boardService;

    @RequestMapping (value="/boardList.do")
    public String boardList (ModelMap model) throws Exception {
        List<EgovMap> boardList=null;
        try {
            boardList = boardService.selectBoardList ();
        } catch (Excption e) {
            e.printStackTrace ();
        }
        model.addAttribute ("boardList", boardList);

        return "board/boardList.tiles";
    }

    @RequestMapping (value="/boardDetail.do")
    public String boardDetail (HttpServletRequest request, ModelMap model) throws Exception {
        String boardno = request.getParameter("boardno");
        //getParameter로 jsp 화면에서 만든 boardno를 가져와 String 형태의 boardno에 저장
        int boardnoInt = Integer.parseInt(boardno);
        //String 형태로 가져오기 때문에 Int 형으로
        BoardVO boardVO = new BoardVO();
        try {
            boardVO = boardService.detailBoard(boardnoInt);
            //DB에서 값들을 가져와 boardVO에 저장
        } catch (Exception e) {
            e.printStackTrace();
    }
    model.addAttribute("boardVO", boardVO);
    return "board/boardDetail.tiles";
}

}




