class GandiPull {
    constructor() {
        this.lastData = '';
        this.lastError = '';
    }

    getInfo() {
        return {
            id: 'gandipull',
            name: 'Gandi Pull',
            color1: '#24292f',
            color2: '#57606a',
            color3: '#0d1117',
            blocks: [
                {
                    opcode: 'getFile',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'pull [PATH] from [REPO] branch [BRANCH]',
                    arguments: {
                        PATH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'README.md'
                        },
                        REPO: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'CubeHub-studio/Gandi-Pull'
                        },
                        BRANCH: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'main'
                        }
                    }
                },
                {
                    opcode: 'getFromURL',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'pull GitHub file URL [URL]',
                    arguments: {
                        URL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'https://github.com/CubeHub-studio/Gandi-Pull/blob/main/README.md'
                        }
                    }
                },
                {
                    opcode: 'getLastData',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'last pulled data'
                },
                {
                    opcode: 'getLastError',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'last pull error'
                },
                {
                    opcode: 'clearData',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'clear pulled data'
                }
            ]
        };
    }

    async getFile(args) {
        this.lastError = '';

        const repo = String(args.REPO || '').trim()
            .replace(/^https?:\/\/github\.com\//i, '')
            .replace(/\.git\/?$/i, '')
            .replace(/\/$/, '');

        const path = String(args.PATH || '').trim()
            .replace(/^\/+/, '')
            .split('/')
            .map(encodeURIComponent)
            .join('/');

        const branch = String(args.BRANCH || 'main').trim() || 'main';

        if (!/^[^/]+\/[^/]+$/.test(repo)) {
            return this.fail('Invalid repository. Use owner/repository.');
        }

        return this.pull(
            'https://raw.githubusercontent.com/' +
            repo + '/' +
            encodeURIComponent(branch) + '/' +
            path
        );
    }

    async getFromURL(args) {
        this.lastError = '';
        const input = String(args.URL || '').trim();

        if (!input) {
            return this.fail('No GitHub URL was provided.');
        }

        let url;
        try {
            url = this.convertGitHubURL(input);
        } catch (e) {
            return this.fail(e.message || 'Invalid GitHub URL.');
        }

        return this.pull(url);
    }

    convertGitHubURL(input) {
        if (/^https:\/\/raw\.githubusercontent\.com\//i.test(input)) {
            return input;
        }

        const match = input.match(
            /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/i
        );

        if (!match) {
            throw new Error(
                'Use a GitHub file URL such as https://github.com/owner/repo/blob/main/file.txt'
            );
        }

        const owner = match[1];
        const repo = match[2].replace(/\.git$/i, '');
        const branch = match[3];
        const path = match[4]
            .split('/')
            .map(encodeURIComponent)
            .join('/');

        return (
            'https://raw.githubusercontent.com/' +
            owner + '/' +
            repo + '/' +
            encodeURIComponent(branch) + '/' +
            path
        );
    }

    async pull(url) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error(
                    'GitHub returned HTTP ' +
                    response.status +
                    ' (' +
                    response.statusText +
                    ').'
                );
            }

            const text = await response.text();
            this.lastData = text;
            return text;
        } catch (e) {
            return this.fail(e && e.message ? e.message : 'Could not pull the GitHub file.');
        }
    }

    fail(message) {
        this.lastError = String(message);
        return '';
    }

    getLastData() {
        return this.lastData;
    }

    getLastError() {
        return this.lastError;
    }

    clearData() {
        this.lastData = '';
        this.lastError = '';
    }
}

Scratch.extensions.register(new GandiPull());
