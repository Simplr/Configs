export default class InfoView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const content = InfoView.template.content.cloneNode(true);
        this.shadowRoot.appendChild(content);
    }

    static get template() {
        const template = document.createElement('template');
        template.innerHTML = `${InfoView.style}${InfoView.html}`;
        return template;
    }

    static get html() {
        return `
            <h2>Your installation of Simplr Router is working!</h2>
            <p>This will allow you to create seamless SPA experiences in minutes.</p>
            <p>Modify the router at <code>src/router.js</code> and <code>src/routes.js</code></p>
            <p>You can delete this <code>info-view.js</code> -file</p>
        `;
    }

    static get style() {
        return `
            <style>
                :host {
                    display: flex;
                    flex-direction: column;
                    font-size: 1.6rem;
                    width: 100%;
                    height: 100vh;
                    background: #108ad4;
                    align-items: center;
                    justify-content: center;
                    color: #FFF;
                    overflow: hidden;
                }
            </style>
        `;
    }
}

if (!customElements.get('info-view')) {
    customElements.define('info-view', InfoView);
}
