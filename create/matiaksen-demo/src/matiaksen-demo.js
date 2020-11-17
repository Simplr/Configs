import { LitElement, html, css } from 'lit-element';

export default class MatiaksenDemo extends LitElement {
    static get properties() {
        return {
            title: { type: String, reflect: true },
            subtitle: { type: String, reflect: true },
        };
    }

    constructor() {
        super();
        this.title = 'Simplr Lit Element Template';
        this.subtitle = 'Made with 💖 by the Simplr bois';
    }

    firstUpdated() {
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

    render() {
        return html`
            <style>
                ${this.renderStyles()}
            </style>
            <h2>${this.title}</h2>
            <p>${this.subtitle}</p>
            <span>Modify me at <code>src/matiaksen-demo.js</code></span>
            <a href="info"><p>If you installed Simplr Router, this link should take you to the info page</p></a>
        `;
    }

    renderStyles() {
        return css`
            :host {
                display: flex;
                flex-direction: column;
                font-size: 1.6rem;
                width: 100%;
                height: 100vh;
                background: #108ad4;
                align-items: center;
                justify-content: center;
                color: #fff;
                overflow: hidden;
            }

            :host > p:first-of-type {
                animation: 4000ms ease-in infinite slide-in;
            }

            a {
                color: inherit;
            }

            @keyframes slide-in {
                0% {
                    transform: translateX(100vw);
                }
                20% {
                    transform: translateX(0);
                }
                80% {
                    transform: translateX(0);
                }
                100% {
                    transform: translateX(-100vw);
                }
            }
        `;
    }
}

if (!customElements.get('matiaksen-demo')) {
    customElements.define('matiaksen-demo', MatiaksenDemo);
}
