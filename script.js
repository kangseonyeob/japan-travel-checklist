// 저장 키
const STORAGE_KEY = 'japan-travel-checklist';

// 페이지 로드 시 저장된 데이터 복원
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    // 모든 체크박스에 이벤트 리스너 추가
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', saveData);
    });
    
    // 모든 입력 필드에 이벤트 리스너 추가
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        input.addEventListener('input', saveData);
    });
});

// 데이터 저장
function saveData() {
    const data = {
        checkboxes: {},
        unnecessary: {},
        info: {}
    };
    
    // 체크박스 상태 저장
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        data.checkboxes[checkbox.id] = checkbox.checked;
    });
    
    // 불필요한 항목 상태 저장
    const unnecessaryItems = document.querySelectorAll('.checkbox-item.unnecessary');
    unnecessaryItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) {
            data.unnecessary[checkbox.id] = true;
        }
    });
    
    // 입력 필드 데이터 저장
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        data.info[input.id] = input.value;
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// 데이터 로드
function loadData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) return;
    
    try {
        const data = JSON.parse(savedData);
        
        // 체크박스 상태 복원
        if (data.checkboxes) {
            Object.keys(data.checkboxes).forEach(id => {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    checkbox.checked = data.checkboxes[id];
                }
            });
        }
        
        // 불필요한 항목 상태 복원
        if (data.unnecessary) {
            Object.keys(data.unnecessary).forEach(id => {
                const checkbox = document.getElementById(id);
                if (checkbox && data.unnecessary[id]) {
                    const item = checkbox.closest('.checkbox-item');
                    if (item) {
                        item.classList.add('unnecessary');
                    }
                }
            });
        }
        
        // 입력 필드 데이터 복원
        if (data.info) {
            Object.keys(data.info).forEach(id => {
                const input = document.getElementById(id);
                if (input) {
                    input.value = data.info[id];
                }
            });
        }
    } catch (error) {
        console.error('저장된 데이터를 불러오는 중 오류가 발생했습니다:', error);
    }
}

// 불필요한 항목 토글
function toggleUnnecessary(itemId) {
    const checkbox = document.getElementById(itemId);
    if (!checkbox) return;
    
    const item = checkbox.closest('.checkbox-item');
    if (!item) return;
    
    item.classList.toggle('unnecessary');
    
    // 불필요한 항목으로 표시되면 체크박스도 해제
    if (item.classList.contains('unnecessary')) {
        checkbox.checked = false;
    }
    
    saveData();
}

// 데이터 초기화 (필요시 사용)
function resetData() {
    if (confirm('모든 데이터를 초기화하시겠습니까?')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    }
}

// 데이터 내보내기 (선택사항)
function exportData() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'japan-travel-checklist.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else {
        alert('저장된 데이터가 없습니다.');
    }
} 