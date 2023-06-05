const $form = document.querySelector("form");
const $textarea = document.querySelector("textarea");
const $chatList = document.querySelector("ul");
const $problemBoard = document.getElementById("problem");

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

// 화면에 문제에 대한 설명 그려주는 함수
const printProblem = async (problem) => {
  let p = document.createElement("p");
  p.innerText = problem;
  $problemBoard.appendChild(p);
  if (problem) {
    data.push({
      role: "assistant",
      content: problem,
    });
  }
  console.log(data)
};
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

  if (container) {
    var loadingImg = document.createElement('li');
    // 마스크를 설정합니다.
    loadingImg.id = 'loadingImg';
    loadingImg.innerHTML = "<img src='./image/LoadingImg.gif' style='position: relative; display: block; margin: 0px auto; '/>";

    // .container 요소에 마스크와 로딩 이미지 추가
    container.appendChild(loadingImg);

    // 로딩중 이미지 표시
    loadingImg.style.display = 'block';
  }
}
/**
 * mask된 이미지를 없애는 함수입니다.
 * 문제쪽 이미지와 질의응답쪽 이미지를 따로 분류해서 없앱니다
 */
function closeLoadingWithMask(operationType) {
  let container;
  if (operationType === "question") {
    container = document.querySelector('ul');
  } else if (operationType === "problem") {
    container = $problemBoard;
  }

  var loadingImg = container.querySelector('#loadingImg');
  if (loadingImg) {
    loadingImg.style.display = 'none';
    if(container){
      container.removeChild(loadingImg);
    }
  }
}

// api 요청보내는 함수
/**
 * 문제에 대한 API post를 보냅니다.
 * 해당 코드에서 operationType은
 * 문제 선택 = problem
 * 질의 응답 =  question로 들어가면서 if문에서 분류가 됩니다.
 */
const apiPost = async (operationType) => {
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
    if(operationType==="question"){
      printAnswer(result.data.choices[0].message.content);
    }else if(operationType==="problem"){
      printProblem(result.data.choices[0].message.content);
    }
  } catch (err) {
    console.log(err);
  }
  if(operationType==="question"){
    closeLoadingWithMask("question")
  }else if(operationType==="problem"){
    closeLoadingWithMask("problem")
  }
};

// submit
$form.addEventListener("submit", (e) => {
  e.preventDefault();
  $textarea.value = null;
  sendQuestion(question);
  apiPost("question");
  printQuestion();
  LoadingWithMask("question")
});

const selectElement = document.getElementById('problem-select');

selectElement.addEventListener('change', handleSelectChange);

/**
 * 셀렉트 박스에 선택된 문제에 대한 설명한다.
 * selectedValue ex)완주하지 못한 선수
 */
function handleSelectChange(event) {
  const selectedValue = event.target.value;
  data.push({
      role: "user",
      content: selectedValue+"문제에 대해 설명하고 이 문제를 어떻게 해결하면 되고 그리고 어떤방식으로 풀면 가장 좋은지 알려주고 자료형과 자료형 선언방식, 라이브러리를 사용했다면 그 라이브러리에대한 설명과 라이브러리의 예시도 알려줘",
  });
  apiPost("problem");
  LoadingWithMask("problem")
}