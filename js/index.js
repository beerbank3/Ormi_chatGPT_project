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

function LoadingWithMask(select) {
  let container;
  if (select === "answer") {
    container = document.querySelector('ul');
  } else if (select === "problem") {
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

function closeLoadingWithMask(select) {
  let container;
  if (select === "answer") {
    container = document.querySelector('ul');
  } else if (select === "problem") {
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
const apiPost = async () => {
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
  closeLoadingWithMask("answer")
};

const problemApiPost = async (problemData) => {
  const result = await axios({
    method: "post",
    maxBodyLength: Infinity,
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(problemData),
  });
  try {
    console.log(result.data);
    data.push(problemData.find(item => item.role === 'user'));
    printProblem(result.data.choices[0].message.content);
  } catch (err) {
    console.log(err);
  }
  closeLoadingWithMask("problem")
};

// submit
$form.addEventListener("submit", (e) => {
  e.preventDefault();
  $textarea.value = null;
  sendQuestion(question);
  apiPost();
  printQuestion();
  LoadingWithMask("answer")
});

const selectElement = document.getElementById('problem-select');

selectElement.addEventListener('change', handleSelectChange);

function handleSelectChange(event) {
  const selectedValue = event.target.value;
  let problemData = [
    {
      role: "system",
      content: "assistant는 프로그래머스 Python 코딩테스트 전문가이다.",
    },
    {
      role: "user",
      content: selectedValue+"문제에 대해 설명하고 이 문제를 어떻게 해결하면 되고 그리고 어떤방식으로 풀면 가장 좋은지 알려줘 단 풀이과정이나 풀이코드는 알려주지마",
    },
  ];
  problemApiPost(problemData);
  console.log(problemData);
  LoadingWithMask("problem")
}