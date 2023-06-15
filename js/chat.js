import apiPost from '../js/api.js';

const $form = document.querySelector("form");
const $scrollContainer = document.querySelector('.scroll-container');
const $textarea = document.querySelector("textarea");
const $chatList = document.querySelector("ul");
const $problemBoard = document.getElementById("problem");
const $selectElement = document.getElementById('problem-select');
// 사용자의 질문
let question;

// 질문과 답변 저장
export let data = [
  {
    role: "system",
    content: "assistant는 프로그래머스 Python 코딩테스트 전문가이다.",
  },
];

// 화면에 뿌려줄 데이터, 질문들
let questionData = [];

$textarea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.shiftKey) {
    e.preventDefault();
    textarea.value += "\n";
  }
  else if (e.key === "Enter") {
    e.preventDefault();
    $form.dispatchEvent(new Event("submit"));
  }
});

// input에 입력된 질문 받아오는 함수
$textarea.addEventListener("input", (e) => {
  question = e.target.value;
});

// 사용자의 질문을 객체를 만들어서 push
const sendQuestion = (question) => {
  if (question) {
    data.push({
      role: "user",
      content: question,
    });
    questionData.push({
      role: "user",
      content: question,
    });
  }
};

// 화면에 질문 그려주는 함수
export function printQuestion() {
  if (question) {
    let li = document.createElement("li");
    li.classList.add("question");
    questionData.map((el) => {
      li.innerText = el.content;
    });
    $chatList.appendChild(li);
    questionData = [];
    question = false;
  }
};

// 화면에 답변 그려주는 함수
export function printAnswer(answer) {
  let li = document.createElement("li");
  li.classList.add("answer");
  li.innerHTML = convertMarkdown(answer);
  $chatList.appendChild(li);
  if (answer) {
    data.push({
      role: "assistant",
      content: answer,
    });
  }
};

// 화면에 문제에 대한 설명 그려주는 함수
export function printProblem(problem) {
  let p = document.createElement("p");
  p.innerHTML = convertMarkdown(problem);
  $problemBoard.appendChild(p);
  if (problem) {
    data.push({
      role: "assistant",
      content: problem,
    });
  }
};

function convertMarkdown(content) {
  let matches = content.match(/```python([\s\S]*?)```/g);
  if (matches) {
    for (let i = 0; i < matches.length; i++) {
      let match = marked.parse(matches[i]);
      content = content.replace(/```python([\s\S]*?)```/g, match);
    }
  }
  content = content.replace(/\n/g, "<br>");
  return content;
}
/**
 * mask이미지를 생성합니다.
 * 문제쪽 이미지와 질의응답쪽 이미지를 따로 분류해서 생성합니다.
 */
function LoadingWithMask(operationType) {
  let container;
  if (operationType === "question") {
    container = document.querySelector('ul');
  } else if (operationType === "problem") {
    container = $problemBoard;
  }

  const loadingImg = document.createElement('li');
  // 마스크를 설정합니다.
  loadingImg.id = 'loadingImg';
  loadingImg.innerHTML = "<img src='./image/LoadingImg.gif' style='position: relative; display: block; margin: 0px auto; '/>";

  // .container 요소에 마스크와 로딩 이미지 추가
  container.appendChild(loadingImg);

  // 로딩중 이미지 표시
  loadingImg.style.display = 'block';
  
}
/**
 * mask된 이미지를 없애는 함수입니다.
 * 문제쪽 이미지와 질의응답쪽 이미지를 따로 분류해서 없앱니다
 */
export function closeLoadingWithMask(operationType) {
  let container;
  if (operationType === "question") {
    container = document.querySelector('ul');
  } else if (operationType === "problem") {
    container = $problemBoard;
  }

  const loadingImg = container.querySelector('#loadingImg');
  if (loadingImg) {
    loadingImg.style.display = 'none';
    container.removeChild(loadingImg);
  }
}

// submit
$form.addEventListener("submit", (e) => {
  e.preventDefault();
  $textarea.value = null;
  if (!question) {
    alert("값이 없습니다!");
    return;
  }
  sendQuestion(question);
  apiPost("question");
  printQuestion();
  LoadingWithMask("question")
  $textarea.style.height = 'auto';
  $scrollContainer.scrollTop = $scrollContainer.scrollHeight;
});

$selectElement.addEventListener('change', handleSelectChange);

/**
 * 셀렉트 박스에 선택된 문제에 대한 설명한다.
 * selectedValue ex)완주하지 못한 선수
 */
function handleSelectChange(event) {
  $problemBoard.innerHTML = "";
  const selectedValue = event.target.value;
  data.push({
      role: "user",
      content: selectedValue+"문제에 대해 설명하고 이 문제를 어떻게 해결하면 되고 그리고 어떤방식으로 풀면 가장 좋은지 알려주고 자료형과 자료형 선언방식, 라이브러리를 사용했다면 그 라이브러리에대한 설명과 라이브러리의 예시도 알려줘",
  });
  LoadingWithMask("problem")
  apiPost("problem");
}