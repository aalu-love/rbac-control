const SCOPE = {
    r: ["read"],
    w: ["write"],
    x: ["delete"],
    rw: ["read", "write"],
    rx: ["read", "delete"],
    wx: ["write", "delete"],
    rwx: ["read", "write", "delete"],
};

module.exports = {
    SCOPE,
};
