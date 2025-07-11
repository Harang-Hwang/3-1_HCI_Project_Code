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

  const validKeywords = ['똠카가이'];

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
    
  document.querySelector('.l1').textContent = "똥안나올때 듣는 노래 (Dong call 똥 콜💩)";
  document.querySelector('.l2').textContent = "담다미담";
  document.querySelector('.l3').textContent = "조회수 214만회 · 2년 전";
  document.querySelector('.l4').style.backgroundImage = "url('오타2.png')";
  document.querySelector('.l5').textContent = "2:38";

  document.querySelector('.m1').textContent = "🎪 홍철책빵 김해점! 🚗 럭키가이카페, 홍카 ...";
  document.querySelector('.m2').textContent = "스댕왕 철대리";
  document.querySelector('.m3').textContent = "조회수 2만회 · 1년 전";
  document.querySelector('.m4').style.backgroundImage = "url('오타1.png')";
  document.querySelector('.m5').textContent = "8:57";

  document.querySelector('.n1').textContent = "뿡뿡 응가 체조 | 방귀가 뿌웅 똥 나와라 체조...";
  document.querySelector('.n2').textContent = "핑크퐁 (인기 동요・동화)";
  document.querySelector('.n3').textContent = "조회수 3469만회 · 8개월 전";
  document.querySelector('.n4').style.backgroundImage = "url('오타3.png')";
  document.querySelector('.n5').textContent = "4:35";

  document.querySelector('.o1').textContent = "[카가이 | 아재라이드] 꼭 미니밴 타는 느낌이...";
  document.querySelector('.o2').textContent = "CARGUY / 아재라이드";
  document.querySelector('.o3').textContent = "조회수 6.6만회 · 3년 전";
  document.querySelector('.o4').style.backgroundImage = "url('오타4.png')";
  document.querySelector('.o5').textContent = "24:50";

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
let recommendedKeyword = '똠카가이';
switchSearchBtn.addEventListener('click', () => {
  finalTranscript = recommendedKeyword + ' ';
  transcript.innerHTML = `<span>${finalTranscript}</span>`;
  errorBox.classList.add('hidden');

  document.querySelector('.l1').textContent = "톰 카 가이 수프 인스턴트 포트 | 태국 코코넛...";
  document.querySelector('.l2').textContent = "Foodies Terminal";
  document.querySelector('.l3').textContent = "조회수 6.2만회 · 2년 전";
  document.querySelector('.l4').style.backgroundImage = "url('검색전환2.png')";
  document.querySelector('.l5').textContent = "2:07";

  document.querySelector('.m1').textContent = "똠카가이 수프 만드는 방법 - 최고의 똠카가...";
  document.querySelector('.m2').textContent = "Online Culinary School";
  document.querySelector('.m3').textContent = "조회수 2.5만회 · 3년 전";
  document.querySelector('.m4').style.backgroundImage = "url('검색전환1.png')";
  document.querySelector('.m5').textContent = "10:38";

  document.querySelector('.n1').textContent = "태국식 치킨 코코넛 수프 똠카가이(Tom Kha ...";
  document.querySelector('.n2').textContent = "Thailand Unplugged";
  document.querySelector('.n3').textContent = "조회수 2.6천회 · 1년 전";
  document.querySelector('.n4').style.backgroundImage = "url('검색전환3.png')";
  document.querySelector('.n5').textContent = "16:36";

  document.querySelector('.o1').textContent = "톰카(Tom Kha)와 락사(Laksa)가 맛있는 이...";
  document.querySelector('.o2').textContent = "My Name Is Andong";
  document.querySelector('.o3').textContent = "조회수 20만회 · 2개월 전";
  document.querySelector('.o4').style.backgroundImage = "url('검색전환4.png')";
  document.querySelector('.o5').textContent = "18:12";
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