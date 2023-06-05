# 1번 리뷰

* 범위 : /js/*

* 전체 개요
JS를 design, index,problem_selectBox로 나누었습니다.
해당 JS나누는 기준을 저는 index는 api관련된것, design은 CSS를 JS로 컨트롤해야될때, problem_selectBox는 json파일을 불러올때 사용합니다.

# 2번 리뷰

* 범위 : /js/design.js , /css/index.css

* 전체 개요
JS에서 수정하는경우 tailwindCSS로는 해결이 안될꺼같아서 CSS를 따로 만듬

# 3번 리뷰

* 범위 : /js/index.js 147 ~ 174 line

* 전체 개요
해당 기능은 chatGPT에게 api를 보내는 기능입니다.
해당 기능을 문제, 질의응답을 보낼때 api를 보내는건 같지만 data를 받아온 후 데이터 처리하는 방식이 다릅니다 이때 매개변수로 if처리로 분류
