@Service ("boardService")
public class BoardServiceImpl implements BoardService {
    
    @Resource (name="boardMapper")
    private BoardMapper boardMapper;

    @Override
    public List<EgovMap> selectBoardList () throws Exception {
        return boardMapper.selectBoardList ();
    }
