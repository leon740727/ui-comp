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
