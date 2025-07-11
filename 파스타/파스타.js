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

  const validKeywords = ['푸타네스카 파스타'];


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

    document.querySelector('.l1').textContent = "Vlog | 반차 쓴 직장인은 관대하다 / 판 콘 토...";
    document.querySelector('.l2').textContent = "봉마카세 bongmakase";
    document.querySelector('.l3').textContent = "조회수 506회 · 3일 전";
    document.querySelector('.l4').style.backgroundImage = "url('오타2.png')";
    document.querySelector('.l5').textContent = "19:38";

    document.querySelector('.m1').textContent = "VLOG | 하루 단식하면 벌어지는 일 | 놀멍일...";
    document.querySelector('.m2').textContent = "박타민 TAMIN";
    document.querySelector('.m3').textContent = "조회수 3회 · 3시간 전";
    document.querySelector('.m4').style.backgroundImage = "url('오타1.png')";
    document.querySelector('.m5').textContent = "16:23";

    document.querySelector('.n1').textContent = "🥂이타닉가든 (Eatanic Garden) | 냉부해 셰...";
    document.querySelector('.n2').textContent = "피로요정 PIYO";
    document.querySelector('.n3').textContent = "조회수 1.8천회 · 2개월 전";
    document.querySelector('.n4').style.backgroundImage = "url('오타3.png')";
    document.querySelector('.n5').textContent = "9:00";

    document.querySelector('.o1').textContent = "도쿄 갈 땐, 수하물하고 밥주는 아프리카 항공...";
    document.querySelector('.o2').textContent = "손놈 : 셀카없는 항공 호텔리뷰";
    document.querySelector('.o3').textContent = "조회수 15만회 · 9개월 전";
    document.querySelector('.o4').style.backgroundImage = "url('오타4.png')";
    document.querySelector('.o5').textContent = "13:32";

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
let recommendedKeyword = '푸타네스카 파스타';
switchSearchBtn.addEventListener('click', () => {
  finalTranscript = recommendedKeyword + ' ';
  transcript.innerHTML = `<span>${finalTranscript}</span>`;
  errorBox.classList.add('hidden');

  document.querySelector('.l1').textContent = "28.푸타네스카(Spaghetti alla puttanesca)";
  document.querySelector('.l2').textContent = "김밀란";
  document.querySelector('.l3').textContent = "조회수 3.8만회 · 5년 전";
  document.querySelector('.l4').style.backgroundImage = "url('검색전환2.png')";
  document.querySelector('.l4').style.backgroundColor = "#181818";
  document.querySelector('.l5').textContent = "14:36";

  document.querySelector('.m1').textContent = "이탈리아 남부 나폴리의 풍미를 그대로 느낄 ...";
  document.querySelector('.m2').textContent = "김밀란";
  document.querySelector('.m3').textContent = "조회수 6.4만회 · 2년 전";
  document.querySelector('.m4').style.backgroundImage = "url('검색전환1.png')";
  document.querySelector('.m4').style.backgroundColor = "#181818";
  document.querySelector('.m5').textContent = "9:01";

  document.querySelector('.n1').textContent = "푸타네스카 스파게티 Spaghetti alla Puttan...";
  document.querySelector('.n2').textContent = "파스타 디벨라 DIVELLA";
  document.querySelector('.n3').textContent = "조회수 1.5천회 · 3년 전";
  document.querySelector('.n4').style.backgroundImage = "url('검색전환3.png')";
  document.querySelector('.n4').style.backgroundColor = "#181818";
  document.querySelector('.n5').textContent = "3:46";

  document.querySelector('.o1').textContent = "파스타 예쁘게 담는 방법 | SNS용 파스타 플...";
  document.querySelector('.o2').textContent = "gonet 고네뜨 GOON ONE TABLE";
  document.querySelector('.o3').textContent = "조회수 41만회 · 3년 전";
  document.querySelector('.o4').style.backgroundImage = "url('검색전환4.png')";
  document.querySelector('.o4').style.backgroundColor = "#181818";
  document.querySelector('.o5').textContent = "5:56";
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