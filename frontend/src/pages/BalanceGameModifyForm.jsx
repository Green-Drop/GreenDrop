import axios from "axios";
import classes from "./BalanceGameModifyForm.module.css";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BalanceGameCheckModal from "../components/BalanceGame/BalanceGameCheckModal";
import { useDispatch } from "react-redux";
import { getCategoryList } from "../store";
import backImg from "../assets/back.png";
import deviceImg from "../assets/device (1).png";

function BalanceGameModifyFormPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  // const boardSeq = StateParams.get("boardSeq") || "Default Value";
  const boardSeq = location.state.boardSeq || "Default Value";
  const categories = useSelector((state) => {
    return state.categories;
  });

  const [tempCategorie, setTempCategorie] = useState();

  // 로직
  useEffect(() => {
    axios

      .get("https://i9b103.p.ssafy.io/api/category/list")
      .then((response) => {
        // console.log(...response.data);
        const fetchedCategories = [...response.data];
        dispatch(getCategoryList(fetchedCategories));
        setCategory(fetchedCategories[0].item);
      });
  }, [dispatch]);
  const [newCard, setNewCard] = useState("");

  const navigate = useNavigate();
  const [showCheckModal, setShowCheckModal] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState("");

  useEffect(() => {
    axios

      .get("https://i9b103.p.ssafy.io/api/board/detail/" + boardSeq)
      .then((response) => {
        setQuestion(response.data.question);
        setLeftAnswer(response.data.leftAnswer);
        setRightAnswer(response.data.rightAnswer);
        setCategory(response.data.item);
        setNickname(response.data.nickname);

        setTempCategorie(response.data.item);
      })

      .catch((error) => {
        console.log(error);
      });
  }, [boardSeq]);

  const [question, setQuestion] = useState("");
  const [leftAnswer, setLeftAnswer] = useState("");
  const [rightAnswer, setRightAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [nickname, setNickname] = useState("");
  useEffect(() => {
    const updatedCard = {
      question: question,
      leftAnswer: leftAnswer,
      rightAnswer: rightAnswer,
      category: tempCategorie,
    };

    setNewCard(updatedCard);
  }, [question, leftAnswer, rightAnswer, tempCategorie]);

  const handleModifyCard = () => {
    // const updatedCard = {
    //     question: question,
    //     leftAnswer: leftAnswer,
    //     rightAnswer: rightAnswer,
    //     category: category,
    //   };

    //   setNewCard(updatedCard);
    if (leftAnswer.length === 0 || rightAnswer.length === 0) {
      setShowCheckModal({
        title: "글 수정 실패",
        category: "board",
        type: "confirm",
        action: "수정하기",
      });
      setConfirm(true);
      setConfirmModalData({
        confirmTitle: "밸런스 게임을 작성해 주세요",
        confirmCategory: "board",
        confirmType: "modify",
        confirmAction: "실패",
      });
    } else {
      console.log("수정할 카드", newCard);
      axios
        .patch(
          "https://i9b103.p.ssafy.io/api/board/modify/" + boardSeq,
          JSON.stringify(newCard),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(() => {
          console.log("수정완료");
          setIsModifyDisable(true);

          navigate("/board");
        })
        .catch((error) => {
          console.log(error);
          setShowCheckModal({
            title: "글 수정 실패",
            category: "board",
            type: "confirm",
            action: "수정하기",
          });
          setConfirm(true);
          setConfirmModalData({
            confirmTitle: "글 수정에 실패했습니다.",
            confirmCategory: "board",
            confirmType: "modify",
            confirmAction: "실패",
          });
        });
    }
  };
  const [isModifyDisable, setIsModifyDisable] = useState(false);

  return (
    <div className={classes.regist_box}>
      {showCheckModal ? (
        <BalanceGameCheckModal
          setShowCheckModal={setShowCheckModal}
          confirm={confirm}
          setConfirm={setConfirm}
          confirmTitle={confirmModalData.confirmTitle}
          confirmCategory={confirmModalData.confirmCategory}
          confirmType={confirmModalData.confirmType}
          confirmAction={confirmModalData.confirmAction}
          setConfirmModalData={setConfirmModalData}
        />
      ) : (
        <></>
      )}

      <div className={classes.top_title_box}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link to={"/board"}>
            <img className={classes.back_img} src={backImg} alt="" />
          </Link>
        </div>
        <h2 className={classes.second_word}>
          <img className={classes.second_word_img} src={deviceImg} alt=""></img>
          밸런스 게임 수정
        </h2>

        <div style={{ width: "20px" }}></div>
      </div>
      <div className={classes.outer_box}>
        <div className={classes.top}>
          <div className={`${classes.top_item} `}>
            <input
              className={`${classes.input_tag} ${classes.subject}`}
              type="text"
              placeholer="상황 설명*(필수)(최대 30자)"
              value={question || ""}
              onChange={(e) => {
                setQuestion(e.target.value);
                // console.log(question);
              }}
            />
          </div>
        </div>
        <div className={classes.middle}>
          <div className={`${classes.middle_item} ${classes.middle_item_left}`}>
            <textarea
              className={classes.text_input}
              placeholder="선택지1(필수)(최대50자)"
              value={leftAnswer || ""}
              onChange={(e) => {
                setLeftAnswer(e.target.value);
                // console.log(leftAnswer);
              }}
            ></textarea>
            <div className={classes.cover_bar}></div>
          </div>
          <div
            className={`${classes.middle_item} ${classes.middle_item_right}`}
          >
            <textarea
              className={classes.text_input}
              placeholder="선택지2(필수)(최대50자)"
              value={rightAnswer || ""}
              onChange={(e) => {
                setRightAnswer(e.target.value);
                // console.log(rightAnswer);
              }}
            ></textarea>
            <div className={classes.cover_bar}></div>
          </div>
        </div>
        <div className={classes.bottom}>
          <div className={classes.bottom_left}>
            {/* 카테고리 선택하는 부분 */}

            <select
              name="category"
              className={classes.category}
              value={tempCategorie}
              onChange={(e) => {
                setTempCategorie(e.target.value);
              }}
            >
              {categories.map((item, idx) => {
                return (
                  <option value={item.item} key={idx}>
                    {item.item}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      {/* 닉네임, 비밀번호 입력받을 부분 */}
      <div className={classes.info_input_area}>
        <input
          type="button"
          className={classes.regist_btn}
          value="수정하기"
          onClick={() => {
            handleModifyCard();
          }}
          // disabled={isModifyDisable ? true : false}
        ></input>
      </div>
    </div>
  );
}

export default BalanceGameModifyFormPage;
