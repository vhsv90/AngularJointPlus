import * as joint from '@joint/plus';

namespace ThemePicker {

    export interface Options extends joint.ui.Toolbar.Options {
        tools: Array<{ [key: string]: any }>;
    }

    export interface MainView {
        commandManager: joint.dia.CommandManager;
        paper: joint.dia.Paper;
        graph: joint.dia.Graph;
    }
}

export class ThemePicker extends joint.ui.Toolbar {

    constructor(options: { mainView: ThemePicker.MainView }) {

        super({
            ...options,
            className: `${joint.ui.Toolbar.prototype.className} theme-picker`
        });

        this.mainView = options.mainView;
    }

    mainView: ThemePicker.MainView;

    init() {

        const options = [
            { value: 'modern', content: 'Modern' },
            { value: 'dark', content: 'Dark' },
            { value: 'material', content: 'Material' }
        ];

        const themes = {
            type: 'select-button-group',
            name: 'theme-picker',
            multi: false,
            selected: options.findIndex(option => option.value === this.defaultTheme),
            options,
            attrs: {
                '.joint-select-button-group': {
                    'data-tooltip': 'Change Theme',
                    'data-tooltip-position': 'bottom'
                }
            }
        };

        this.options.tools = [themes];
        this.on('theme-picker:option:select', this.onThemeSelected, this);

        super.init();
    }

    onThemeSelected(option: any) {

        joint.setTheme(option.value);
        if (this.mainView) {
            this.adjustAppToTheme(this.mainView, option.value);
        }
    }

    adjustAppToTheme(app: ThemePicker.MainView, theme: string) {

        // Material design has no grid shown.
        if (theme === 'material') {
            app.paper.options.drawGrid = false;
            app.paper.setGrid(null);
        } else {
            app.paper.options.drawGrid = true;
            app.paper.setGrid(true);
        }
    }
}