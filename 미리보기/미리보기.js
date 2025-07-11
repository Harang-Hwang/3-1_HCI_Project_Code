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

  const validKeywords = ['미리보기'];


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

    document.querySelector('.l1').textContent = "구글독스 컴퓨터 오디오 음성인식 안될때 - 1...";
    document.querySelector('.l2').textContent = "슈쥬파파";
    document.querySelector('.l3').textContent = "조회수 5.3천회 · 4년 전";
    document.querySelector('.l4').style.backgroundImage = "url('오타2.jpg')";
    document.querySelector('.l5').textContent = "1:20";

    document.querySelector('.m1').textContent = "[B tv 활용백서] 음성검색으로 빠르게 찾기 편";
    document.querySelector('.m2').textContent = "SK브로드밴드_B tv";
    document.querySelector('.m3').textContent = "조회수 5.3천회 · 7년 전";
    document.querySelector('.m4').style.backgroundImage = "url('오타1.jpg')";
    document.querySelector('.m5').textContent = "0:45";

    document.querySelector('.n1').textContent = "스카이라이프 리모컨 음성인식 안될 때, 음성 ...";
    document.querySelector('.n2').textContent = "생활 리뷰 취미 Life review hobby";
    document.querySelector('.n3').textContent = "조회수 1.7만회 · 3년 전";
    document.querySelector('.n4').style.backgroundImage = "url('오타3.jpg')";
    document.querySelector('.n5').textContent = "0:38";

    document.querySelector('.o1').textContent = "이거 완전 내 목소리인데? AI 너 뭐 돼? [AI 보...";
    document.querySelector('.o2').textContent = "KT - 케이티";
    document.querySelector('.o3').textContent = "조회수 395만회 · 2년 전";
    document.querySelector('.o4').style.backgroundImage = "url('오타4.jpg')";
    document.querySelector('.o5').textContent = "0:30";

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
let recommendedKeyword = '미리보기';
switchSearchBtn.addEventListener('click', () => {
  finalTranscript = recommendedKeyword + ' ';
  transcript.innerHTML = `<span>${finalTranscript}</span>`;
  errorBox.classList.add('hidden');

  document.querySelector('.l1').textContent = "낭만은 다 담았다는 국산 MMORPG 대작, 크...";
  document.querySelector('.l2').textContent = "흑열전구";
  document.querySelector('.l3').textContent = "조회수 1.2만회 · 1일 전";
  document.querySelector('.l4').style.backgroundImage = "url('검색전환2.png')";
  document.querySelector('.l4').style.backgroundColor = "#181818";
  document.querySelector('.l5').textContent = "9:43";

  document.querySelector('.m1').textContent = "[굿데이 미리보기] 달라진 데프콘의 위상?! 래...";
  document.querySelector('.m2').textContent = "MBCentertainment";
  document.querySelector('.m3').textContent = "조회수 181만회 · 3개월 전";
  document.querySelector('.m4').style.backgroundImage = "url('검색전환1.png')";
  document.querySelector('.m4').style.backgroundColor = "#181818";
  document.querySelector('.m5').textContent = "1:52";

  document.querySelector('.n1').textContent = "[미리보기] 이무진X박보검 - 신호등 [더 시즌...";
  document.querySelector('.n2').textContent = "KBSKpop";
  document.querySelector('.n3').textContent = "조회수 7.9천회 · 4시간 전";
  document.querySelector('.n4').style.backgroundImage = "url('검색전환3.png')";
  document.querySelector('.n4').style.backgroundColor = "#3F5468";
  document.querySelector('.n5').textContent = "0:32";

  document.querySelector('.o1').textContent = "[슈팅스타 캐치! 티니핑] ⭐️24화 미리보기 |...";
  document.querySelector('.o2').textContent = "티니핑TV";
  document.querySelector('.o3').textContent = "조회수 33만회 · 1개월 전";
  document.querySelector('.o4').style.backgroundImage = "url('검색전환4.png')";
  document.querySelector('.o4').style.backgroundColor = "#181818";
  document.querySelector('.o5').textContent = "0:57";
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