document.addEventListener("DOMContentLoaded", () => {
    // Deteck theme preference
    if(localStorage.getItem('theme')) document.body.dataset.theme = localStorage.getItem('theme')
    else{
        console.log(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)'))
        let themePreference = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark": "light";
        localStorage.setItem('theme', themePreference);
        document.body.dataset.theme = themePreference;
    }
    if(document.documentElement.clientWidth <= 480){
        document.querySelector(".topnav-name").innerText = "<Justin M.K. />"
    }else{
        document.querySelector(".topnav-name").innerText = "<Justin Maximillian Kimlim />"
    }
    window.addEventListener("resize", () => {
        if(document.documentElement.clientWidth <= 480){
            document.querySelector(".topnav-name").innerText = "<Justin M.K. />"
        }else{
            document.querySelector(".topnav-name").innerText = "<Justin Maximillian Kimlim />"
        }
    })
    // Navbar
    document.querySelector(".topnav-ham").addEventListener("click", () => {
        document.querySelector(".topnav-menu").style.width = '100vw';
        document.querySelector(".topnav-exit-menu").addEventListener("click", () => {
            document.querySelector(".topnav-menu").style.width = '0vw';
        })
        document.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                document.querySelector(".topnav-menu").style.width = '0vw';
            })
        })
    })
    AOS.init()
    fetch('https://api.github.com/repos/kimlimjustin/kimlimjustin.github.io')
    .then(response => response.json())
    .then(result => {
        document.querySelector("#github-stars").innerText = result["stargazers_count"]
        document.querySelector("#github-forks").innerText = result["forks"]
    })
    .catch(() => document.querySelector(".github-stats").removeChild(document.querySelector(".github-stats")))

    document.querySelector(".switch-theme-btn").addEventListener("click", () => {
        let newTheme = document.body.dataset.theme === "dark" ? "light": "dark";
        document.body.dataset.theme = newTheme
        localStorage.setItem('theme', newTheme)
    })

    // Articles
    fetch('https://dev.to/api/articles?username=kimlimjustin')
    .then(response => response.json())
    .then(result => {
        let recentArticles = result.slice(0,4);
        recentArticles.forEach(article => {
            let articleElement = document.createElement('div');
            articleElement.classList.add("article");
            articleElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="article-code-svg" viewBox="0 0 54 14"><g fill="none" fill-rule="evenodd" transform="translate(1 1)"><circle cx="6" cy="6" r="6" fill="#FF5F56" stroke="#E0443E" stroke-width=".5"></circle><circle cx="26" cy="6" r="6" fill="#FFBD2E" stroke="#DEA123" stroke-width=".5"></circle><circle cx="46" cy="6" r="6" fill="#27C93F" stroke="#1AAB29" stroke-width=".5"></circle></g></svg>
            <img src="${article.social_image}" class="article-cover" alt="cover image for${article.title} on dev.to">
            <h2 class="article-title">${article.title}</h2>
            <div class="article-stats">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img">
                    <path d="M2.821 12.794a6.5 6.5 0 017.413-10.24h-.002L5.99 6.798l1.414 1.414 4.242-4.242a6.5 6.5 0 019.193 9.192L12 22l-9.192-9.192.013-.014z"></path>
                </svg>
                <span>${article.public_reactions_count}</span>
                <a href="${article.url}" class="article-link-btn" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" role="img" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </a>
            </div>`;
            articleElement.addEventListener("click", () => {
                let blog = window.open(article.url, "_blank");
                blog.focus()
            })
            document.querySelector("#articles").appendChild(articleElement)
        })
        let readMoreElement = document.createElement('a')
        readMoreElement.classList.add('article-read-more');
        readMoreElement.innerText = `Read more on dev.to`
        readMoreElement.href = 'https://dev.to/kimlimjustin';
        readMoreElement.setAttribute('target', "_blank");
        readMoreElement.setAttribute('rel', 'noopener');
        document.querySelector("#articles").appendChild(readMoreElement)
    })
    .catch(() => document.querySelector("#articles").parentNode.removeChild(document.querySelector("#articles")))

    // Terminal Version
    document.querySelector(".terminal-version-btn").addEventListener("click", () => {
        const modal = document.querySelector(".modal");
        const terminalElement = document.querySelector(".terminal");
        modal.style.display = "block";

        const inputTerminal = document.querySelector(".terminal-input-command")
        inputTerminal.focus();

        const REMOVE_LOG = () => {
            const outputLog = terminalElement.querySelectorAll(".terminal-row");
            outputLog.forEach(log => {
                if(!log.contains(inputTerminal)){
                    terminalElement.removeChild(log)
                }
            })
        }
        const EXIT = () => {
            REMOVE_LOG();
            inputTerminal.removeEventListener("change", inputTerminalHandler)
            modal.style.display = "none";
        }
        modal.querySelector(".modal-close-btn").addEventListener("click", () => {
            EXIT()
        })

        const RETURN_VALUE = (inputValue, outputValue) => {
            let outputElement = document.createElement("p");
            outputElement.classList.add('terminal-row');
            outputElement.classList.add('terminal-log');
            outputElement.innerHTML = outputValue;
            let lastInputElement = document.createElement('p');
            lastInputElement.classList.add('terminal-row');
            lastInputElement.innerHTML = `<span class="terminal-user">ask@justin:~$</span><span class="terminal-log">${inputValue}</span>`
            terminalElement.insertBefore(outputElement, inputTerminal.parentNode)
            terminalElement.insertBefore(lastInputElement, outputElement)
        }

        const inputTerminalHandler = e => {
            let input = e.target.value;
            let output = `'${input.split(" ")[0]}' is not recognized as a command.`;
            if(input === "help"){
                output = `<ul>
                <li>about ...... About me</li>
                <li>clear ...... Clear terminal log</li>
                <li>exit ....... Exit terminal session</li>
                <li>help ....... Showing available commands</li>
                <li>links ...... Social media links</li>
                </ul>`
            }else if(input === "about"){
                output = "Hello, I'm Justin Maximillian Kimlim from Indonesia, a 15 y.o. junior high school student with hobbies of computer science, programming and science fiction. I enjoy making projects or even website clone."
            }else if(input === "links"){
                output = `<ul>
                <li><a href="https://instagram.com/justin_kimlim_" target="_blank" rel="noopener">Instagram</a></li>
                <li><a href="https://github.com/kimlimjustin" target="_blank" rel="noopener">GitHub</a></li>
                <li><a href="https://dev.to/kimlimjustin" target="_blank" rel="noopener">Dev.to</a></li>
                <li><a href="https://reddit.com/kimlimjustin" target="_blank" rel="noopener">Reddit</a></li>
                <li><a href="mailto:kimlimjustin@gmail.com" target="_blank" rel="noopener">Email</a></li>
                </ul>`
            }
            RETURN_VALUE(input, output)

            if(input === "clear" || input === "cls") REMOVE_LOG()
            if(input === "exit") EXIT()
            inputTerminal.value = "";
            terminalElement.scrollTop = terminalElement.scrollHeight;
        }

        inputTerminal.addEventListener("change", inputTerminalHandler)
        terminalElement.addEventListener("click", () => inputTerminal.focus())
        document.body.addEventListener("click", e => {
            if(e.target === modal) EXIT()
        })
    })
})