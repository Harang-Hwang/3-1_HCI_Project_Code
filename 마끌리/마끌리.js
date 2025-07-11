const voiceBtn = document.getElementById('b');
const transcript = document.getElementById('transcript');
const errorBox = document.getElementById('errorBox');
const switchSearchBtn = document.getElementById('switchSearchBtn');
const voiceBox = document.querySelector('.c');

const focusableItems = document.querySelectorAll('.focusable');
const slider = document.querySelector('.slider');
const itemWidth = 1130; // item width + margin-right
let currentIndex = 0;
let currentFocusIndex = 0;

const firstBox = document.querySelector('.a.focusable');

function setFocusToFirstBox() {
  document.querySelectorAll('.focused').forEach((el) => el.classList.remove('focused'));
  if (firstBox) {
    firstBox.classList.add('focused');
  }
}

function updateFocus(newElement) {
  document.querySelectorAll('.focused').forEach((el) => el.classList.remove('focused'));
  if (newElement) {
    newElement.classList.add('focused');
  }
}

function getNextElement(current, direction) {
  const currentRect = current.getBoundingClientRect();
  let minDistance = Infinity;
  let target = null;

  focusableItems.forEach((item) => {
    if (item === current) return;

    const rect = item.getBoundingClientRect();
    let valid = false;
    let distance = Infinity;

    switch (direction) {
      case 'ArrowRight':
        valid = rect.left > currentRect.left && Math.abs(rect.top - currentRect.top) < rect.height;
        break;
      case 'ArrowLeft':
        valid = rect.left < currentRect.left && Math.abs(rect.top - currentRect.top) < rect.height;
        break;
      case 'ArrowDown':
        valid = rect.top > currentRect.top && Math.abs(rect.left - currentRect.left) < rect.width;
        break;
      case 'ArrowUp':
        valid = rect.top < currentRect.top && Math.abs(rect.left - currentRect.left) < rect.width;
        break;
    }

    if (valid) {
      distance = Math.hypot(rect.left - currentRect.left, rect.top - currentRect.top);
      if (distance < minDistance) {
        minDistance = distance;
        target = item;
      }
    }
  });

  return target;
}

// 슬라이드 이동 함수 (포커스 이동과는 분리)
function slideTo(index) {
  const offset = index * itemWidth;
  slider.style.transform = `translateX(-${offset}px)`;
}

// 키보드 이벤트 핸들러
document.addEventListener('keydown', (e) => {
  const focused = document.querySelector('.focused');
  if (!focused) return;

  const direction = e.key;

  // 포커스 이동
  const next = getNextElement(focused, direction);
  if (next) {
    updateFocus(next);
  }

  // 슬라이드 동작 (슬라이더 영역 안의 focused 요소일 때만 시각적 이동 수행)
  if ((direction === 'ArrowRight' || direction === 'ArrowLeft') && focused.closest('.slide-item')) {
    if (direction === 'ArrowRight') {
      currentIndex++;
    } else if (direction === 'ArrowLeft') {
      currentIndex = Math.max(0, currentIndex - 1);
    }
    slideTo(currentIndex);
  }

  if (e.key === 'Enter' || e.key === 'OK') {
    if (focused.tagName === 'BUTTON' || focused.getAttribute('role') === 'button') {
      focused.click();
      e.preventDefault(); // 기본 동작 방지 (선택)
    }
  }
});

setFocusToFirstBox();

