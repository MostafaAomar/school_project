

async function fetchDefinition() {
    const word = document.getElementById('wordInput').value;
    if (word.trim() === '') {
        document.getElementById('output').innerHTML = '';
        return;
    }

    try {
        // Fetch from custom JSON file
        const customResponse = await fetch('https://github.com/MostafaAomar/school_project/blob/main/myOwnDic.json');
        const customData = await customResponse.json();
        const customWord = customData.find(entry => entry.word.toLowerCase() === word.toLowerCase());

        if (customWord) {
            displayDefinition([customWord]);
            return;
        }

        // Fetch from API
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('هذه الكلمه غير موجوده في القاموس');
        }
        const data = await response.json();
        displayDefinition(data);
    } catch (error) {
        document.getElementById('output').textContent = error.message;
    }
}

function displayDefinition(data) {
    const output = document.getElementById('output');
    output.innerHTML = '';

    data.forEach(entry => {
        const word = document.createElement('h2');
        word.textContent = entry.word;
        output.appendChild(word);

        entry.phonetics.forEach(phonetic => {
            const phoneticText = document.createElement('p');
            phoneticText.textContent = `Phonetic: ${phonetic.text}`;
            output.appendChild(phoneticText);

            if (phonetic.audio) {
                const audio = document.createElement('audio');
                audio.controls = true;
                audio.src = phonetic.audio;
                audio.className = 'audio';
                output.appendChild(audio);
            }
        });

        entry.meanings.forEach(meaning => {
            const partOfSpeech = document.createElement('h3');
            partOfSpeech.textContent = meaning.partOfSpeech;
            output.appendChild(partOfSpeech);

            meaning.definitions.forEach(definition => {
                const definitionText = document.createElement('p');
                definitionText.textContent = `- ${definition.definition}`;
                output.appendChild(definitionText);

                if (definition.synonyms.length > 0) {
                    const synonyms = document.createElement('p');
                    synonyms.textContent = `Synonyms: ${definition.synonyms.join(', ')}`;
                    output.appendChild(synonyms);
                }
            });
        });
    });
}