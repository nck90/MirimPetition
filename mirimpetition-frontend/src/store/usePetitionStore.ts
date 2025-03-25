import { create } from 'zustand';

const mockPetitions: Petition[] = [
  {
    id: "1",
    title: "교내 프로그래밍 대회 정기 개최 요청",
    content: `미림마이스터고 학생들의 프로그래밍 실력 향상과 건전한 경쟁 환경 조성을 위해 정기적인 교내 프로그래밍 대회 개최를 요청드립니다.
  
  현재 학생들은 외부 대회에 참가할 기회가 제한적이며, 대회를 준비하는 과정에서 실력을 쌓을 수 있는 교내 플랫폼이 부족합니다.
  
  정기적인 교내 프로그래밍 대회가 열린다면 다음과 같은 효과를 기대할 수 있습니다:
  
  1. 학생들의 코딩 실력 향상 및 문제 해결 능력 증진
  2. 팀워크와 협업 능력 개발 (팀 대회 시)
  3. 취업 및 진학에 도움이 될 포트폴리오 구축
  4. 프로그래밍에 대한 흥미 및 동기 부여
  5. 학과 간 교류 증진
  
  매 학기 1회, 연간 2회 정도의 정기 대회를 개최하여 학생들이 꾸준히 실력을 향상시킬 수 있는 환경을 만들어주시기를 요청드립니다.`,
    category: "교육과정",
    status: "progress" as StatusType,
    signatures: 210,
    goal: 300,
    deadline: "2023.05.10",
    createdAt: "2023.04.01",
    author: {
      name: "김미림",
      department: "소프트웨어과",
      grade: 2,
      avatar: "/placeholder.svg"
    },
    timeline: [
      { date: "2023.04.01", event: "청원 등록" },
      { date: "2023.04.05", event: "100명 서명 달성" },
      { date: "2023.04.15", event: "200명 서명 달성" },
      { date: "2023.04.20", event: "검토 시작" }
    ],
    comments: [
      {
        id: "c1",
        author: { name: "정소프트", avatar: "/placeholder.svg" },
        content: "정말 필요한 청원입니다. 저도 교내 프로그래밍 대회가 있으면 참가하고 싶습니다.",
        date: "2023.04.05",
        likes: 15
      },
      {
        id: "c2",
        author: { name: "이웹개발", avatar: "/placeholder.svg" },
        content: "제 생각에는 학기별 1회보다는 분기별 1회가 더 효과적일 것 같습니다.",
        date: "2023.04.07",
        likes: 8
      },
      {
        id: "c3",
        author: { name: "박교사", avatar: "/placeholder.svg", isTeacher: true },
        content: "좋은 제안입니다. 교사회의에서 논의해보겠습니다.",
        date: "2023.04.10",
        likes: 22
      }
    ]
  },{
    id: "2",
    title: "교내 프로그래밍 대회 정기 개최 요청",
    content: `미림마이스터고 학생들의 프로그래밍 실력 향상과 건전한 경쟁 환경 조성을 위해 정기적인 교내 프로그래밍 대회 개최를 요청드립니다.
  
  현재 학생들은 외부 대회에 참가할 기회가 제한적이며, 대회를 준비하는 과정에서 실력을 쌓을 수 있는 교내 플랫폼이 부족합니다.
  
  정기적인 교내 프로그래밍 대회가 열린다면 다음과 같은 효과를 기대할 수 있습니다:
  
  1. 학생들의 코딩 실력 향상 및 문제 해결 능력 증진
  2. 팀워크와 협업 능력 개발 (팀 대회 시)
  3. 취업 및 진학에 도움이 될 포트폴리오 구축
  4. 프로그래밍에 대한 흥미 및 동기 부여
  5. 학과 간 교류 증진
  
  매 학기 1회, 연간 2회 정도의 정기 대회를 개최하여 학생들이 꾸준히 실력을 향상시킬 수 있는 환경을 만들어주시기를 요청드립니다.`,
    category: "교육과정",
    status: "progress" as StatusType,
    signatures: 210,
    goal: 300,
    deadline: "2023.05.10",
    createdAt: "2023.04.01",
    author: {
      name: "김미림",
      department: "소프트웨어과",
      grade: 2,
      avatar: "/placeholder.svg"
    },
    timeline: [
      { date: "2023.04.01", event: "청원 등록" },
      { date: "2023.04.05", event: "100명 서명 달성" },
      { date: "2023.04.15", event: "200명 서명 달성" },
      { date: "2023.04.20", event: "검토 시작" }
    ],
    comments: [
      {
        id: "c1",
        author: { name: "정소프트", avatar: "/placeholder.svg" },
        content: "정말 필요한 청원입니다. 저도 교내 프로그래밍 대회가 있으면 참가하고 싶습니다.",
        date: "2023.04.05",
        likes: 15
      },
      {
        id: "c2",
        author: { name: "이웹개발", avatar: "/placeholder.svg" },
        content: "제 생각에는 학기별 1회보다는 분기별 1회가 더 효과적일 것 같습니다.",
        date: "2023.04.07",
        likes: 8
      },
      {
        id: "c3",
        author: { name: "박교사", avatar: "/placeholder.svg", isTeacher: true },
        content: "좋은 제안입니다. 교사회의에서 논의해보겠습니다.",
        date: "2023.04.10",
        likes: 22
      }
    ]
  },{
    id: "3",
    title: "교내 프로그래밍 대회 정기 개최 요청",
    content: `미림마이스터고 학생들의 프로그래밍 실력 향상과 건전한 경쟁 환경 조성을 위해 정기적인 교내 프로그래밍 대회 개최를 요청드립니다.
  
  현재 학생들은 외부 대회에 참가할 기회가 제한적이며, 대회를 준비하는 과정에서 실력을 쌓을 수 있는 교내 플랫폼이 부족합니다.
  
  정기적인 교내 프로그래밍 대회가 열린다면 다음과 같은 효과를 기대할 수 있습니다:
  
  1. 학생들의 코딩 실력 향상 및 문제 해결 능력 증진
  2. 팀워크와 협업 능력 개발 (팀 대회 시)
  3. 취업 및 진학에 도움이 될 포트폴리오 구축
  4. 프로그래밍에 대한 흥미 및 동기 부여
  5. 학과 간 교류 증진
  
  매 학기 1회, 연간 2회 정도의 정기 대회를 개최하여 학생들이 꾸준히 실력을 향상시킬 수 있는 환경을 만들어주시기를 요청드립니다.`,
    category: "교육과정",
    status: "pending" as StatusType,
    signatures: 210,
    goal: 300,
    deadline: "2023.05.10",
    createdAt: "2023.04.01",
    author: {
      name: "김미림",
      department: "소프트웨어과",
      grade: 2,
      avatar: "/placeholder.svg"
    },
    timeline: [
      { date: "2023.04.01", event: "청원 등록" },
      { date: "2023.04.05", event: "100명 서명 달성" },
      { date: "2023.04.15", event: "200명 서명 달성" },
      { date: "2023.04.20", event: "검토 시작" }
    ],
    comments: [
      {
        id: "c1",
        author: { name: "정소프트", avatar: "/placeholder.svg" },
        content: "정말 필요한 청원입니다. 저도 교내 프로그래밍 대회가 있으면 참가하고 싶습니다.",
        date: "2023.04.05",
        likes: 15
      },
      {
        id: "c2",
        author: { name: "이웹개발", avatar: "/placeholder.svg" },
        content: "제 생각에는 학기별 1회보다는 분기별 1회가 더 효과적일 것 같습니다.",
        date: "2023.04.07",
        likes: 8
      },
      {
        id: "c3",
        author: { name: "박교사", avatar: "/placeholder.svg", isTeacher: true },
        content: "좋은 제안입니다. 교사회의에서 논의해보겠습니다.",
        date: "2023.04.10",
        likes: 22
      }
    ]
  },{
    id: "4",
    title: "교내 프로그래밍 대회 정기 개최 요청",
    content: `미림마이스터고 학생들의 프로그래밍 실력 향상과 건전한 경쟁 환경 조성을 위해 정기적인 교내 프로그래밍 대회 개최를 요청드립니다.
  
  현재 학생들은 외부 대회에 참가할 기회가 제한적이며, 대회를 준비하는 과정에서 실력을 쌓을 수 있는 교내 플랫폼이 부족합니다.
  
  정기적인 교내 프로그래밍 대회가 열린다면 다음과 같은 효과를 기대할 수 있습니다:
  
  1. 학생들의 코딩 실력 향상 및 문제 해결 능력 증진
  2. 팀워크와 협업 능력 개발 (팀 대회 시)
  3. 취업 및 진학에 도움이 될 포트폴리오 구축
  4. 프로그래밍에 대한 흥미 및 동기 부여
  5. 학과 간 교류 증진
  
  매 학기 1회, 연간 2회 정도의 정기 대회를 개최하여 학생들이 꾸준히 실력을 향상시킬 수 있는 환경을 만들어주시기를 요청드립니다.`,
    category: "교육과정",
    status: "answered" as StatusType,
    signatures: 210,
    goal: 300,
    deadline: "2023.05.10",
    createdAt: "2023.04.01",
    author: {
      name: "김미림",
      department: "소프트웨어과",
      grade: 2,
      avatar: "/placeholder.svg"
    },
    timeline: [
      { date: "2023.04.01", event: "청원 등록" },
      { date: "2023.04.05", event: "100명 서명 달성" },
      { date: "2023.04.15", event: "200명 서명 달성" },
      { date: "2023.04.20", event: "검토 시작" }
    ],
    comments: [
      {
        id: "c1",
        author: { name: "정소프트", avatar: "/placeholder.svg" },
        content: "정말 필요한 청원입니다. 저도 교내 프로그래밍 대회가 있으면 참가하고 싶습니다.",
        date: "2023.04.05",
        likes: 15
      },
      {
        id: "c2",
        author: { name: "이웹개발", avatar: "/placeholder.svg" },
        content: "제 생각에는 학기별 1회보다는 분기별 1회가 더 효과적일 것 같습니다.",
        date: "2023.04.07",
        likes: 8
      },
      {
        id: "c3",
        author: { name: "박교사", avatar: "/placeholder.svg", isTeacher: true },
        content: "좋은 제안입니다. 교사회의에서 논의해보겠습니다.",
        date: "2023.04.10",
        likes: 22
      }
    ]
  },{
    id: "5",
    title: "교내 프로그래밍 대회 정기 개최 요청",
    content: `미림마이스터고 학생들의 프로그래밍 실력 향상과 건전한 경쟁 환경 조성을 위해 정기적인 교내 프로그래밍 대회 개최를 요청드립니다.
  
  현재 학생들은 외부 대회에 참가할 기회가 제한적이며, 대회를 준비하는 과정에서 실력을 쌓을 수 있는 교내 플랫폼이 부족합니다.
  
  정기적인 교내 프로그래밍 대회가 열린다면 다음과 같은 효과를 기대할 수 있습니다:
  
  1. 학생들의 코딩 실력 향상 및 문제 해결 능력 증진
  2. 팀워크와 협업 능력 개발 (팀 대회 시)
  3. 취업 및 진학에 도움이 될 포트폴리오 구축
  4. 프로그래밍에 대한 흥미 및 동기 부여
  5. 학과 간 교류 증진
  
  매 학기 1회, 연간 2회 정도의 정기 대회를 개최하여 학생들이 꾸준히 실력을 향상시킬 수 있는 환경을 만들어주시기를 요청드립니다.`,
    category: "교육과정",
    status: "answered" as StatusType,
    signatures: 210,
    goal: 300,
    deadline: "2023.05.10",
    createdAt: "2023.04.01",
    author: {
      name: "김미림",
      department: "소프트웨어과",
      grade: 2,
      avatar: "/placeholder.svg"
    },
    timeline: [
      { date: "2023.04.01", event: "청원 등록" },
      { date: "2023.04.05", event: "100명 서명 달성" },
      { date: "2023.04.15", event: "200명 서명 달성" },
      { date: "2023.04.20", event: "검토 시작" }
    ],
    comments: [
      {
        id: "c1",
        author: { name: "정소프트", avatar: "/placeholder.svg" },
        content: "정말 필요한 청원입니다. 저도 교내 프로그래밍 대회가 있으면 참가하고 싶습니다.",
        date: "2023.04.05",
        likes: 15
      },
      {
        id: "c2",
        author: { name: "이웹개발", avatar: "/placeholder.svg" },
        content: "제 생각에는 학기별 1회보다는 분기별 1회가 더 효과적일 것 같습니다.",
        date: "2023.04.07",
        likes: 8
      },
      {
        id: "c3",
        author: { name: "박교사", avatar: "/placeholder.svg", isTeacher: true },
        content: "좋은 제안입니다. 교사회의에서 논의해보겠습니다.",
        date: "2023.04.10",
        likes: 22
      }
    ]
  },{
    id: "6",
    title: "교내 프로그래밍 대회 정기 개최 요청",
    content: `미림마이스터고 학생들의 프로그래밍 실력 향상과 건전한 경쟁 환경 조성을 위해 정기적인 교내 프로그래밍 대회 개최를 요청드립니다.
  
  현재 학생들은 외부 대회에 참가할 기회가 제한적이며, 대회를 준비하는 과정에서 실력을 쌓을 수 있는 교내 플랫폼이 부족합니다.
  
  정기적인 교내 프로그래밍 대회가 열린다면 다음과 같은 효과를 기대할 수 있습니다:
  
  1. 학생들의 코딩 실력 향상 및 문제 해결 능력 증진
  2. 팀워크와 협업 능력 개발 (팀 대회 시)
  3. 취업 및 진학에 도움이 될 포트폴리오 구축
  4. 프로그래밍에 대한 흥미 및 동기 부여
  5. 학과 간 교류 증진
  
  매 학기 1회, 연간 2회 정도의 정기 대회를 개최하여 학생들이 꾸준히 실력을 향상시킬 수 있는 환경을 만들어주시기를 요청드립니다.`,
    category: "교육과정",
    status: "answered" as StatusType,
    signatures: 210,
    goal: 300,
    deadline: "2023.05.10",
    createdAt: "2023.04.01",
    author: {
      name: "김미림",
      department: "소프트웨어과",
      grade: 2,
      avatar: "/placeholder.svg"
    },
    timeline: [
      { date: "2023.04.01", event: "청원 등록" },
      { date: "2023.04.05", event: "100명 서명 달성" },
      { date: "2023.04.15", event: "200명 서명 달성" },
      { date: "2023.04.20", event: "검토 시작" }
    ],
    comments: [
      {
        id: "c1",
        author: { name: "정소프트", avatar: "/placeholder.svg" },
        content: "정말 필요한 청원입니다. 저도 교내 프로그래밍 대회가 있으면 참가하고 싶습니다.",
        date: "2023.04.05",
        likes: 15
      },
      {
        id: "c2",
        author: { name: "이웹개발", avatar: "/placeholder.svg" },
        content: "제 생각에는 학기별 1회보다는 분기별 1회가 더 효과적일 것 같습니다.",
        date: "2023.04.07",
        likes: 8
      },
      {
        id: "c3",
        author: { name: "박교사", avatar: "/placeholder.svg", isTeacher: true },
        content: "좋은 제안입니다. 교사회의에서 논의해보겠습니다.",
        date: "2023.04.10",
        likes: 22
      }
    ]
  },{
    id: "7",
    title: "교내 프로그래밍 대회 정기 개최 요청",
    content: `미림마이스터고 학생들의 프로그래밍 실력 향상과 건전한 경쟁 환경 조성을 위해 정기적인 교내 프로그래밍 대회 개최를 요청드립니다.
  
  현재 학생들은 외부 대회에 참가할 기회가 제한적이며, 대회를 준비하는 과정에서 실력을 쌓을 수 있는 교내 플랫폼이 부족합니다.
  
  정기적인 교내 프로그래밍 대회가 열린다면 다음과 같은 효과를 기대할 수 있습니다:
  
  1. 학생들의 코딩 실력 향상 및 문제 해결 능력 증진
  2. 팀워크와 협업 능력 개발 (팀 대회 시)
  3. 취업 및 진학에 도움이 될 포트폴리오 구축
  4. 프로그래밍에 대한 흥미 및 동기 부여
  5. 학과 간 교류 증진
  
  매 학기 1회, 연간 2회 정도의 정기 대회를 개최하여 학생들이 꾸준히 실력을 향상시킬 수 있는 환경을 만들어주시기를 요청드립니다.`,
    category: "교육과정",
    status: "rejected" as StatusType,
    signatures: 210,
    goal: 300,
    deadline: "2023.05.10",
    createdAt: "2023.04.01",
    author: {
      name: "김미림",
      department: "소프트웨어과",
      grade: 2,
      avatar: "/placeholder.svg"
    },
    timeline: [
      { date: "2023.04.01", event: "청원 등록" },
      { date: "2023.04.05", event: "100명 서명 달성" },
      { date: "2023.04.15", event: "200명 서명 달성" },
      { date: "2023.04.20", event: "검토 시작" }
    ],
    comments: [
      {
        id: "c1",
        author: { name: "정소프트", avatar: "/placeholder.svg" },
        content: "정말 필요한 청원입니다. 저도 교내 프로그래밍 대회가 있으면 참가하고 싶습니다.",
        date: "2023.04.05",
        likes: 15
      },
      {
        id: "c2",
        author: { name: "이웹개발", avatar: "/placeholder.svg" },
        content: "제 생각에는 학기별 1회보다는 분기별 1회가 더 효과적일 것 같습니다.",
        date: "2023.04.07",
        likes: 8
      },
      {
        id: "c3",
        author: { name: "박교사", avatar: "/placeholder.svg", isTeacher: true },
        content: "좋은 제안입니다. 교사회의에서 논의해보겠습니다.",
        date: "2023.04.10",
        likes: 22
      }
    ]
  },{
    id: "8",
    title: "교내 프로그래밍 대회 정기 개최 요청",
    content: `미림마이스터고 학생들의 프로그래밍 실력 향상과 건전한 경쟁 환경 조성을 위해 정기적인 교내 프로그래밍 대회 개최를 요청드립니다.
  
  현재 학생들은 외부 대회에 참가할 기회가 제한적이며, 대회를 준비하는 과정에서 실력을 쌓을 수 있는 교내 플랫폼이 부족합니다.
  
  정기적인 교내 프로그래밍 대회가 열린다면 다음과 같은 효과를 기대할 수 있습니다:
  
  1. 학생들의 코딩 실력 향상 및 문제 해결 능력 증진
  2. 팀워크와 협업 능력 개발 (팀 대회 시)
  3. 취업 및 진학에 도움이 될 포트폴리오 구축
  4. 프로그래밍에 대한 흥미 및 동기 부여
  5. 학과 간 교류 증진
  
  매 학기 1회, 연간 2회 정도의 정기 대회를 개최하여 학생들이 꾸준히 실력을 향상시킬 수 있는 환경을 만들어주시기를 요청드립니다.`,
    category: "교육과정",
    status: "expired" as StatusType,
    signatures: 210,
    goal: 300,
    deadline: "2023.05.10",
    createdAt: "2023.04.01",
    author: {
      name: "김미림",
      department: "소프트웨어과",
      grade: 2,
      avatar: "/placeholder.svg"
    },
    timeline: [
      { date: "2023.04.01", event: "청원 등록" },
      { date: "2023.04.05", event: "100명 서명 달성" },
      { date: "2023.04.15", event: "200명 서명 달성" },
      { date: "2023.04.20", event: "검토 시작" }
    ],
    comments: [
      {
        id: "c1",
        author: { name: "정소프트", avatar: "/placeholder.svg" },
        content: "정말 필요한 청원입니다. 저도 교내 프로그래밍 대회가 있으면 참가하고 싶습니다.",
        date: "2023.04.05",
        likes: 15
      },
      {
        id: "c2",
        author: { name: "이웹개발", avatar: "/placeholder.svg" },
        content: "제 생각에는 학기별 1회보다는 분기별 1회가 더 효과적일 것 같습니다.",
        date: "2023.04.07",
        likes: 8
      },
      {
        id: "c3",
        author: { name: "박교사", avatar: "/placeholder.svg", isTeacher: true },
        content: "좋은 제안입니다. 교사회의에서 논의해보겠습니다.",
        date: "2023.04.10",
        likes: 22
      }
    ]
  },{
    id: "9",
    title: "교내 프로그래밍 대회 정기 개최 요청",
    content: `미림마이스터고 학생들의 프로그래밍 실력 향상과 건전한 경쟁 환경 조성을 위해 정기적인 교내 프로그래밍 대회 개최를 요청드립니다.
  
  현재 학생들은 외부 대회에 참가할 기회가 제한적이며, 대회를 준비하는 과정에서 실력을 쌓을 수 있는 교내 플랫폼이 부족합니다.
  
  정기적인 교내 프로그래밍 대회가 열린다면 다음과 같은 효과를 기대할 수 있습니다:
  
  1. 학생들의 코딩 실력 향상 및 문제 해결 능력 증진
  2. 팀워크와 협업 능력 개발 (팀 대회 시)
  3. 취업 및 진학에 도움이 될 포트폴리오 구축
  4. 프로그래밍에 대한 흥미 및 동기 부여
  5. 학과 간 교류 증진
  
  매 학기 1회, 연간 2회 정도의 정기 대회를 개최하여 학생들이 꾸준히 실력을 향상시킬 수 있는 환경을 만들어주시기를 요청드립니다.`,
    category: "교육과정",
    status: "expired" as StatusType,
    signatures: 210,
    goal: 300,
    deadline: "2023.05.10",
    createdAt: "2023.04.01",
    author: {
      name: "김미림",
      department: "소프트웨어과",
      grade: 2,
      avatar: "/placeholder.svg"
    },
    timeline: [
      { date: "2023.04.01", event: "청원 등록" },
      { date: "2023.04.05", event: "100명 서명 달성" },
      { date: "2023.04.15", event: "200명 서명 달성" },
      { date: "2023.04.20", event: "검토 시작" }
    ],
    comments: [
      {
        id: "c1",
        author: { name: "정소프트", avatar: "/placeholder.svg" },
        content: "정말 필요한 청원입니다. 저도 교내 프로그래밍 대회가 있으면 참가하고 싶습니다.",
        date: "2023.04.05",
        likes: 15
      },
      {
        id: "c2",
        author: { name: "이웹개발", avatar: "/placeholder.svg" },
        content: "제 생각에는 학기별 1회보다는 분기별 1회가 더 효과적일 것 같습니다.",
        date: "2023.04.07",
        likes: 8
      },
      {
        id: "c3",
        author: { name: "박교사", avatar: "/placeholder.svg", isTeacher: true },
        content: "좋은 제안입니다. 교사회의에서 논의해보겠습니다.",
        date: "2023.04.10",
        likes: 22
      }
    ]
  },{
    id: "10",
    title: "교내 프로그래밍 대회 정기 개최 요청",
    content: `미림마이스터고 학생들의 프로그래밍 실력 향상과 건전한 경쟁 환경 조성을 위해 정기적인 교내 프로그래밍 대회 개최를 요청드립니다.
  
  현재 학생들은 외부 대회에 참가할 기회가 제한적이며, 대회를 준비하는 과정에서 실력을 쌓을 수 있는 교내 플랫폼이 부족합니다.
  
  정기적인 교내 프로그래밍 대회가 열린다면 다음과 같은 효과를 기대할 수 있습니다:
  
  1. 학생들의 코딩 실력 향상 및 문제 해결 능력 증진
  2. 팀워크와 협업 능력 개발 (팀 대회 시)
  3. 취업 및 진학에 도움이 될 포트폴리오 구축
  4. 프로그래밍에 대한 흥미 및 동기 부여
  5. 학과 간 교류 증진
  
  매 학기 1회, 연간 2회 정도의 정기 대회를 개최하여 학생들이 꾸준히 실력을 향상시킬 수 있는 환경을 만들어주시기를 요청드립니다.`,
    category: "교육과정",
    status: "pending" as StatusType,
    signatures: 210,
    goal: 300,
    deadline: "2023.05.10",
    createdAt: "2023.04.01",
    author: {
      name: "김미림",
      department: "소프트웨어과",
      grade: 2,
      avatar: "/placeholder.svg"
    },
    timeline: [
      { date: "2023.04.01", event: "청원 등록" },
      { date: "2023.04.05", event: "100명 서명 달성" },
      { date: "2023.04.15", event: "200명 서명 달성" },
      { date: "2023.04.20", event: "검토 시작" }
    ],
    comments: [
      {
        id: "c1",
        author: { name: "정소프트", avatar: "/placeholder.svg" },
        content: "정말 필요한 청원입니다. 저도 교내 프로그래밍 대회가 있으면 참가하고 싶습니다.",
        date: "2023.04.05",
        likes: 15
      },
      {
        id: "c2",
        author: { name: "이웹개발", avatar: "/placeholder.svg" },
        content: "제 생각에는 학기별 1회보다는 분기별 1회가 더 효과적일 것 같습니다.",
        date: "2023.04.07",
        likes: 8
      },
      {
        id: "c3",
        author: { name: "박교사", avatar: "/placeholder.svg", isTeacher: true },
        content: "좋은 제안입니다. 교사회의에서 논의해보겠습니다.",
        date: "2023.04.10",
        likes: 22
      }
    ]
  }
];

