export class Comp<T> {
    elem: JQuery;
    constructor(elem: JQuery) {
        this.elem = elem;
    }

    init(data: T) {
        this.setup(data);
        return this;
    }

    setup(data: T): Comp<T> {
        throw "not implement";
    }

    data(): T {
        throw "not implement";
    }

    static make<T>(cons: {new(elem: JQuery): Comp<T>}, tmpl: JQuery, data: T) {
        return new cons(tmpl.clone(true)).init(data);
    }
}

function memoize(target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
    let originalMethod = descriptor.get;
    let key = "_memoize_" + propertyKey;
    descriptor.get = function(...args: any[]) {
        if (this[key] == undefined) {
            this[key] = originalMethod.apply(this, args);
        }
        return this[key];
    }
    return descriptor;
}

export class Dialog<T, R> extends Comp<T> {
    @memoize
    get cover() {
        return $("<div/>").css({
            position: 'absolute',
            top: '0px',
            left: '0px',
            'background-color': 'black',
            opacity: '0.3',
            width: '100%',
            height: Math.max($(window).outerHeight(true), $(document).outerHeight(true)) + 'px'});
    }
    popup() {
        this.elem.css({
            position: 'absolute',
            minWidth: '40%',
            minHeight: '200px',
            'background-color': 'white',
        });
        $('body').append(this.cover).append(this.elem);
        this.elem.css({
            top: ($(window).outerHeight() - this.elem.outerHeight()) / 2 + $(window).scrollTop() + 'px',
            left: ($(window).outerWidth() - this.elem.outerWidth()) / 2 + 'px',
        });
        return new Promise<R>((resolve, reject) => {
            this.elem.on('end', (e, data: R) => {
                this.elem.off('end');
                this.elem.detach();
                this.cover.detach();
                resolve(data);
            });
        });
    }
}
