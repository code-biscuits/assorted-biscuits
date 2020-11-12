import { o, html } from 'sinuous';
import { map } from 'sinuous/map';

const languageSnippets = {
  // bash: '',
  c: 'if(channel->reqX11_state == libssh2_NB_state_sent) {',
  csharp: 'return new CompositeDisposable(',
  elm: '[ WebGL.entity vertexShader fragmentShader faceMesh',
  go: 'if controllerRefChanged && oldControllerRef != nil',
  java: 'public static void main (String[] args) throws java.io.IOException',
  json: '"json-biscuits.annotationMaxLength": {',
  kotlin: 'internal class HttpTransactionDatabaseRepository(private val database: ChuckerDatabase) ',
  lua: 'function source.simplify(src)',
  php: 'if (empty($options["type"])) {',
  python: 'def check_pydep(importname, module):',
  rust: 'fn on_drain<I, S, E>(conn: Pin<&mut UpgradeableConnection<I, S, E>>)',
  toml: 'features = [',
  yaml: '- task: DotNetCoreCLI@2'
};

const vscode = acquireVsCodeApi();

const props = [
  {
    name: 'annotationPrefix',
    type: 'text',
    label: 'Prefix',
  },
  {
    name:'annotationColor' ,
    type: 'color',
    label: 'Color',
  },
  {
    name:'annotationMinDistance',
    type: 'number',
    label: 'Distance',
  },
  {
    name:'annotationMaxLength',
    type: 'number',
    label: 'Length',
  },
];

const languages = o([]);
const languageSettings = o({});
const defaultSettings = o({});

const showingLanguage = {};

window.addEventListener("message", (config) => {
  config.data.languages.forEach(language => {
    if(!showingLanguage[language]) {
      showingLanguage[language] = o(false);
    } else {

    }
  });
  languages(config.data.languages);
  languageSettings(config.data.languageSettings);
  defaultSettings(config.data.defaultSettings);
});

const Styles = (props) => html`
  <style>
    label {
      display: block;
      margin-bottom: 8px;
    }

    .language {
      border-bottom: thin solid var(--vscode-textSeparator-foreground);
    }

    .language:first-item {
      border-top: thin solid var(--vscode-textSeparator-foreground);
    }

    .language:hover {
      background: rgba(255, 255, 255, 0.025);
    }

    .language-header {
      cursor: pointer;
      margin: 0;
      padding: 8px;
    }

    .language-name {
      display: inline-block;
      min-width: 84px;
    }

    .language-fields {
      display: flex;
      flex-direction: row;
      padding-left: 32px;
      padding-top: 8px;
      padding-bottom: 16px;
    }

    .cell {
      padding-right: 16px;
    }

    input {
      background-color: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border-color: var(--vscode-input-background);
      border-radius: 5px;
      border-width: 1px;
      border-style: solid;
      height: 23px;
    }

    input:active {
      color: var(--vscode-inputOption-activeForeground);
      background-color: var(--vscode-inputOption-activeBackground);
      border-color: var(--vscode-inputOption-activeBorder);
    }

    hr {
      transition: all 300ms;
      width: 0;
      opacity: 0;
      margin-top: 0;
    }

    hr.showing {
      width: 100%;
      opacity: 1;
      margin-top: 16px;
    }

    .accordion-caret {
      margin: 0 8px;
      transition: all 300ms;
    }

    .language.showing .accordion-caret {
      transform: rotate(90);
    }

    .example-label {
      margin-left: 16px;
      margin-right: 8px;
    }

    .example-snippet {
      background: rgba(0,0,0, 0.3);
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 0.8rem;
      font-weight: 400;
    }

  </style>
`;

const Config = () => html`
  <${Styles} />
  <div>
    ${map(languages, (language => html`
      <div class="language ${() => {
        return showingLanguage[language]() ? 'showing' : ''
      }}">
        <h3
          class="language-header"
          onclick=${() => {
            showingLanguage[language](!showingLanguage[language]());
          }}
        >
          <span class="accordion-caret">▶</span>
          <span class="language-name">${language}</span>
          <span class="snippet-label">preview:</span>
          <span
            class="example-snippet"
            style="${() => {
              return {
                color:  getLanguageSettingsValue(
                  defaultSettings,
                  languageSettings,
                  language,
                  'annotationColor'
                )
              }
            }}"
          >${
              () => getLanguageSettingsValue(
                defaultSettings,
                languageSettings,
                language,
                'annotationPrefix'
              )
            }
            ${() => truncateSnippet(
              defaultSettings,
              languageSettings,
              language,
              getLanguageSnippet(language)
            )}
          </span>
        </h3>
        <div
          class="language-fields"
          style=${() => { return { 'display': !showingLanguage[language]() ? 'none' : 'flex' }}}
        >
          ${props.map(prop => html`
            <span class="cell">
              <label htmlFor="${language}-${prop.name}">${prop.label}</label>
              <input
                id="${language}-${prop.name}"
                type="${prop.type}"
                onchange=${(event) => {
                  console.log("change", prop.name, event.target.value);
                  vscode.postMessage({
                    [language]: {
                      [prop.name]: event.target.value
                    }
                  })
                }}
                value="${() => (languageSettings()[language] && languageSettings()[language][prop.name]) || defaultSettings()[prop.name]}"
              />
            </span>
          `)}
          </div>
      </div>
    `))}
  </div>
`;

function getLanguageSnippet(language) {
  return languageSnippets[language];
}

function truncateSnippet(defaultSettings, languageSettings, language, snippet) {
  const maxLength = getLanguageSettingsValue(defaultSettings, languageSettings, language, 'annotationMaxLength');

  if (maxLength && snippet.length > maxLength) {
    return snippet.substr(0, maxLength) + "...";
  } else {
    return snippet;
  }
}

function getLanguageSettingsValue(defaultSettings, languageSettings, language, propName) {
  return (
    languageSettings()[language] &&
    languageSettings()[language][propName]
  ) || defaultSettings()[propName];
}

document.querySelector('#root').append(
  html`<${Config} />`
);
