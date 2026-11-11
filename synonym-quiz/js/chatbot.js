// 챗봇 상태 관리
let currentState = {
    mode: 'SELECT_WORD', // SELECT_WORD, QUIZ, ANSWER_GIVEN
    selectedWordPair: null,
    currentQuizIndex: 0,
    quizzes: [],
    stats: {
        totalQuizzes: 0,
        correctAnswers: 0
    }
};

// DOM 요소
const chatContainer = document.getElementById('chatContainer');
const wordSelector = document.getElementById('wordSelector');
const quizAnswerContainer = document.getElementById('quizAnswerContainer');
const quizOptions = document.getElementById('quizOptions');
const actionButtons = document.getElementById('actionButtons');
const nextBtn = document.getElementById('nextBtn');
const homeBtn = document.getElementById('homeBtn');
const currentTip = document.getElementById('currentTip');
const currentWordPair = document.getElementById('currentWordPair');
const wordExplanation = document.getElementById('wordExplanation');

// 통계 요소
const totalQuizzesEl = document.getElementById('totalQuizzes');
const correctAnswersEl = document.getElementById('correctAnswers');
const accuracyEl = document.getElementById('accuracy');

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    setupEventListeners();
});

// 통계 로드
function loadStats() {
    const savedStats = localStorage.getItem('quizStats');
    if (savedStats) {
        currentState.stats = JSON.parse(savedStats);
        updateStatsDisplay();
    }
}

// 통계 저장
function saveStats() {
    localStorage.setItem('quizStats', JSON.stringify(currentState.stats));
    updateStatsDisplay();
}

// 통계 표시 업데이트
function updateStatsDisplay() {
    totalQuizzesEl.textContent = currentState.stats.totalQuizzes;
    correctAnswersEl.textContent = currentState.stats.correctAnswers;
    
    const accuracy = currentState.stats.totalQuizzes > 0 
        ? Math.round((currentState.stats.correctAnswers / currentState.stats.totalQuizzes) * 100)
        : 0;
    accuracyEl.textContent = accuracy + '%';
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 단어 선택 버튼
    document.querySelectorAll('.word-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const wordPair = e.currentTarget.dataset.pair;
            selectWordPair(wordPair);
        });
    });

    // 다음 버튼
    nextBtn.addEventListener('click', () => {
        showNextQuiz();
    });

    // 처음으로 버튼
    homeBtn.addEventListener('click', () => {
        resetToHome();
    });
}

// 단어 쌍 선택
function selectWordPair(wordPair) {
    currentState.selectedWordPair = wordPair;
    currentState.mode = 'QUIZ';
    currentState.currentQuizIndex = 0;
    
    // 퀴즈 데이터 가져오기 및 섞기
    const quizData = quizDatabase[wordPair];
    currentState.quizzes = shuffleArray([...quizData.quizzes]);
    
    // UI 업데이트
    wordSelector.style.display = 'none';
    
    // 사이드바 팁 업데이트
    updateTipsSidebar(wordPair);
    
    // 인사 메시지
    addBotMessage(
        `좋아요! <strong>${quizData.title}</strong>을 선택하셨네요! 🎯<br><br>` +
        `${quizData.description}<br><br>` +
        `총 <strong>${currentState.quizzes.length}개</strong>의 문제가 준비되어 있어요. 준비되셨나요?`
    );
    
    // 잠시 후 첫 퀴즈 시작
    setTimeout(() => {
        showNextQuiz();
    }, 1500);
}

// 사이드바 팁 업데이트
function updateTipsSidebar(wordPair) {
    const quizData = quizDatabase[wordPair];
    const explanation = wordPairExplanations[wordPair];
    
    currentTip.style.display = 'block';
    currentWordPair.innerHTML = quizData.title;
    
    const words = wordPair.split('_');
    const word1 = words[0];
    const word2 = words[1];
    
    // 단어별 색상 매핑
    const colorMap = {
        'STOP': '#ef4444',
        'FINISH': '#3b82f6',
        'SMALL': '#8b5cf6',
        'LITTLE': '#ec4899',
        'BIG': '#f59e0b',
        'LARGE': '#10b981'
    };
    
    wordExplanation.innerHTML = `
        <div class="word-section">
            <h4 style="color: ${colorMap[word1]}; font-size: 1.1rem; font-weight: 700; margin-bottom: 10px;">${word1}</h4>
            <p class="word-usage">${explanation[word1.toLowerCase()].usage}</p>
            <div class="example-list">
                ${explanation[word1.toLowerCase()].examples.map(ex => 
                    `<div class="example-item">• ${ex}</div>`
                ).join('')}
            </div>
        </div>
        <div class="word-section">
            <h4 style="color: ${colorMap[word2]}; font-size: 1.1rem; font-weight: 700; margin-bottom: 10px;">${word2}</h4>
            <p class="word-usage">${explanation[word2.toLowerCase()].usage}</p>
            <div class="example-list">
                ${explanation[word2.toLowerCase()].examples.map(ex => 
                    `<div class="example-item">• ${ex}</div>`
                ).join('')}
            </div>
        </div>
    `;
}

// 다음 퀴즈 표시
function showNextQuiz() {
    if (currentState.currentQuizIndex >= currentState.quizzes.length) {
        showCompletionMessage();
        return;
    }
    
    const quiz = currentState.quizzes[currentState.currentQuizIndex];
    const questionNumber = currentState.currentQuizIndex + 1;
    const totalQuestions = currentState.quizzes.length;
    
    // 퀴즈 메시지 추가
    addBotMessage(`
        <div class="quiz-card">
            <div class="quiz-question">
                📝 문제 ${questionNumber}/${totalQuestions}
            </div>
            <div class="quiz-sentence">
                ${quiz.sentence.replace('___', '<span class="quiz-blank">___</span>')}
            </div>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 10px;">
                빈칸에 들어갈 적절한 단어를 선택하세요.
            </p>
        </div>
    `);
    
    // 답변 옵션 표시
    showQuizOptions(quiz);
    
    // 액션 버튼 숨기기
    actionButtons.style.display = 'none';
}

