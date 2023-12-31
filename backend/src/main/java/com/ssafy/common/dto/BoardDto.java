package com.ssafy.common.dto;

import com.ssafy.common.entity.Board;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor (access = AccessLevel.PROTECTED)
@Builder
public class BoardDto {
    private String question;
    private String leftAnswer;
    private String rightAnswer;
    private String ip;
    private String nickname;
    private String password;
    private Integer likeCount;
    private Integer isDeleted;
    private LocalDateTime deletedDate;
    private LocalDateTime createdDate;
    private LocalDateTime lastmodifiedDate;
    private String category;

    public Board toEntity() {
        Board board = Board.builder()
                .question(question)
                .leftAnswer(leftAnswer)
                .rightAnswer(rightAnswer)
                .ip(ip)
                .nickname(nickname)
                .password(password)
                .likeCount(likeCount)
                .isDeleted(isDeleted)
                .createdDate(createdDate)
                .deletedDate(deletedDate)
                .lastModifiedDate(lastmodifiedDate)
                .build();
        return board;
    }

}
