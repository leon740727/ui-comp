export class React {
    /** 這個類別是支援 *.tsx 檔案的 */
    static createElement(nodeName: string, attr: {}, ...children) {
        let res = $(`<${nodeName}/>`);
        if (attr) {
            Object.keys(attr).map(name => res.attr(name, attr[name]));
        }
        children.forEach(c => res.append(c));
        return res;
    }
}

export class Comp<I, S, R> {
    elem: JQuery;
    constructor(elem: JQuery) {
        this.elem = elem;
    }

    init(data: I): Comp<I, S, R> {
        return this;
    }

    setup(data: S): Comp<I, S, R> {
        throw "not implement";
    }

    data(): R {
        throw "not implement";
    }

    static _make<I, S, R>(cons: {new(elem: JQuery): Comp<I, S, R>}, tmpl: JQuery, initData: I, setupData: S) {
        return new cons(tmpl.clone(true)).init(initData).setup(setupData);
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

export class Dialog<I, S, R> extends Comp<I, S, R> {
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
    end(result: R) {
        this.elem.trigger("end", [result]);
    }
}
