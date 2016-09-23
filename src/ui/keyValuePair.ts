export default class KeyValuePair<T1, T2> {
    private m_key: T1;
    private m_value: T2;

    public get Key(): T1 { return this.m_key }
    public set Key(val: T1) { this.m_key = val; }

    public get Value(): T2 { return this.m_value }
    public set Value(val: T2) { this.Value = val; }

    constructor(key: T1, value: T2) {
        this.m_key = key;
        this.m_value = value;
    }
}