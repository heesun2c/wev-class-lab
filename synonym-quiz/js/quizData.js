// 코퍼스 데이터 기반 퀴즈 데이터
const quizDatabase = {
    STOP_FINISH: {
        title: "<span style='color: #ef4444; font-weight: 700;'>STOP</span> vs <span style='color: #3b82f6; font-weight: 700;'>FINISH</span>",
        description: "<strong style='color: #ef4444;'>STOP</strong>은 계속되는 행동을 <strong>'중단'</strong>할 때, <strong style='color: #3b82f6;'>FINISH</strong>는 과업이나 프로세스를 <strong>'완료'</strong>할 때 사용됩니다.",
        usageNote: {
            stop: "감정 표현, 지속 행동 중단 (laughing, crying, thinking, complaining)",
            finish: "작업 완료, 프로세스 종료 (installing, cooking, preparing, packing)"
        },
        quizzes: [
            {
                id: 1,
                sentence: "Please ___ laughing at me! It's not funny.",
                correctAnswer: "STOP",
                wrongAnswer: "FINISH",
                explanation: "<strong style='color: #ef4444;'>STOP</strong>은 '웃는 행동을 <strong>중단</strong>'하라는 의미로 사용됩니다. <code style='background: #fee2e2; padding: 2px 6px; border-radius: 4px; color: #991b1b;'>stop laughing</code>은 지속적인 행동을 중단할 때 자연스럽게 사용되는 표현입니다.",
                context: "지속적 행동 중단 - STOP + -ing 형태로 진행 중인 감정 표현이나 행동을 멈출 때 사용"
            },
            {
                id: 2,
                sentence: "I need to ___ installing the software before we can use it.",
                correctAnswer: "FINISH",
                wrongAnswer: "STOP",
                explanation: "<strong style='color: #3b82f6;'>FINISH</strong>는 '설치 작업을 <strong>완료</strong>'하라는 의미입니다. <code style='background: #dbeafe; padding: 2px 6px; border-radius: 4px; color: #1e40af;'>finish installing</code>은 작업 완료를 나타내는 대표적인 표현입니다.",
                context: "작업 완료 - FINISH는 시작과 끝이 있는 작업/프로세스의 완수를 나타냄"
            },
            {
                id: 3,
                sentence: "You should ___ complaining and start finding solutions.",
                correctAnswer: "STOP",
                wrongAnswer: "FINISH",
                explanation: "<code style='background: #fee2e2; padding: 2px 6px; border-radius: 4px; color: #991b1b;'>STOP complaining</code>은 '불평하는 행동을 <strong>중단</strong>'하라는 의미로 자주 사용되는 표현입니다. 지속되는 부정적 행동을 중단할 때 사용합니다.",
                context: "부정적 행동 중단 - 반복되는 행동을 즉시 멈추라는 강한 요청"
            },
            {
                id: 4,
                sentence: "Did you ___ cooking dinner? I'm starving!",
                correctAnswer: "FINISH",
                wrongAnswer: "STOP",
                explanation: "'finish cooking'은 '요리를 완료했니?'라는 의미로, 코퍼스에서 자주 나타나는 표현입니다. 작업의 완료 여부를 묻는 문맥에서 사용됩니다.",
                context: "작업 완료 확인 - 시작한 과업이 끝났는지 여부를 물을 때 FINISH 사용"
            },
            {
                id: 5,
                sentence: "___ thinking about the past and focus on the future.",
                correctAnswer: "STOP",
                wrongAnswer: "FINISH",
                explanation: "'stop thinking'은 '생각하는 것을 중단'하라는 의미로, 코퍼스 데이터에서 높은 빈도로 나타납니다. 지속적인 정신 활동을 중단할 때 사용합니다.",
                context: "정신 활동 중단 - 계속되는 생각이나 걱정을 멈추라는 의미"
            },
            {
                id: 6,
                sentence: "We need to ___ packing our luggage before the flight tomorrow.",
                correctAnswer: "FINISH",
                wrongAnswer: "STOP",
                explanation: "'finish packing'은 '짐 싸는 작업을 완료'해야 한다는 의미를 나타내는 표현입니다.",
                context: "준비 작업 완료 - 기한이 있는 준비 작업을 끝내야 할 때 FINISH 사용"
            },
            {
                id: 7,
                sentence: "The traffic ___ sign is red, so we must wait.",
                correctAnswer: "STOP",
                wrongAnswer: "FINISH",
                explanation: "'stop sign'은 '정지 신호'를 의미하는 명사 표현으로, 코퍼스에서 자주 나타나는 고정 표현입니다. 'finish sign'은 자연스럽지 않습니다.",
                context: "명사로서의 STOP - traffic stop sign은 고정 표현 (finish sign은 비문법적)"
            },
            {
                id: 8,
                sentence: "Athletes sprint to the ___ line in the race.",
                correctAnswer: "FINISH",
                wrongAnswer: "STOP",
                explanation: "'finish line'은 '결승선'을 의미하는 고정된 명사 표현입니다.",
                context: "명사로서의 FINISH - finish line은 경주의 종점을 의미하는 고정 표현"
            }
        ]
    },
    SMALL_LITTLE: {
        title: "<span style='color: #8b5cf6; font-weight: 700;'>SMALL</span> vs <span style='color: #ec4899; font-weight: 700;'>LITTLE</span>",
        description: "<strong style='color: #8b5cf6;'>SMALL</strong>은 크기나 양의 <strong>'작음'</strong>을 객관적으로 측정할 때, <strong style='color: #ec4899;'>LITTLE</strong>은 감정적이거나 비공식적인 맥락에서 사용됩니다.",
        usageNote: {
            small: "측정 가능한 크기, 객관적 표현 (quantities, percentage, businesses, intestine)",
            little: "감정 표현, 비공식적 표현 (fun, while, league, buddy)"
        },
        quizzes: [
            {
                id: 1,
                sentence: "Only a ___ proportion of students failed the exam.",
                correctAnswer: "SMALL",
                wrongAnswer: "LITTLE",
                explanation: "<code style='background: #f3e8ff; padding: 2px 6px; border-radius: 4px; color: #6b21a8;'>small proportion</code>은 '작은 비율'을 나타내는 객관적 표현입니다. 통계나 측정 가능한 수치를 표현할 때 <strong style='color: #8b5cf6;'>SMALL</strong>을 사용합니다.",
                context: "통계 표현 - SMALL은 측정 가능한 수치에, LITTLE은 주관적 감각에 사용"
            },
            {
                id: 2,
                sentence: "Let's have a ___ fun before we get back to work.",
                correctAnswer: "LITTLE",
                wrongAnswer: "SMALL",
                explanation: "<code style='background: #fce7f3; padding: 2px 6px; border-radius: 4px; color: #9f1239;'>a little fun</code>은 '약간의 재미'라는 의미로 자주 사용되는 표현입니다. 감정이나 질적 표현에는 <strong style='color: #ec4899;'>LITTLE</strong>을 사용합니다.",
                context: "감정적 표현 - LITTLE은 측정 불가능한 감정이나 경험에 자주 사용"
            },
            {
                id: 3,
                sentence: "___ businesses are struggling during the economic crisis.",
                correctAnswer: "SMALL",
                wrongAnswer: "LITTLE",
                explanation: "'small businesses'는 '소규모 기업'을 의미하는 고정 표현입니다. 규모의 객관적 분류에 SMALL을 사용합니다.",
                context: "규모 분류 - SMALL은 공식적 규모 분류에, LITTLE은 비공식적 표현에 사용"
            },
            {
                id: 4,
                sentence: "My ___ brother plays in the ___ league baseball team.",
                correctAnswer: "LITTLE / LITTLE",
                wrongAnswer: "SMALL / SMALL",
                explanation: "'little brother'는 '남동생'이라는 친근한 표현이고, 'little league'는 '소년 야구 리그'를 의미하는 고정 표현입니다.",
                context: "고정 표현 - little brother와 little league는 관용적으로 굳어진 표현"
            },
            {
                id: 5,
                sentence: "A ___ percentage of the population lives in rural areas.",
                correctAnswer: "SMALL",
                wrongAnswer: "LITTLE",
                explanation: "'small percentage'는 코퍼스에서 자주 나타나는 표현으로, 측정 가능한 비율을 나타낼 때 사용합니다.",
                context: "정량적 표현 - 퍼센트나 비율 등 수치화 가능한 양에는 SMALL 사용"
            },
            {
                id: 6,
                sentence: "Wait a ___ while, I'll be right back.",
                correctAnswer: "LITTLE",
                wrongAnswer: "SMALL",
                explanation: "'a little while'은 '잠깐 동안'이라는 의미의 고정 표현입니다. 시간의 짧음을 비공식적으로 표현할 때 사용합니다.",
                context: "시간 표현 - a little while은 고정 표현으로 구어체에서 자주 사용"
            },
            {
                id: 7,
                sentence: "We need a ___ saucepan to cook this sauce.",
                correctAnswer: "SMALL",
                wrongAnswer: "LITTLE",
                explanation: "'small saucepan'은 코퍼스에서 나타나는 표현으로, 도구나 물건의 크기를 객관적으로 표현할 때 SMALL을 사용합니다.",
                context: "물건의 크기 - 도구나 물체의 객관적 크기를 표현할 때 SMALL 사용"
            },
            {
                id: 8,
                sentence: "Come here, ___ buddy! Let me help you.",
                correctAnswer: "LITTLE",
                wrongAnswer: "SMALL",
                explanation: "'little buddy'는 친근하고 애정 어린 호칭으로, 코퍼스에서 나타나는 감정적 표현입니다. 애정이나 친밀감을 표현할 때 LITTLE을 사용합니다.",
                context: "친밀하고 애정 어린 호칭 - LITTLE은 감정적 친근함을 더하며, SMALL은 단순 크기만 표현하여 부자연스러움"
            }
        ]
    },
    BIG_LARGE: {
        title: "<span style='color: #f59e0b; font-weight: 700;'>BIG</span> vs <span style='color: #10b981; font-weight: 700;'>LARGE</span>",
        description: "<strong style='color: #f59e0b;'>BIG</strong>는 비공식적이고 일상적인 표현에서, <strong style='color: #10b981;'>LARGE</strong>는 공식적이고 객관적인 크기나 규모를 나타낼 때 사용됩니다.",
        usageNote: {
            big: "일상적 표현, 중요성 강조 (deal, problem, fan, difference, issue)",
            large: "공식적 표현, 측정 가능한 규모 (number, amount, scale, quantities, corporations)"
        },
        quizzes: [
            {
                id: 1,
                sentence: "A ___ number of people attended the conference.",
                correctAnswer: "LARGE",
                wrongAnswer: "BIG",
                explanation: "<code style='background: #d1fae5; padding: 2px 6px; border-radius: 4px; color: #065f46;'>a large number of</code>는 '많은 수의'를 의미하는 공식적 표현입니다. 정량적 표현에는 <strong style='color: #10b981;'>LARGE</strong>를 사용합니다.",
                context: "정량적 표현 - LARGE는 수치화 가능한 양에, BIG는 주관적 크기에 사용"
            },
            {
                id: 2,
                sentence: "This is a ___ deal for our company!",
                correctAnswer: "BIG",
                wrongAnswer: "LARGE",
                explanation: "<code style='background: #fef3c7; padding: 2px 6px; border-radius: 4px; color: #92400e;'>big deal</code>은 '<strong>중요한 일</strong>'이라는 의미의 일상적 표현으로, 중요성이나 의미를 강조할 때 <strong style='color: #f59e0b;'>BIG</strong>를 사용합니다.",
                context: "중요성 강조 - BIG는 의미나 영향력의 중요성을 나타내는 구어체 표현"
            },
            {
                id: 3,
                sentence: "The company received a ___ amount of funding.",
                correctAnswer: "LARGE",
                wrongAnswer: "BIG",
                explanation: "'large amount'는 '큰 금액'을 의미하는 공식적 표현으로, 측정 가능한 양을 나타낼 때 LARGE를 사용합니다.",
                context: "금액 표현 - 금액이나 양을 객관적으로 표현할 때 LARGE가 공식적"
            },
            {
                id: 4,
                sentence: "I'm a ___ fan of this band!",
                correctAnswer: "BIG",
                wrongAnswer: "LARGE",
                explanation: "'big fan'은 '열렬한 팬'이라는 의미의 일상적 표현입니다. 애정이나 열정을 나타낼 때 BIG를 사용합니다.",
                context: "열정 표현 - BIG fan은 강한 애정이나 선호를 나타내는 구어체 관용 표현"
            },
            {
                id: 5,
                sentence: "There's a ___ difference between the two options.",
                correctAnswer: "BIG",
                wrongAnswer: "LARGE",
                explanation: "'big difference'는 '큰 차이'를 의미하는 일상적 표현으로, 차이의 중요성을 강조할 때 BIG를 사용합니다.",
                context: "차이 강조 - BIG는 차이의 의미나 영향력을 강조하는 일상적 표현"
            },
            {
                id: 6,
                sentence: "The project requires ___ scale production.",
                correctAnswer: "LARGE",
                wrongAnswer: "BIG",
                explanation: "'large scale'은 '대규모'를 의미하는 공식적 표현으로, 규모를 객관적으로 표현할 때 LARGE를 사용합니다.",
                context: "규모 표현 - large scale은 프로젝트나 생산 규모를 공식적으로 표현"
            },
            {
                id: 7,
                sentence: "Climate change is a ___ problem we must solve.",
                correctAnswer: "BIG",
                wrongAnswer: "LARGE",
                explanation: "'big problem'은 '큰 문제'라는 의미로, 문제의 중요성과 심각성을 강조하는 일상적 표현입니다.",
                context: "문제의 심각성 - BIG는 문제의 중요성과 영향력을 강조하는 구어체"
            },
            {
                id: 8,
                sentence: "___ corporations dominate the global market.",
                correctAnswer: "LARGE",
                wrongAnswer: "BIG",
                explanation: "'large corporations'는 '대기업'을 의미하는 공식적 표현으로, 기업 규모를 객관적으로 분류할 때 LARGE를 사용합니다.",
                context: "공식적 분류 - LARGE corporations는 기업 규모를 객관적으로 분류하는 공식 용어"
            }
        ]
    }
};

