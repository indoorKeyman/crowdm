import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, styled, TablePagination  } from '@mui/material';
import ReplyInquiryAlert from './ReplyInquiryAlert';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';


// 행 스타일
const CustomTableRow = styled(TableRow)(({ theme }) => ({
    cursor: 'pointer',
    backgroundColor: theme.palette.background.paper,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
}));

const CustomTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
  borderBottom: `2px solid ${theme.palette.divider}`,
}));

const progressStyle = {
  margin: "20px",
  justifyContent: "center",
  display: 'flex',
};

// /admin/questionlist 경로
// myq_index: 질의응답 고유번호
// question_title: 질문 제목
// user_index: 질문한 유저 번호
// question_date: 질문한 날짜
// answer_date: 답변한 날짜
// status: 상태

const ReplyInquiry = () => {
    // 상태관리 변수들
    const theme = useTheme();
    const [questions, setQuestions] = useState();
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)

    
    // 페이지네이션
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    // 처음 렌더링될 때 실행
    useEffect(() => {
        // 데이터를 가져오는 비동기 함수
        const fetchQuestions = async () => {
          try {
            const response = await axios.get('/admin/questionlist'); // 실제 API URL로 대체해야 합니다.
            console.log('Questions 데이터:', response.data); // 데이터 확인을 위한 로그
            setQuestions(response.data);
          } catch (error) {
            console.error('Questions 데이터를 가져오는 중 오류 발생:', error);
            setError('데이터를 가져오는 중 오류가 발생했습니다. ')
          } finally {
            setLoading(false);
          }
        };
    
        fetchQuestions();
      }, []);

    // 모달 여는 함수
    const openModal = (question) => {
        setSelectedQuestion(question);
        setIsModalOpen(true);
    };

    // 모달 닫는 함수
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedQuestion(null);
    };

    // 답변 제출 처리 함수
    const handleAnswerSubmit = (answer) => {
        const answerData = {
            myq_index: selectedQuestion.myq_index, // myq_index 추가
            answer,
        };

        axios.post(`/admin/answer`, answerData)
            .then(response => {
                closeModal();
                // 질문 목록을 업데이트하여 답변 상태 반영
                setQuestions(prevQuestions => 
                    prevQuestions.map(q => 
                        q.myq_index === selectedQuestion.myq_index ? { ...q, ...answerData, status: '완료' } : q
                    )
                );
                alert('답변을 보냈습니다.');
            })
            .catch(error => {
                console.error('답변 제출 중 오류가 발생했습니다!', error);
                alert('오류가 발생하여 답변을 제출하지 못했습니다.');
            });
    };

    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>번호</TableCell>
                            <TableCell>제목</TableCell>
                            <TableCell>작성자</TableCell>
                            <TableCell>상태</TableCell>
                            <TableCell>문의 날짜</TableCell>
                            <TableCell>답변 날짜</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {questions && questions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((question, index) => (
                            <CustomTableRow key={question.myq_index} onClick={() => openModal(question)}>
                                <CustomTableCell>{index + 1}</CustomTableCell>
                                <CustomTableCell>{question.question_title}</CustomTableCell>
                                <CustomTableCell>{question.name}</CustomTableCell>
                                <CustomTableCell>{question.answer_date ? '완료' : '대기'}</CustomTableCell>
                                <CustomTableCell>{question.question_date}</CustomTableCell>
                                <CustomTableCell>{question.answer_date || '-'}</CustomTableCell>
                            </CustomTableRow >
                        ))}
                    </TableBody>
                </Table>
                {/* 로딩 중일 때 표시 */}
                {loading &&
                    <div style={progressStyle}>
                        <CircularProgress sx={{color:theme.palette.primary.main}} />
                    </div>
                }
                {!questions && (
                    <div style={{textAlign:'center', margin:'10px', color:theme.palette.text.secondary}}>{error}목록이 없습니다.</div>
                )}
                {questions && <TablePagination
                    component="div"
                    count={questions.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />}
            </TableContainer>
            <ReplyInquiryAlert 
                open={isModalOpen} 
                handleClose={closeModal} 
                question={selectedQuestion} 
                onSubmit={handleAnswerSubmit} 
            />
        </div>
    );
};

export default ReplyInquiry;
