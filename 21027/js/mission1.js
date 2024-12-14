function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

const unitMap = {
    'ごはん': '合',
    'うどん': '玉',
    '卵': '個',
    '長ネギ': '本',
    '紅ショウガ': 'g',
    'なす': '本',
    '牛肉': 'g',
    '玉ねぎ': '個',
    'ピーマン': '個',
    '鶏もも': 'g',
    'もやし': 'g',
    'パプリカ': '個',
    'にんにく': '片',
    'じゃがいも': '個',
    'ベーコン': '枚',
    'バター': 'g',
    'アスパラ': '本',
    'チーズ': 'g',
    'パスタ': 'g',
    'しめじ': '個',
    'にんじん': '個',
    '里芋': '個',
    'ごぼう': '本',
    'こんにゃく': '個',
    '舞茸': '個',
    'きゃべつ': '個',
    'トマト': '個',
    'other': '' 
};

function guessUnitByName(name) {
    if (unitMap[name]) {
        return unitMap[name];
    }
}

document.getElementById('name').addEventListener('change', function() {
    const selectedValue = this.value;
    const unitLabel = document.getElementById('unit-label');
    const otherNameInput = document.getElementById('otherName');
    const otherNameLabel = document.getElementById('otherNameLabel');

    if (selectedValue === 'other') {
        otherNameInput.style.display = 'block';
        otherNameLabel.style.display = 'block';
        unitLabel.textContent = '';  
    } else {
        otherNameInput.style.display = 'none';
        otherNameLabel.style.display = 'none';
        unitLabel.textContent = unitMap[selectedValue] || '個';
    }
});

document.getElementById('ingredient-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const nameSelect = document.getElementById('name');
    const selectedName = nameSelect.value;
    const otherName = document.getElementById('otherName').value;
    const name = selectedName === 'other' ? otherName : selectedName;

    const unit = selectedName === 'other' ? guessUnitByName(otherName) : unitMap[selectedName] || '個';
    
    const quantity = parseFloat(document.getElementById('quantity').value);

    const now = new Date();
    const formattedDate = now.toLocaleString();

    const ingredient = {
        name: name,
        quantity: quantity,
        unit: unit,
        date: formattedDate,
    };
    saveIngredient(ingredient);
    document.getElementById('ingredient-form').reset();
});

document.getElementById('otherName').addEventListener('input', function() {
    const otherName = this.value;
    const unitLabel = document.getElementById('unit-label');

    const guessedUnit = guessUnitByName(otherName);
    unitLabel.textContent = guessedUnit;
});

function saveIngredient(ingredient) {
    let ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];
    const existingIngredient = ingredients.find(ing => ing.name === ingredient.name);

    if (existingIngredient) {
        existingIngredient.quantity += ingredient.quantity;
    } else {
        ingredients.push(ingredient);
    }

    localStorage.setItem('ingredients', JSON.stringify(ingredients));
    displayStoredIngredients();
    updateChecklist(ingredient.name);
}

function displayStoredIngredients() {
    const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];
    const output = document.getElementById('output');
    output.innerHTML = '';

    ingredients.forEach(ingredient => {
        const outputItem = document.createElement('div');
        outputItem.innerHTML = `
            <strong>食材名:</strong> ${ingredient.name}<br>
            <strong>数量:</strong> ${ingredient.quantity} ${ingredient.unit}<br>
            <strong>登録した日時:</strong> ${ingredient.date}<br>
            <button class="delete-button" onclick="deleteIngredient('${ingredient.name}')">削除</button><br>`;
        output.appendChild(outputItem);
    });

    updateChecklist();
}

function updateChecklist() {
    const ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];
    const checkboxes = document.querySelectorAll('.check-item');

    checkboxes.forEach(checkbox => {
        const ingredient = ingredients.find(ing => ing.name === checkbox.dataset.name);
        if (ingredient && ingredient.quantity >= checkbox.dataset.quantity) {
            checkbox.checked = true;
        }
    });

    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    if (allChecked) {
        document.getElementById('mission-button').style.display = 'block';
    }
}

function deleteIngredient(name) {
    let ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];
    ingredients = ingredients.filter(ing => ing.name !== name);
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
    displayStoredIngredients();
    updateChecklist();
}

function goToNextMission(missionNumber) {
    let ingredients = JSON.parse(localStorage.getItem('ingredients')) || [];
    const checkboxes = document.querySelectorAll('.check-item');
    let insufficientIngredients = '';

    checkboxes.forEach(checkbox => {
        const requiredQuantity = parseFloat(checkbox.dataset.quantity);
        const ingredientIndex = ingredients.findIndex(ing => ing.name === checkbox.dataset.name);

        if (ingredientIndex !== -1) {
            const ingredient = ingredients[ingredientIndex];
            const currentQuantity = parseFloat(ingredient.quantity);
            const difference = currentQuantity - requiredQuantity; 

            if (difference < 0) {
                insufficientIngredients += `${ingredient.name}: ${-difference} ${ingredient.unit}不足しています。\n`; 
            } else if (difference === 0) {
                ingredients.splice(ingredientIndex, 1);
            } else {
                ingredient.quantity = difference;
            }
        } else {
            insufficientIngredients += `${checkbox.dataset.name}: ${requiredQuantity} ${unitMap[checkbox.dataset.name]}不足しています。\n`;
        }
    });

    if (insufficientIngredients) {
        alert("以下の食材が不足しています:\n" + insufficientIngredients);
    } else {
        localStorage.setItem('ingredients', JSON.stringify(ingredients)); 
        
        window.location.href = `mission2_${missionNumber}.html`; 
    }
}

document.addEventListener('DOMContentLoaded', function() {
    displayStoredIngredients();
});
