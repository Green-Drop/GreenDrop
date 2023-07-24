package com.ssafy.common.controller;

import com.ssafy.common.dto.BoardDto;
import com.ssafy.common.dto.response.BoardResponseDto;
import com.ssafy.common.security.UserIp;
import com.ssafy.common.service.BoardService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/board")
@RestController
public class BoardController {

    private final BoardService boardService;
    private final UserIp userIp;

    @PostMapping("/regist")
    public ResponseEntity<Object> registBoard(
            @RequestBody BoardDto boardDto,
            HttpServletRequest request
    ){
        String ipAdress = userIp.searchIP(request);
        boardService.saveBoard(boardDto,ipAdress);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/detail/{boardNo}")
    public ResponseEntity<BoardResponseDto> detailBoardPage(@PathVariable Long boardNo){
        BoardResponseDto boardResponseDto  = boardService.detailBoardPage(boardNo);

        return new ResponseEntity<>(boardResponseDto,HttpStatus.OK);
    }

    @PostMapping("/modify/{boardNo}")
    public ResponseEntity<Object> checkUserPassword(
            @PathVariable Long boardNo,
            @RequestBody String password,
            HttpServletRequest request
    ) {

        JSONObject parser = new JSONObject(password);
        Boolean userCheck =
            boardService.checkPasswordUser(boardNo,parser.getString("password"),userIp.searchIP(request));

        if(!userCheck) {
            //TODO : 비밀번호 불일치 시 Error 처리 예정 -> Service단으로 Custom Error class 생성 후 이동예정
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/delete/{boardNo}")
    public ResponseEntity<Object> deleteYesBoard(
            @PathVariable Long boardNo
    ){
        boardService.deleteYesBoard(boardNo);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PatchMapping("/modify/{boardNo}")
    public ResponseEntity<Object> modifyBoard(@PathVariable Long boardNo, @RequestBody BoardDto boardDto){

        boardService.modifyBoard(boardNo,boardDto);

        return new ResponseEntity<>(HttpStatus.OK);
    }


}
