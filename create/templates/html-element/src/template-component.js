export default class TemplateComponent extends HTMLElement {
    static get attributes() {
        return {
            title: { default: 'Simplr HTML Element Template' },
            subtitle: { default: 'Made with 💖 by the Simplr bois' },
        };
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.setDefaults();
        this.render();
    }

    render() {
        const content = TemplateComponent.template.content.cloneNode(true);
        // TODO: DELETE ME
        content.querySelector('h2').innerText = this.title;
        content.querySelector('p').innerText = this.subtitle;
        //

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(content);

        // TODO: DELETE ME
        const funStuff = [
            'Made with 💖 by the Simplr bois',
            'Cooking up some trouble',
            'All your base are belong to us',
            "Let's create something awesome!",
            'Modern Problems, Simplr Solutions',
        ];
        this.shadowRoot.querySelector('p').addEventListener('animationiteration', () => {
            const newSub = funStuff[Math.floor(Math.random() * funStuff.length)];
            this.setAttribute('subtitle', newSub);
        });
        //
    }

    static get template() {
        const template = document.createElement('template');
        template.innerHTML = `${TemplateComponent.style}${TemplateComponent.html}`;
        return template;
    }

    static get html() {
        return `
            <h2>title</h2>
            <p>subtitle</p>
            <span>Modify me at <code>src/template-component.js</code></span>
            <a href="info"><p>If you installed Simplr Router, this link should take you to the info page</p></a>
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

                :host > p:first-of-type {
                    animation: 4000ms ease-in infinite slide-in;
                }

                a {
                    color: inherit;
                }

                @keyframes slide-in {
                    0% { transform: translateX(100vw); }
                    20% { transform: translateX(0); }
                    80% { transform: translateX(0); }
                    100% { transform: translateX(-100vw); }
                }
            </style>
        `;
    }

    requestRender() {
        if (this._requestRenderCalled) return;

        this._requestRenderCalled = true;
        window.requestAnimationFrame(() => {
            this.render();
            this._requestRenderCalled = false;
        });
    }

    setDefaults() {
        const attributes = TemplateComponent.attributes;
        Object.keys(attributes).forEach(attr => {
            if (!this[attr]) {
                this[attr] = attributes[attr].default;
            }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;

        this[name] = newValue === '' ? true : newValue;
        this.requestRender();
    }

    static get observedAttributes() {
        const attributes = TemplateComponent.attributes;
        return Object.keys(attributes).filter(attr => {
            return typeof attributes[attr].watch === 'undefined' || attributes[attr].watch;
        });
    }
}

if (!customElements.get('template-component')) {
    customElements.define('template-component', TemplateComponent);
}
