import { printAnswer, printProblem, closeLoadingWithMask, data} from '../js/chat.js';
// openAI API
const URL = `https://estsoft-openai-api.jejucodingcamp.workers.dev/`;

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
    url: URL,
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

export default apiPost;