const textarea = document.getElementById('area');

textarea.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px'; // 내용에 맞게 너비 조정
});
