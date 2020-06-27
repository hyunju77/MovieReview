/* DAO ( Data Access Object) : 데이터 접근 객체
Service : 컨트롤러(서블릿)의 요청사항을 DAO에 전달 */

//DAO 작성

package com.myp.persistence;

import java.util.List;
import com.myp.domain.BoardVO;

public interface BoardDAO {
    public void create(BoardVO vo) throws Exception;
    public BoardVO read(Intefer bno) throws Exception;
    public void update(BoardVO vo) throws Exception;
    public void delete(Integer bno)throws Exception;
    public List<BoardVO> listAll() throws Exception;
}


//Service 작성

package com.myp.service;

import java.util.List;
import com.myp.domain.BoardVO;

public interface BoardService {
    public void regist(BoardVO board) throws Exception;
    public BoardVO read(Intefer bno) throws Exception;
    public void modify(BoardVO board) throws Exception;
    public void remove(Integer bno)throws Exception;
    public List<BoardVO> listAll() throws Exception;
}

//게시판 목록페이지 구현
/*  */

@Controller 

@RequestMapping(value = "/") 

public class BoardContoller {
    @Autowired  

    private BoardService service;   //service 호출을 위한 객체생성

    @RequestMapping(value="/listAll", mothod = RequestMethod.GET)   //주소 호출 명시
    public void listAll(Model model) throws Exception {
        model.adAttribute("list",service.listAll());
    }
}

//글쓰기 구현

@RequestMapping(value = "/regist", method = RequestMethod.GET)  //GET방식 페이지 호출
public void registerGET(BoardVO board, Model model)throws Exception {

}


@RequestMapping(value = "/regist", method = RequestMethod.POST) //POST방식 내용 전송
public String registPOST(BoardVO board, RedirectAttributes rttr) throws Excecption {
    service.regist(board);  // 글 작성 서비스 호출
    return "redirect:/listAll";     // 작성 완료 후, 목록 페이지로 리턴
}

// 글 읽기 구현

@RequestMapping(value = "/read", method = RequestMethod.GET)    //GET 방식으로 페이지 호출
public void read(@RequestParam("bno")int bno, Model model) throws Exception {
    //인자값은 파라미터 값, 글번호를 기준으로 Model을 사용하여 불러옴
    model.addAttribute(service.read(bno));      //read 서비스 호출
}

// 글 수정, 삭제 구현

@RequestMapping(value = "/modify", method = RequestMethod.GET)
public void modifyGET(int bno, Model model) throws Exception {
    model.addAttribute(service.read(bno));  //수정을 위한 글 읽기 서비스 호출
}

@RequestMapping(value = "/modify", method = RequestMethod.POST)
public String modifyPOST(BoardVO board, RedirectAttributes rttr) throws Exception {
    service.modify(board);
    return "redirect:/listAll";     // 수정 완료 후, 목록페이지로 리턴
}

// 글 삭제 구현

@RequestMapping (value = "/remove", method = RequestMethod.POST)
public String removePOST(@RequestParam("bno") int bno, RedirectAttributes rttr) throws Exception {
    wervice.remove(bno);
    return "redirect:/listAll";
}



