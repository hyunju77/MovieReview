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
}