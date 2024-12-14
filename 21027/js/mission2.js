let fileCounter = 0;

function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('active');
}

function previewFile(input) {
  const fileData = new FileReader();
  fileData.onload = function () {
    const preview = document.getElementById('preview');
    preview.src = fileData.result;
    fileCounter++;
  };
  fileData.readAsDataURL(input.files[0]);
}

function completeMission() {
  if (fileCounter === 1) {
    let points = parseInt(localStorage.getItem('points')) || 0;
    points += 20;
    localStorage.setItem('points', points);

    alert('撃破した！');

    const targetImages = document.querySelectorAll('img');

    targetImages.forEach((targetImage) => {

      switch (targetImage.alt) {
        case "egg":
          targetImage.src = 'img/egg2.png'; 
          targetImage.style.width = '100px';
          targetImage.style.height = 'auto';
          break;

        case 'eggplant':
          targetImage.src = 'img/eggplant2.png';
          targetImage.style.width = '120px';
          targetImage.style.height = 'auto';
          break;

        case 'tomato':
          targetImage.src = 'img/tomato2.png';
          targetImage.style.width = '120px';
          targetImage.style.height = 'auto';
          break;

        case 'paprika':
          targetImage.src = 'img/paprika2.png';
          targetImage.style.width = '280px';
          targetImage.style.height = 'auto';
          break;

        case 'potato':
          targetImage.src = 'img/potato2.png';
          targetImage.style.width = '150px';
          targetImage.style.height = 'auto';
          break;
        
        case 'onion':
          targetImage.src = 'img/onion2.png';
          targetImage.style.width = '150px';
          targetImage.style.height = 'auto';
          break;

        case 'carrot':
        targetImage.src = 'img/carrot2.png';
        targetImage.style.width = '80px';
        targetImage.style.height = 'auto';
        break;

        case 'cabbage':
        targetImage.src = 'img/cabbage2.png';
        targetImage.style.width = '200px';
        targetImage.style.height = 'auto';
        break;
      }

      targetImage.classList.remove('keyframe', 'animation');
    });

      const ClearText = document.getElementById('clear-text'); 
      if (ClearText) {
        ClearText.innerText = "ロスエネミーを撃破した！"; 
      }

      const completeButton = document.getElementById('complete-mission-button');
      completeButton.style.display = 'none';
  
      const nextMissionButton = document.getElementById('next-mission-button');
      nextMissionButton.style.display = 'inline-block'; 
    } else {
      alert('料理を完成させろ');
    }
  }

function goToNextMission(missionNumber) {
  const nextMissionUrl = `mission1_${missionNumber}.html`;
  window.location.href = nextMissionUrl;
}
