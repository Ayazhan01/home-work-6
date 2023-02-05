function destroyPopup(popup) {
    popup.remove();
}

function ask({ title, cancel = false }) {
    return new Promise(resolve => {

        const popup = document.createElement('form');
        popup.classList.add('popup');
        popup.classList.add('open');

        popup.insertAdjacentHTML(
            'afterbegin',
            `<fieldset>
            <label>${title}</label>
            <label for="inputTag">
            Choose file
            <input id="inputTag" type="file"/>
            </label>
            <button type="submit" class="redirectionButton">Submit</button>
            </fieldset>`
        );

        if (cancel) {
            const cancelButton = document.createElement('button');
            cancelButton.type = 'button';
            cancelButton.textContent = 'Cancel';
            popup.appendChild(cancelButton);

            cancelButton.addEventListener('click', () => {
                resolve(null);
                destroyPopup(popup);
            })
        }

        popup.addEventListener('submit', e => {
            e.preventDefault();
            resolve("file uploaded");

            destroyPopup(popup);
        }, { once: true });

        document.body.appendChild(popup);
    })
}

const questions = [{
        title: 'First file:',
    },
    {
        title: 'Secound file:',
        cancel: true
    },
    {
        title: 'Third file:',
    }
];

//Promise.all(question.map(question => ask(question))).then();

//question.forEach(async(question) => {
//   await ask(question);
//})

async function askMany() {
    for (const question of questions) {
        const answer = await ask(question);
        console.log(answer)
    }
}

askMany();