// 단어 쌍별 설명
const wordPairExplanations = {
    STOP_FINISH: {
        stop: {
            usage: "지속적인 행동이나 프로세스를 중단할 때 사용",
            examples: [
                "stop laughing (웃음 중단)",
                "stop thinking (생각 중단)",
                "stop complaining (불평 중단)"
            ],
            pattern: "주로 -ing 동사와 함께 사용되어 진행 중인 행동을 중단"
        },
        finish: {
            usage: "작업이나 프로세스를 완료할 때 사용",
            examples: [
                "finish installing (설치 완료)",
                "finish cooking (요리 완료)",
                "finish packing (짐싸기 완료)"
            ],
            pattern: "작업의 끝을 나타내며, 완수의 의미가 강함"
        }
    },
    SMALL_LITTLE: {
        small: {
            usage: "객관적으로 측정 가능한 크기나 양을 표현",
            examples: [
                "small percentage (작은 비율)",
                "small businesses (소규모 기업)",
                "small quantities (소량)"
            ],
            pattern: "통계, 측정, 규모 분류에서 공식적으로 사용"
        },
        little: {
            usage: "감정적, 비공식적, 질적 표현에 사용",
            examples: [
                "a little fun (약간의 재미)",
                "little league (소년 리그)",
                "little buddy (작은 친구)"
            ],
            pattern: "애정, 친밀감, 비공식적 상황에서 사용"
        }
    },
    BIG_LARGE: {
        big: {
            usage: "일상적이고 비공식적인 표현, 중요성 강조",
            examples: [
                "big deal (중요한 일)",
                "big problem (큰 문제)",
                "big fan (열렬한 팬)"
            ],
            pattern: "중요성, 의미, 영향력을 강조하는 일상 표현"
        },
        large: {
            usage: "공식적이고 객관적인 크기나 규모 표현",
            examples: [
                "large number (많은 수)",
                "large amount (큰 금액)",
                "large scale (대규모)"
            ],
            pattern: "정량적, 측정 가능한 규모를 공식적으로 표현"
        }
    }
};