// ===== 음성 인식 기능 =====
let recognition;
let finalTranscript = '';

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();

  recognition.lang = 'ko-KR';
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  const validKeywords = ['마끌리'];

  recognition.onresult = (event) => {
    let interimTranscript = '';
    finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const result = event.results[i];
      let cleaned = result[0].transcript.replace(/[^가-힣a-zA-Z0-9 ]/g, '');

      if (result.isFinal) {
        finalTranscript += cleaned + ' ';
      } else {
        interimTranscript += cleaned;
      }
    }

    transcript.innerHTML = `<span>${finalTranscript}</span>` + `<span style="color: rgb(189, 189, 189);">${interimTranscript}</span>`;

    const lowerFinal = finalTranscript.trim().toLowerCase();
    const isMatch = validKeywords.some((word) => lowerFinal.includes(word.toLowerCase()));

    if (!isMatch && lowerFinal.length > 0) {
      errorBox.classList.remove('hidden');
    
  document.querySelector('.l1').textContent = "막걸리 11만원ㄷㄷ 미치겠다";
  document.querySelector('.l2').textContent = "흑백리뷰";
  document.querySelector('.l3').textContent = "조회수 11만회 · 6개월 전";
  document.querySelector('.l4').style.backgroundImage = "url('막걸리2.jpg')";
  document.querySelector('.l5').textContent = "1:30";

  document.querySelector('.m1').textContent = "16개 막걸리 싹 다 마셔봤습니다. 가장 맛있는..";
  document.querySelector('.m2').textContent = "술익는집";
  document.querySelector('.m3').textContent = "조회수 120만회 · 1년 전";
  document.querySelector('.m4').style.backgroundImage = "url('막걸리1.jpg')";
  document.querySelector('.m5').textContent = "20:37";

  document.querySelector('.n1').textContent = "의외로 모르는 맛있는 막걸리 TOP4";
  document.querySelector('.n2').textContent = "술익는집";
  document.querySelector('.n3').textContent = "조회수 31만회 · 3개월 전";
  document.querySelector('.n4').style.backgroundImage = "url('막걸리3.jpg')";
  document.querySelector('.n5').textContent = "13:32";

  document.querySelector('.o1').textContent = "이마트에서 파는 천원대 막걸리! 순위 정리해...";
  document.querySelector('.o2').textContent = "술담화";
  document.querySelector('.o3').textContent = "조회수 7.1민회 · 2년 전";
  document.querySelector('.o4').style.backgroundImage = "url('막걸리4.jpg')";
  document.querySelector('.o5').textContent = "10:16";

    } else {
      errorBox.classList.add('hidden');
    }
  };

  recognition.onerror = () => {
    transcript.textContent = '인식되지 않았습니다. 다시 말씀해주세요.';
  };

  recognition.onend = () => {
  voiceBox.classList.remove('listening'); // ✅ 인식 종료 시 효과 제거
};

} else {
  transcript.textContent = '음성 인식이 지원되지 않는 브라우저입니다.';
}

voiceBtn.addEventListener('click', () => {
  if (recognition) {
    recognition.abort();
    finalTranscript = '';
    transcript.innerHTML = '';
    recognition.start();
    transcript.innerHTML = '<span style="color: gray;">음성 인식 중...</span>';
    voiceBox.classList.add('listening');
  }
});




// 추천 키워드 기능
let recommendedKeyword = '마끌리';
switchSearchBtn.addEventListener('click', () => {
  finalTranscript = recommendedKeyword + ' ';
  transcript.innerHTML = `<span>${finalTranscript}</span>`;
  errorBox.classList.add('hidden');

  document.querySelector('.l1').textContent = "𝐏𝐥𝐚𝐲𝐥𝐢𝐬𝐭 이 시국에 듣는 플리🌿🕯 잊지 않겠...";
  document.querySelector('.l2').textContent = "마끌리";
  document.querySelector('.l3').textContent = "조회수 743회 · 1개월 전";
  document.querySelector('.l4').style.backgroundImage = "url('1.jpeg')";
  document.querySelector('.l4').style.backgroundColor ='rgb(192, 152, 20)';
  document.querySelector('.l5').textContent = "33:35";

  document.querySelector('.m1').textContent = "[𝑃𝑙𝑎𝑦𝑙𝑖𝑠𝑡] 밤이 길었던 것 같아₊·—̳͟͞͞♥ 새벽...";
  document.querySelector('.m2').textContent = "마끌리";
  document.querySelector('.m3').textContent = "조회수 26만회 · 2년 전";
  document.querySelector('.m4').style.backgroundImage = "url('2.jpeg')";
  document.querySelector('.m4').style.backgroundColor ='rgb(12, 10, 37)';
  document.querySelector('.m5').textContent = "28:51";

  document.querySelector('.n1').textContent = "𝐏𝐥𝐚𝐲𝐥𝐢𝐬𝐭 ⋰˚청춘의 포말˚˳°∘🌊";
  document.querySelector('.n2').textContent = "마끌리";
  document.querySelector('.n3').textContent = "조회수 3.8천회 · 6개월 전";
  document.querySelector('.n4').style.backgroundImage = "url('3.jpeg')";
  document.querySelector('.n5').textContent = "51:26";

  document.querySelector('.o1').textContent = "𝐏𝐥𝐚𝐲𝐥𝐢𝐬𝐭 난 그냥 아름다운 나야∘˚˳∘°🌹";
  document.querySelector('.o2').textContent = "마끌리";
  document.querySelector('.o3').textContent = "조회수 4.7천회 · 1년 전";
  document.querySelector('.o4').style.backgroundImage = "url('4.jpg')";
  document.querySelector('.o5').textContent = "47:46";
});

document.querySelectorAll('.btn-red').forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.classList.add('clicked');
  });
});

document.querySelectorAll('.btn-black').forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.classList.add('clicked');
  });
});