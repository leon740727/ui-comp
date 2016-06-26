class Comp<T> {
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

class EditButton extends Comp<{}> {
    static inst = new EditButton($('#b-edit')).init(null);

    init(_: {}) {
        //...
        return this;
    }
}

type User = {id: string, name: string};
class UserItem extends Comp<User> {
    static tmpl = $('#user-list .item').detach();
    static list = () => $('#user-list .item').get().map(i => new UserItem($(i)));

    init(data: User) {
        // 設定事件處理等初始化工作...
        return this;
    }

    setup(data: User) {
        // 設定畫面...
        return this;
    }
}

let data: User;
UserItem.make(UserItem, UserItem.tmpl, data);
