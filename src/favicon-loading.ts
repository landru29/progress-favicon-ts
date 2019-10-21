type FaviconLoadingType = 'donut' | 'pie';

export interface FaviconLoadingOptions {
    type: FaviconLoadingType;
    message?: string;
}

class Point {
    constructor(
        public x: number = 0,
        public y: number = 0,
    ) {}
}

export class FaviconLoading {

    public canvas: HTMLCanvasElement;
    public context: CanvasRenderingContext2D;
    public type: FaviconLoadingType = 'pie';
    private maxValue: number = 100;
    private oldLink: HTMLLinkElement[] = [];
    private oldTitle: string = '';
    private link: HTMLLinkElement;
    private head: HTMLHeadElement;
    private progressValue: number = 0;
    private height = 32;
    private width = 32;
    private messageTemplate: string = 'Loading {{percent}}';
    private colorPalette: string[] = [
        '#c20000',
        '#c21000',
        '#c22000',
        '#c23000',
        '#c24100',
        '#c25100',
        '#c26100',
        '#c27100',
        '#c28100',
        '#c29100',
        '#c2a200',
        '#c2b200',
        '#c2c200',
        '#b2c200',
        '#a1c200',
        '#91c200',
        '#81c200',
        '#71c200',
        '#61c200',
        '#51c200',
    ];

    constructor(private options: FaviconLoadingOptions) {
        this.canvas = window.document.createElement('canvas');
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.head = window.document.head;

        const links = this.head.getElementsByTagName('link');
        for (let i = 0; i < links.length; i++) {
            if (/icon/.test(links[i].getAttribute('rel') || '')) {
                this.oldLink.push(links[i]);
            }
        }
        this.link = window.document.createElement('link');
        this.link.rel = 'icon';
        this.type = this.options.type || this.type;
        this.oldTitle = document.title;
        if (options.message !== undefined) {
            this.messageTemplate = options.message;
        }
        this.switchLoader(true);
    }

    public static Init(options: FaviconLoadingOptions): void {
        (window as any).faviconLoadingInstance = new FaviconLoading(options);
    }

    public switchLoader(state: boolean): void {
        if (state) {
            this.oldLink.forEach((elt: HTMLLinkElement) => elt.remove());
            this.head.appendChild(this.link);
        } else {
            this.oldLink.forEach((elt: HTMLLinkElement) => this.head.appendChild(elt));
            this.link.remove();
        }
    }

    public get message(): string {
        return this.messageTemplate;
    }

    public set message(str: string) {
        this.messageTemplate = str;
        this.redraw();
    }

    public set progress(value: number) {
        this.progressValue = value;
        this.redraw();
    }

    public get progress(): number {
        return this.progressValue;
    }

    public get max(): number {
        return this.maxValue;
    }

    public set max(value: number) {
        this.maxValue = value;
        this.redraw();
    }

    public get palette(): string[] {
        return this.colorPalette;
    }

    public set palette(data: string[]) {
        this.colorPalette = data;
        this.redraw();
    }

    private clearIcon(): void {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    public get center(): Point {
        return new Point(this.canvas.width / 2, this.canvas.height / 2);
    }

    public redraw(): void {
        switch (this.type) {
                case 'pie': {
                    this.setPieProgress(Math.min(this.progressValue, this.maxValue));
                    break;
                }
                case 'donut': {
                    this.setDonutProgress(Math.min(this.progressValue, this.maxValue));
                    break;
                }
        }
        this.repaint();
    }

    /********************* PRIVATE *********************/

    private getHref(): string {
        return this.canvas.toDataURL('image/png');
    }

    private repaint(): void {
        this.link.href = this.getHref();

        const dict: {[key: string]: string} = {
            percent: `${Math.round(100 * Math.min(this.progressValue, this.maxValue) / this.maxValue)}%`,
            max: `${this.maxValue}`,
            progress: `${this.progressValue}`,
        };

        if (this.messageTemplate === '') {
            if (document.title !== this.oldTitle) {
                document.title = this.oldTitle;
            }
        } else {
            document.title = this.messageTemplate.replace(/\{\{(.*?)\}\}/g, (matcher: string, key: string) => dict[key] || '');
        }
    }

    private addCircle(radius: number, linewidth = 1): void {
        this.context.strokeStyle = 'rgba(75, 75, 75, .2)';
        this.context.lineWidth = linewidth;
        this.context.beginPath();
        this.context.arc(this.center.x, this.center.y, radius, 0, Math.PI * 2);
        this.context.stroke();
    }

    private getColor(progress: number): string {
        if (Array.isArray(this.colorPalette)) {
            if (this.colorPalette.length === 1) {
                return this.colorPalette[0];
            }
            const index = Math.round(this.colorPalette.length * progress / this.maxValue);
            return this.colorPalette[index];
        }
        return this.colorPalette;
    }

    private setPieProgress(progress: number): void {
        const radius = Math.min(this.canvas.width, this.canvas.height) / 2;
        this.clearIcon();
        this.context.fillStyle = this.getColor(progress);
        this.context.beginPath();
        this.context.arc(this.center.x, this.center.y, radius, 0, Math.PI * 2 * progress / this.maxValue);
        this.context.lineTo(this.center.x, this.center.y);
        this.context.fill();
        this.repaint();
    }

    private setDonutProgress(progress: number): void {
        const radius = Math.min(this.canvas.width, this.canvas.height) / 3;
        const linewidth = Math.min(this.canvas.width, this.canvas.height) / 4;
        this.clearIcon();
        this.addCircle(radius, linewidth);
        this.context.lineWidth = linewidth;
        this.context.strokeStyle = this.getColor(progress);
        this.context.beginPath();
        this.context.arc(this.center.x,this.center.y,radius,0,Math.PI * 2 * progress / this.maxValue, false); // outer (filled)
        this.context.stroke();
        this.repaint();
    }
}

(window as any).FaviconLoading = FaviconLoading;