export type StatusType = "pending" | "progress" | "answered" | "rejected" | "expired";

export interface Petition {
  id?: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  status: StatusType;
  signatures: number;
  goal: number;
  deadline: string;
  author: Author,
  timeline?: TimeLine[];
  comments?: Comment[];
  relatedPetitions?: Petition[];
  createdAt?: string;
}

export interface TimeLine { 
  date: string; 
  event: string
}

export interface Comment {
  id: string;
  author: Author;
  content: string;
  date: string;
  likes: number;
}

export interface Author {
  name: string;
  department?: string;
  grade?: number;
  avatar?: string;
  isTeacher?: boolean;
}

interface PetitionState {
  petitions: Petition[];
  currentPetition: Petition | null;
  addSign: (id: string) => void;
  addPetition: (petition: Petition) => void;
  fetchPetitions: () => void;
}

export const usePetitionStore = create<PetitionState>((set) => ({
  petitions: [],
  currentPetition: null,
  addSign: (id: string) => {
    set((state) => {
      const petition = state.petitions.find(p => p.id === id);
      if (petition) {
        petition.signatures += 1;
      }
      return { petitions: [...state.petitions] };
    });
  },
  addPetition: (petition: Petition) => {
    set((state) => ({
      petitions: [...state.petitions, { ...petition, id: (state.petitions.length + 1).toString() }]
    }));
  },
  fetchPetitions: () => {
    set({ petitions: mockPetitions });
  }
}));
