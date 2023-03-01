export const enum ShapeFlags {
    ELEMENT = 1, // 1
    STATEFUL_COMPONENT = 1 << 1, // 10
    TEXT_CHILDREN = 1 << 2, // 100
    ARRAY_CHILDREN = 1 << 3, // 1000
    SLOT_CHILDREN = 1 << 4
}

// | 逢1变1 用于赋值
// & 同1变1 用于判断