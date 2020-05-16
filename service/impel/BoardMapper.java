@Mapper ("boardMapper")
public interface BoardMapper {
    List<EgovMap> selectBoardList () throws Exception;
}