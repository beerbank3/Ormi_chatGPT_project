document.addEventListener("DOMContentLoaded", function() {
    // JSON 파일 읽기
    axios.get("./data/problem_list.json")
        .then(response => {
            const data = response.data;
            // select 박스에 옵션 추가
            const selectBox = document.getElementById("problem-select");
            data.forEach(problem => {
                const option = document.createElement("option");
                option.value = problem.name;
                option.textContent = `${problem.difficulty} - ${problem.name}`;
                selectBox.appendChild(option);
            });
        });
});