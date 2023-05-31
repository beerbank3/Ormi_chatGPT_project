const $form = document.querySelector("form");
const $textarea = document.querySelector("textarea");
const $chatList = document.querySelector("ul");

// openAI API
let url = `https://estsoft-openai-api.jejucodingcamp.workers.dev/`;

// 사용자의 질문
let question;

// 질문과 답변 저장
let data = [
  {
    role: "system",
    content: "assistant는 프로그래머스 Python 코딩테스트 전문가이다.",
  },
];
// 화면에 뿌려줄 데이터, 질문들
let questionData = [];

textarea.addEventListener("keydown", (e) => {
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
const printQuestion = async () => {
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
const printAnswer = async (answer) => {
  let li = document.createElement("li");
  li.classList.add("answer");
  li.innerText = answer;
  $chatList.appendChild(li);
  if (answer) {
    data.push({
      role: "assistant",
      content: answer,
    });
  }
};
function LoadingWithMask() {
  var container = document.querySelector('.container');

  // 화면의 높이와 너비를 구합니다.
  var maskHeight = Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0
  );

  // 마스크를 설정합니다.

  var loadingImg = document.createElement('div');
  loadingImg.id = 'loadingImg';
  loadingImg.innerHTML = "<img src='./image/LoadingImg.gif' style='position: relative; display: block; margin: 0px auto;'/>";

  // .container 요소에 마스크와 로딩 이미지 추가
  container.appendChild(loadingImg);

  // 로딩중 이미지 표시
  loadingImg.style.display = 'block';
}

function closeLoadingWithMask() {
  var loadingImg = document.getElementById('loadingImg');

  if (loadingImg) {
    loadingImg.style.display = 'none';

    // .container 요소에서 마스크와 로딩 이미지 제거
    var container = document.querySelector('.container');
    if (container) {
      container.removeChild(loadingImg);
    }
  }
}

// api 요청보내는 함수
const apiPost = async () => {
  LoadingWithMask()
  const result = await axios({
    method: "post",
    maxBodyLength: Infinity,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(data),
  });
  try {
    console.log(result.data);
    printAnswer(result.data.choices[0].message.content);
  } catch (err) {
    console.log(err);
  }
  closeLoadingWithMask()
};

// submit
$form.addEventListener("submit", (e) => {
  e.preventDefault();
  $textarea.value = null;
  sendQuestion(question);
  apiPost();
  printQuestion();
});