// 퀴즈 옵션 표시
function showQuizOptions(quiz) {
    quizAnswerContainer.style.display = 'block';
    
    // 옵션 순서 랜덤화
    const options = shuffleArray([quiz.correctAnswer, quiz.wrongAnswer]);
    
    quizOptions.innerHTML = options.map(option => `
        <button class="option-btn" data-answer="${option}">
            ${option}
        </button>
    `).join('');
    
    // 옵션 버튼에 이벤트 리스너 추가
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            handleAnswer(e.currentTarget.dataset.answer, quiz);
        });
    });
}

// 답변 처리
function handleAnswer(selectedAnswer, quiz) {
    const isCorrect = selectedAnswer === quiz.correctAnswer;
    
    // 통계 업데이트
    currentState.stats.totalQuizzes++;
    if (isCorrect) {
        currentState.stats.correctAnswers++;
    }
    saveStats();
    
    // 모든 옵션 버튼 비활성화
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.disabled = true;
        
        // 정답/오답 표시
        if (btn.dataset.answer === quiz.correctAnswer) {
            btn.classList.add('correct');
        } else if (btn.dataset.answer === selectedAnswer && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
    
    // 사용자 답변 메시지 추가
    addUserMessage(`저는 <strong>${selectedAnswer}</strong>를 선택했어요!`);
    
    // 피드백 메시지
    setTimeout(() => {
        if (isCorrect) {
            addBotMessage(`
                <div class="explanation-box">
                    <h4>✅ 정답입니다! 훌륭해요!</h4>
                    <p>${quiz.explanation}</p>
                    <div class="corpus-info">
                        <strong>💡 핵심 포인트:</strong><br>
                        ${quiz.context}
                    </div>
                </div>
            `);
        } else {
            addBotMessage(`
                <div class="explanation-box wrong">
                    <h4>❌ 아쉽지만 틀렸어요. 다시 한번 생각해볼까요?</h4>
                    <p>정답은 <strong style='color: #10b981; font-size: 1.15em; background: #d1fae5; padding: 2px 8px; border-radius: 6px;'>${quiz.correctAnswer}</strong>입니다.</p>
                    <p>${quiz.explanation}</p>
                    <div class="corpus-info">
                        <strong>💡 핵심 포인트:</strong><br>
                        ${quiz.context}
                    </div>
                </div>
            `);
        }
        
        // 다음 단계로
        currentState.currentQuizIndex++;
        quizAnswerContainer.style.display = 'none';
        actionButtons.style.display = 'flex';
    }, 800);
}

// 완료 메시지
function showCompletionMessage() {
    const totalQuestions = currentState.quizzes.length;
    const quizData = quizDatabase[currentState.selectedWordPair];
    
    // 이번 세션 정답 수 계산
    const recentCorrect = currentState.stats.correctAnswers;
    const recentTotal = currentState.stats.totalQuizzes;
    
    addBotMessage(`
        <div style="text-align: center; padding: 20px;">
            <h3 style="color: var(--primary-color); margin-bottom: 15px;">
                🎉 모든 문제를 완료했어요!
            </h3>
            <p style="font-size: 1.1rem; margin-bottom: 20px;">
                <strong>${quizData.title}</strong> 학습을 마쳤습니다!
            </p>
            <div style="background: var(--bg-color); padding: 20px; border-radius: 12px; margin-top: 20px;">
                <p style="font-size: 1.2rem; color: var(--text-primary);">
                    전체 정확도: <strong style="color: var(--success-color);">${Math.round((recentCorrect/recentTotal)*100)}%</strong>
                </p>
                <p style="margin-top: 10px; color: var(--text-secondary);">
                    ${recentCorrect}/${recentTotal} 문제 정답
                </p>
            </div>
            <p style="margin-top: 20px; line-height: 1.8;">
                계속해서 다른 단어 쌍을 학습하시겠어요?<br>
                아래 버튼을 눌러 처음으로 돌아가세요! 🏠
            </p>
        </div>
    `);
    
    actionButtons.style.display = 'flex';
    nextBtn.style.display = 'none';
}

// 처음으로 리셋
function resetToHome() {
    currentState.mode = 'SELECT_WORD';
    currentState.selectedWordPair = null;
    currentState.currentQuizIndex = 0;
    currentState.quizzes = [];
    
    // UI 리셋
    wordSelector.style.display = 'grid';
    quizAnswerContainer.style.display = 'none';
    actionButtons.style.display = 'none';
    nextBtn.style.display = 'flex';
    currentTip.style.display = 'none';
    
    // 환영 메시지
    addBotMessage(`
        다시 돌아오셨네요! 👋<br><br>
        어떤 단어 쌍을 학습하고 싶으신가요?<br>
        아래에서 선택해주세요!
    `);
}

// 봇 메시지 추가
function addBotMessage(content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot-message';
    messageDiv.innerHTML = `
        <div class="message-avatar bot-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            ${content}
        </div>
    `;
    chatContainer.appendChild(messageDiv);
    scrollToBottom();
}

// 사용자 메시지 추가
function addUserMessage(content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.innerHTML = `
        <div class="message-avatar user-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
            ${content}
        </div>
    `;
    chatContainer.appendChild(messageDiv);
    scrollToBottom();
}

// 스크롤 하단으로
function scrollToBottom() {
    setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
}

// 배열 섞기 (Fisher-Yates)
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
