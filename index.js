(function() {
    function init() {
        if (!init.dom ||  0 < init.wait) {
            return;
        }
        tick.rst();
        q.rst();
        FB.show();
        io.rst(true);
        scn.run = gameScn;
        scn.run.rst();
        scn();
    }
    init.dom = false;
    init.wait = 0;

    var lang = {
        noMoves: 'No More moves!',
        lose: 'You lost!',
        win: 'You won!',
    };

    var sprite = {
        anim: 0.01, // animation frame rate
        box: function(cx, x, y, w, h, sheet, tile) {
            var x1 = x + tile.nw.w;
            var x2 = x + w - tile.ne.w;
            var dy = y;
            var cw = w - tile.nw.w - tile.ne.w;
            var ch = h - tile.nw.h - tile.sw.h;
            cx.drawImage(sheet.img, tile.nw.x, tile.nw.y, tile.nw.w, tile.nw.h, x, dy, tile.nw.w, tile.nw.h);
            cx.drawImage(sheet.img, tile.nc.x, tile.nc.y, tile.nc.w, tile.nc.h, x1, dy, cw, tile.nc.h);
            cx.drawImage(sheet.img, tile.ne.x, tile.ne.y, tile.ne.w, tile.ne.h, x2, dy, tile.ne.w, tile.ne.h);
            dy += tile.nw.h;
            cx.drawImage(sheet.img, tile.cw.x, tile.cw.y, tile.cw.w, tile.cw.h, x, dy, tile.cw.w, ch);
            cx.drawImage(sheet.img, tile.cc.x, tile.cc.y, tile.cc.w, tile.cc.h, x1, dy, cw, ch);
            cx.drawImage(sheet.img, tile.ce.x, tile.ce.y, tile.ce.w, tile.ce.h, x2, dy, tile.ce.w, ch);
            dy += ch;
            cx.drawImage(sheet.img, tile.sw.x, tile.sw.y, tile.sw.w, tile.sw.h, x, dy, tile.sw.w, tile.sw.h);
            cx.drawImage(sheet.img, tile.sc.x, tile.sc.y, tile.sc.w, tile.sc.h, x1, dy, cw, tile.sc.h);
            cx.drawImage(sheet.img, tile.se.x, tile.se.y, tile.se.w, tile.se.h, x2, dy, tile.se.w, tile.se.h);
        },
        txtL: function(cx, x, y, sheet, txt) {
            var x0 = x;
            for (var i = 0; i < txt.length; i++) {
                var id = txt[i];
                if (' ' === id) {
                    x += sheet.txt.sp;
                    continue;
                }
                if ('\n' === id) {
                    x = x0;
                    y += sheet.txt.lh;
                    continue;
                }
                var tile = sheet.tile[id];
                if (undefined === tile) {
                    var err = 'unsupported char:' + id + ' txt:' + txt;
                    console.log(err);
                    throw new Exception(err);
                }
                if (0 < tile.w && 0 < tile.h) {
                    cx.drawImage(
                        sheet.img,
                        tile.x, tile.y, tile.w, tile.h,
                        x, y, tile.w, tile.h
                    );
                }
                x += tile.w;
            }
        },
        txtC: function(cx, x, y, sheet, txt) {
            var i, start, end = -1, id, dx, tile;
            while (end < txt.length) {
                start = end + 1;
                end = txt.length;
                dx = 0;
                for (i = start; i < txt.length; i++) {
                    id = txt[i];
                    if ('\n' === id) {
                        end = i;
                        break;
                    }
                    if (' ' === id) {
                        dx += sheet.txt.sp;
                    } else {
                        tile = sheet.tile[id];
                        if (undefined === tile) {
                            var err = 'unsupported char:' + id + ' txt:' + txt;
                            console.log(err);
                            throw new Exception(err);
                        }
                        dx += tile.w;
                    }
                }
                dx = x - (dx >> 1);
                for (i = start; i < end; i++) {
                    id = txt[i];
                    if (' ' === id) {
                        dx += sheet.txt.sp;
                        continue;
                    }
                    tile = sheet.tile[id];
                    cx.drawImage(
                        sheet.img,
                        tile.x, tile.y, tile.w, tile.h,
                        dx, y, tile.w, tile.h
                    );
                    dx += tile.w;
                }
                y += sheet.txt.lh;
            }
        },
        _init: function(sheet, src) {
            init.wait++;
            sheet.img = window.document.createElement('img');
            sheet.img.addEventListener('load', function() {
                var cv = window.document.createElement('canvas');
                cv.width = sheet.img.width;
                cv.height = sheet.img.height;
                var cx = cv.getContext('2d');
                cx.drawImage(sheet.img, 0, 0, cv.width, cv.height);
                sheet.img = cv;
                if (undefined !== sheet.init) {
                    sheet.init();
                }
                init.wait--;
                init();
            });
            sheet.img.src = src;
        },
        sheet: {
            main: {
                anim: {
                    sm: [
                        {x:   0, y:  96, w:  32, h:  32},
                        {x:  32, y:  96, w:  32, h:  32},
                        {x:  64, y:  96, w:  32, h:  32},
                        {x:  96, y:  96, w:  32, h:  32},
                    ]
                },
                tile: {
                    bg0: {x:   0, y:   0, w: 512, h:  96},
                    bg1: {x: 256, y:  96, w: 256, h: 144},
                    bl0: {x:   0, y: 322, w:  52, h:  52, bg: '#f0f'},
                    bl1: {x:  62, y: 322, w:  52, h:  52, bg: '#f00'},
                    bl2: {x: 124, y: 322, w:  52, h:  52, bg: '#ff0'},
                    bl3: {x: 186, y: 322, w:  52, h:  52, bg: '#0f0'},
                    bl4: {x: 248, y: 322, w:  52, h:  52, bg: '#0ff'},
                    bl5: {x: 310, y: 322, w:  52, h:  52, bg: '#00f'},
                    bl6: {x: 372, y: 322, w:  52, h:  52, bg: '#fff'},
                    brY: {x: 256, y: 240, w: 114, h:   6},
                    brR: {x: 256, y: 246, w: 114, h:   6},
                    pl0: {x:   0, y: 136, w:  48, h:  88},
                    pl1: {x:  62, y: 136, w:  48, h:  88},
                    st:  {x: 496, y: 260, w:  14, h:  93},
                    un0: {x:   0, y: 260, w:  62, h:  62},
                    un1: {x:  62, y: 260, w:  62, h:  62},
                    un2: {x: 124, y: 260, w:  62, h:  62},
                    un3: {x: 186, y: 260, w:  62, h:  62},
                    un4: {x: 248, y: 260, w:  62, h:  62},
                    un5: {x: 310, y: 260, w:  62, h:  62},
                    un6: {x: 372, y: 260, w:  62, h:  62},
                    dl:  {
                        nw: {x: 434, y: 260, w:  30, h:  30},
                        nc: {x: 464, y: 260, w:   1, h:  30},
                        ne: {x: 465, y: 260, w:  30, h:  30},
                        cw: {x: 434, y: 290, w:  30, h:  1},
                        cc: {x: 464, y: 290, w:   1, h:  1},
                        ce: {x: 465, y: 290, w:  30, h:  1},
                        sw: {x: 434, y: 291, w:  30, h:  30},
                        sc: {x: 464, y: 291, w:   1, h:  30},
                        se: {x: 465, y: 291, w:  30, h:  30},
                    },
                    wn:  {
                        nw: {x: 145, y:  96, w:  55, h:  80},
                        nc: {x: 199, y:  96, w:   1, h:  80},
                        ne: {x: 200, y:  96, w:  55, h:  80},
                        cw: {x: 145, y: 176, w:  55, h:   1},
                        cc: {x: 199, y: 176, w:   1, h:   1},
                        ce: {x: 200, y: 176, w:  55, h:   1},
                        sw: {x: 145, y: 177, w:  55, h:  80},
                        sc: {x: 199, y: 177, w:   1, h:  80},
                        se: {x: 200, y: 177, w:  55, h:  80}
                    }
                }
            },
            txt: {
                init: function() {
                    var tiles = sprite.sheet.txt.tile;
                    var chrs = [
                        'ABCDEFGHIJKLMNOP',
                        'QRSTUVWXYZ 01234',
                        'abcdefghijklmnop',
                        'qrstuvwxyz 56789',
                        '()!?"\'#$%&@:;.,/',
                        '[]+-  * {} =^ ~_'
                    ];
                    for (var y = 0; y < chrs.length; y++) {
                        for (var x = 0; x < chrs[y].length; x++) {
                            tiles[chrs[y][x]] = {x: 32 * x, y: 32 * y, w: 32, h: 32};
                        }
                    }
                },
                txt: {
                    sp: 32,
                    lh: 32
                },
                tile: {
                    fd: {x: 0, y: 192, w: 256, h: 256}
                }
            }
        }
    };
    sprite._init(sprite.sheet.main, 'data:image/png;base64,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');
    sprite._init(sprite.sheet.txt, 'data:image/png;base64,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');

    var db = {
        val: null !== window.location.search.match(/(^\?|&)debug=m3(&|$)/),
        log: function(msg) {
            if (db.val) {
                console.log(msg);
            }
        },
        cv: function(w, h) {
            var wn = db.wn();
            if (!wn) {
                return undefined;
            }
            var cv = wn.document.createElement('canvas');
            cv.style.border = '1px solid black';
            cv.style.display = 'block';
            cv.width = w;
            cv.height = h;
            wn.document.body.appendChild(cv);
            return cv;
        },
        wn: function() {
            if (!db.val) {
                return undefined;
            }
            if (db._wn) {
                return db._wn;
            }
            db._wn = window.open('', 'debug');
            if (db._wn) {
                db._wn.document.write('<html><head><title>Debug</title></head><body></body></html>');
                db._wn.document.close();
            }
            return db._wn;
        },
        con: function(fb) {
            if (!db.val) {
                return;
            }
            if (io.kb[1] === io.st.kb) {
                scn.fb1.cv.style.display = 'none' === scn.fb1.cv.style.display ? 'block' : 'none';
            } else if (io.kb[2] === io.st.kb) {
                scn.fb2.cv.style.display = 'none' === scn.fb2.cv.style.display ? 'block' : 'none';
            } else if (io.kb[3] === io.st.kb) {
                scn.fb3.cv.style.display = 'none' === scn.fb3.cv.style.display ? 'block' : 'none';
            } else if (io.kb[9] === io.st.kb) {
                db._con = (db._con + 2) % 3;
            } else if (io.kb[0] === io.st.kb) {
                db._con = (db._con + 1) % 3;
            }
            if (1 === db._con) {
                sprite.box(fb.cx, 0, 0, 224, 96, sprite.sheet.main, sprite.sheet.main.tile.dl);
                var fps = (1000 / tick.dt) | 0;
                sprite.txtL(fb.cx, 16, 16, sprite.sheet.txt, "Pg1\nfps:" + fps);
            } else if (2 === db._con) {
                if (io.kb.up === io.st.kb) {
                    db._sheet = (db._sheet + db._sheets.length - 1) % db._sheets.length;
                    db._dumpTiles();
                } else if (io.kb.down === io.st.kb) {
                    db._sheet = (db._sheet + 1) % db._sheets.length;
                    db._dumpTiles();
                } else if (io.kb.left === io.st.kb) {
                    db._tile = (db._tile + db._tiles.length - 1) % db._tiles.length;
                } else if (io.kb.right === io.st.kb) {
                    db._tile = (db._tile + 1) % db._tiles.length;
                }
                sprite.box(fb.cx, 0, 0, 352, 128, sprite.sheet.main, sprite.sheet.main.tile.dl);
                sprite.txtL(
                    fb.cx, 16, 16, sprite.sheet.txt, 'Pg2'
                    + '\nsheet:' + db._sheets[db._sheet]
                    + '\ntile:' + db._tiles[db._tile]
                );
                var sheet = sprite.sheet[db._sheets[db._sheet]];
                var tile = sheet.tile[db._tiles[db._tile]];
                fb.cx.fillStyle = '#333';
                if (undefined === tile.nw) {
                    fb.cx.fillRect(0, 128, tile.w, tile.h);
                    fb.cx.drawImage(sheet.img, tile.x, tile.y, tile.w, tile.h, 0, 128, tile.w, tile.h);
                } else {
                    fb.cx.fillRect(0, 128, tile.nw.w + tile.nc.w + tile.ne.w + 2, tile.nw.h + tile.cw.h + tile.sw.h + 2);
                    fb.cx.drawImage(sheet.img, tile.nw.x, tile.nw.y, tile.nw.w, tile.nw.h, 0, 128, tile.nw.w, tile.nw.h);
                    fb.cx.drawImage(sheet.img, tile.nc.x, tile.nc.y, tile.nc.w, tile.nc.h, tile.nw.w + 1, 128, tile.nc.w, tile.nc.h);
                    fb.cx.drawImage(sheet.img, tile.ne.x, tile.ne.y, tile.ne.w, tile.ne.h, tile.nw.w + tile.nc.w + 2, 128, tile.ne.w, tile.ne.h);
                    fb.cx.drawImage(sheet.img, tile.cw.x, tile.cw.y, tile.cw.w, tile.cw.h, 0, tile.nw.h + 129, tile.cw.w, tile.cw.h);
                    fb.cx.drawImage(sheet.img, tile.cc.x, tile.cc.y, tile.cc.w, tile.cc.h, tile.nw.w + 1, tile.nw.h + 129, tile.cc.w, tile.cc.h);
                    fb.cx.drawImage(sheet.img, tile.ce.x, tile.ce.y, tile.ce.w, tile.ce.h, tile.nw.w + tile.nc.w + 2, tile.nw.h + 129, tile.ce.w, tile.ce.h);
                    fb.cx.drawImage(sheet.img, tile.sw.x, tile.sw.y, tile.sw.w, tile.sw.h, 0, tile.nw.h + tile.cw.h + 130, tile.sw.w, tile.sw.h);
                    fb.cx.drawImage(sheet.img, tile.sc.x, tile.sc.y, tile.sc.w, tile.sc.h, tile.nw.w + 1, tile.nw.h + tile.cw.h + 130, tile.sc.w, tile.sc.h);
                    fb.cx.drawImage(sheet.img, tile.se.x, tile.se.y, tile.se.w, tile.se.h, tile.nw.w + tile.nc.w + 2, tile.nw.h + tile.cw.h + 130, tile.se.w, tile.se.h);
                }
            }
            if (undefined !== io.st.x0) {
                fb.cx.fillStyle = 'rgba(255,255,255,0.5)';
                fb.cx.beginPath();
                fb.cx.arc(io.st.x0, io.st.y0, 10, 0, 2 * Math.PI, false);
                if (undefined !== io.st.x1) {
                    fb.cx.arc(io.st.x1, io.st.y1, 10, 0, 2 * Math.PI, false);
                }
                fb.cx.fill();
                if (undefined !== io.st.x1) {
                    fb.cx.beginPath();
                    fb.cx.moveTo(io.st.x0, io.st.y0);
                    fb.cx.lineTo(io.st.x1, io.st.y1);
                    fb.cx.lineWidth = 2;
                    fb.cx.strokeStyle = fb.cx.fillStyle;
                    fb.cx.stroke();
                }
            }
        },
        _con: 0,
        _toArr: function(obj) {
            var arr = Object.keys(obj);
            arr.sort();
            return arr;
        },
        _dumpTiles: function() {
            db._tiles = db._toArr(sprite.sheet[db._sheets[db._sheet]].tile);
            db._tile = 0;
        },
        _sheet: 0
    };
    db._sheets = db._toArr(sprite.sheet);
    db._dumpTiles();

    function prng(max) {
        prng._s ^= (prng._s << 21);
        prng._s ^= (prng._s >>> 35);
        prng._s ^= (prng._s << 4);
        var r = (prng._s & 0x7ffffffe) / 0x7fffffff;
        return (r * max) | 0;
    }
    prng._s = (Date.now() ^ Math.random()) | 1;

    function tick() {
        var ts = Date.now();
        tick.dt = ts - tick.ts;
        tick.ts = ts;
    }
    tick.rst = function() {
        tick.dt = 1 / 60;
        tick.ts = Date.now();
    };

    function q() {
        for (var i in q._lst) {
            var fn = q._lst[i];
            var dt = tick.ts - fn.q.ts;
            if (0 > dt) {
                continue;
            }
            var rm = 0 < fn.q.td && dt > fn.q.td;
            if (rm) {
                dt = fn.q.td;
            }
            var pct = 0 < fn.q.td ? dt / fn.q.td : 1;
            fn(dt, pct);
            if (rm) {
                delete q._lst[i];
                q.size--;
            }
        }
    }
    q.add = function(fn, ts, td) {
        fn.q = {
            id: 'f' + q._id++,
            ts: tick.ts + ts,
            td: td
        };
        q._lst[fn.q.id] = fn;
        q.size++;
    };
    q.del = function(fn) {
        if (undefined !== fn.q && undefined !== q._lst[fn.q.id]) {
            delete q._lst[fn.q.id];
            q.size--;
        }
    };
    q.dt = function(fn) {
        if (undefined === fn.q) {
            return 0;
        }
        if (undefined === q._lst[fn.q.id]) {
            return 0;
        }
        return tick.ts - fn.q.ts;
    };
    q.isDone = function(fn) {
        return undefined === fn.q || undefined === q._lst[fn.q.id];
    };
    q.rst = function() {
        q._lst = [];
        q.size = 0;
    };
    q._id = 0;

    function FB() {
        this.cv = window.document.createElement('canvas');
        this.cv.width = FB.w;
        this.cv.height = FB.h;
        this.cx = this.cv.getContext('2d');
        FB._lst.push(this);
        this._dcv = db.cv(320, 240);
        if (this._dcv) {
            this._dcx = this._dcv.getContext('2d');
        }
    }
    FB.prototype.clr = function() {
        this.cx.clearRect(0, 0, this.cv.width, this.cv.height);
    };
    FB.prototype.flush = function() {
        if ('none' !== this.cv.style.display) {
            FB._cx.drawImage(this.cv, 0, 0, FB._cv.width, FB._cv.height);
        }
        if (db.val && this._dcv) {
            this._dcx.clearRect(0, 0, this._dcv.width, this._dcv.height);
            this._dcx.drawImage(this.cv, 0, 0, this._dcv.width, this._dcv.height);
        }
    };
    FB.clr = function() {
        for (var i = 0; i < FB._lst.length; i++) {
            FB._lst[i].clr();
        }
    };
    FB.flush = function() {
        FB._cx.clearRect(0, 0, FB._cv.width, FB._cv.height);
        for (var i = 0; i < FB._lst.length; i++) {
            FB._lst[i].flush();
        }
    };
    FB.show = function() {
        FB.resize();
        FB.clr();
        FB.flush();
        window.document.body.appendChild(FB._bg);
        window.document.body.appendChild(FB._cv);
        if ('activeElement' in window.document) {
            window.document.activeElement.blur();
        }
    };
    FB.hide = function() {
        window.document.body.removeChild(FB._cv);
        window.document.body.removeChild(FB._bg);
    };
    FB.resize = function() {
        var x = 0;
        var y = 0;
        var w = window.innerWidth;
        var h = window.innerHeight;
        if (FB._rel) {
            if (FB.w / FB.h > w / h) {
                h = (w * FB.h / FB.w) | 0;
                y = (window.innerHeight - h) >> 1;
            } else {
                w = (h * FB.w / FB.h) | 0;
                x = (window.innerWidth - w) >> 1;
            }
        }
        FB._cv.style.left = x + 'px';
        FB._cv.style.top = y + 'px';
        FB._cv.width = w;
        FB._cv.height = h;
        FB.sx = FB.w / FB._cv.width;
        FB.sy = FB.h / FB._cv.height;
    };
    FB.rel = function(rel) {
        if (rel !== FB._rel) {
            FB._rel = rel;
            FB.resize();
        }
    };
    FB.bg = function(show) {
        FB._bg.style.display = show ? 'block' : 'none';
    };
    FB._lst = [];
    FB._bg = window.document.createElement('div');
    FB._bg.style.backgroundColor = '#000';
    FB._bg.style.position = 'fixed';
    FB._bg.style.left = 0;
    FB._bg.style.top = 0;
    FB._bg.style.right = 0;
    FB._bg.style.bottom = 0;
    FB._bg.style.zIndex = 9998;
    FB._cv = window.document.createElement('canvas');
    FB._cv.style.position = 'fixed';
    FB._cv.style.left = 0;
    FB._cv.style.top = 0;
    FB._cv.style.zIndex = 9999;
    FB._cx = FB._cv.getContext('2d');
    FB._rel = false;
    FB.w = 512;
    FB.h = 384;
    FB.sx = 1;
    FB.sy = 1;
    window.addEventListener('resize', FB.resize);

    var io = {
        st: {
            x0: undefined,
            y0: undefined,
            x1: undefined,
            y1: undefined,
            dn: false,
            up: false,
            kb: undefined
        },
        kb: {
            0: 48,
            1: 49,
            2: 50,
            3: 51,
            4: 52,
            9: 57,
            up: 38,
            down: 40,
            left: 37,
            right: 39
        },
        _kb: function(e) {
            io.st.kb = e.which;
            db.log('kb=' + e.which);
        },
        _coords: function(e) {
            var r = this.getBoundingClientRect();
            io.st.x1 = ((e.clientX - r.left) * FB.sx) | 0;
            io.st.y1 = ((e.clientY - r.top) * FB.sy) | 0;
        },
        _msDn: function(e) {
            if (0 === e.button) {
                io._coords.call(this, e);
                io.st.x0 = io.st.x1;
                io.st.y0 = io.st.y1;
                io.st.dn = true;
            }
        },
        _msMv: function(e) {
            if (undefined !== io.st.x0) {
                io._coords.call(this, e);
            }
        },
        _msUp: function(e) {
            if (0 === e.button) {
                io._coords.call(this, e);
                io.st.up = true;
            }
        },
        _msOut: function(e) {
            io.st.up = true;
        },
        rst: function(full) {
            if (full || io.st.up) {
               io.st.x0 = undefined;
               io.st.y0 = undefined;
               io.st.x1 = undefined;
               io.st.y1 = undefined;
            }
            io.st.dn = false;
            io.st.up = false;
            io.st.kb = undefined;
        }
    };
    window.document.addEventListener('keydown', io._kb);
    FB._cv.addEventListener('mousedown', io._msDn);
    FB._cv.addEventListener('mousemove', io._msMv);
    FB._cv.addEventListener('mouseup', io._msUp);
    FB._cv.addEventListener('mouseout', io._msOut);
    //todo: window.document.addEventListener('touchstart', io._ts);

    function scn() {
        if (!scn.run) {
            FB.hide();
            return;
        }
        tick();
        scn.run();
        q();
        db.con(scn.fb3);
        FB.flush();
        io.rst(false);
        requestAnimationFrame(scn);
    }
    scn.fb1 = new FB();
    scn.fb2 = new FB();
    scn.fb3 = new FB();

    function fadeAnim(dt, pct) {
        var a = pct;
        if (fadeAnim._in) {
            a = 1 - a;
        }
        var fb = fadeAnim._fb;
        fb.cx.fillStyle = fadeAnim._pref + a + ')';
        fb.cx.fillRect(0, 0, fb.cv.width, fb.cv.height);
        var g = fb.cx.createRadialGradient(fadeAnim._x, fadeAnim._y, 0, fadeAnim._x, fadeAnim._y, fadeAnim._r);
        g.addColorStop(0, fadeAnim._pref + '0)');
        g.addColorStop(0.8, fadeAnim._pref + a + ')');
        fb.cx.fillStyle = g;
        fb.cx.fillRect(0, 0, fb.cv.width, fb.cv.height);
    }
    fadeAnim.rst = function(fb, fadeIn, isWhite) {
        fadeAnim._fb = fb;
        fadeAnim._in = fadeIn;
        fadeAnim._x = fb.cv.width >> 1;
        fadeAnim._y = fb.cv.height >> 1;
        fadeAnim._pref = isWhite ? 'rgba(255,255,255,' : 'rgba(0,0,0,';
        fadeAnim._r = Math.sqrt(fadeAnim._x * fadeAnim._x + fadeAnim._y * fadeAnim._y);
    };

    function initScn() {
        if (0 >= q.size) {
            scn.run = gameScn;
            gameScn.rst();
            gameScn();
        }
    }
    initScn.rst = function() {
        q.rst();
        FB.rel(false);
        FB.bg(false);
        fadeAnim.rst(scn.fb2, false, false);
        q.add(fadeAnim, 0, 2000);
    };

    function msg(dt) {
        var bgw = msg._txt.length * sprite.sheet.txt.txt.sp;
        var bgt = sprite.sheet.main.tile.dl;
        var txt = msg._txt;
        if (500 > dt) {
            bgw *= dt / 500;
            txt = '';
        } else {
            var len = ((dt - 500) / 50) | 0;
            if (txt.length > len) {
                txt = txt.substring(0, len);
            } else if (io.st.dn) {
                q.del(msg);
            }
        }
        bgw = (bgw + bgt.nw.w + bgt.ne.w) | 0;
        sprite.box(
            msg._fb.cx,
            msg._x - (bgw >> 1), msg._y, bgw, bgt.nw.h + bgt.cw.h + bgt.sw.h,
            sprite.sheet.main, bgt
        );
        sprite.txtL(
            msg._fb.cx,
            msg._x - ((msg._txt.length * sprite.sheet.txt.txt.sp) >> 1), msg._y + 16,
            sprite.sheet.txt, txt
        );
    }
    msg.show = function(txt, ts) {
        msg._txt = txt;
        q.add(msg, ts, 0);
    };
    msg.rst = function(fb, x, y) {
        msg._fb = fb;
        msg._x = x;
        msg._y = y;
    };

    var winner = undefined;
    var teams = [];

    function Bullet(fb, dx) {
        this.fb = fb;
        this.dx = dx;
        var self = this;
        this.run = function(dt) {
            if (500 > dt) {
                var amt = dt / 500;
                var x = (self.x0 + (self.x1 - self.x0) * amt) | 0;
                var y = (self.y0 + (self.y1 - self.y0) * amt) | 0;
                var tile = sprite.sheet.main.tile.dl.nw;
                fb.cx.drawImage(
                    sprite.sheet.main.img,
                    tile.x, tile.y, tile.w, tile.h,
                    x - (tile.w >> 1), y - (tile.h >> 1), tile.w, tile.h
                );
            } else {
                if (undefined === winner && !self.spent) {
                    self.spent = true;
                    self.tgt.hp -= 20;
                }
                dt -= 500;
                var f = (dt * sprite.anim) | 0;
                var anim = sprite.sheet.main.anim.sm;
                if (f < anim.length) {
                    var dy = dt / 50;
                    fb.cx.drawImage(
                        sprite.sheet.main.img,
                        anim[f].x, anim[f].y, anim[f].w, anim[f].h,
                        self.x1 - (anim[f].w >> 1), self.y1 - (anim[f].h >> 1) - dy, anim[f].w, anim[f].h
                    );
                } else {
                    q.del(self.run);
                }
            }
        };
    }
    Bullet.prototype.rst = function(tgt, x0, y0, x1, y1) {
        this.tgt = tgt;
        this.x0 = x0;
        this.y0 = y0;
        this.x1 = x1;
        this.y1 = y1;
        this.spent = false;
        q.add(this.run, 0);
    };

    function Unit(team, fb1, fb2, dx) {
        this.team = team;
        this.fb1 = fb1;
        this.fb2 = fb2;
        this.dx = dx;
        this.bullets = {
            reserve: [
                new Bullet(fb2, dx),
                new Bullet(fb2, dx),
                new Bullet(fb2, dx),
                new Bullet(fb2, dx)
            ],
            next: 0,
            ts: 0
        };
    }
    Unit.prototype.upd = function() {
        if (undefined !== winner) {
            this.draw();
            return;
        }
        if (this.immune) {
            this.warpIn();
            return;
        }

        if (undefined !== this.enemy) {
            if (0 >= this.enemy.hp) {
                this.enemy = undefined;
                this.disarmBullets();
                this.ts = tick.ts;
            } else {
                this.atk();
                return;
            }
        }

        var max = this.x + 60 * this.dx;
        var x0 = Math.min(this.x, max);
        var x1 = Math.max(this.x, max);
        var enemies = teams[1 - this.team];
        for (var i = enemies.length - 1; 0 <= i; i--) {
            var enemy = enemies[i];
            if (x0 <= enemy.x && x1 >= enemy.x && 0 < enemy.hp && !enemy.immune) {
                this.enemy = enemy;
                this.ts = tick.ts;
                this.atk();
                return;
            }
        }

        this.idle();
    };
    Unit.prototype.disarmBullets = function() {
        for (var i = 0; i < this.bullets.reserve.length; i++) {
            this.bullets.reserve[i].spent = true;
        }
    };
    Unit.prototype.atk = function() {
        var bullet = this.bullets.reserve[this.bullets.next];
        if (tick.ts - this.bullets.ts > 200 && q.isDone(bullet.run)) {
            bullet.rst(
                this.enemy,
                this.x,
                this.y - (this.tile.h >> 1),
                this.enemy.x - (this.enemy.tile.w >> 2) + prng(this.enemy.tile.w >> 1),
                (this.enemy.y - (this.enemy.tile.h * 0.75) + prng(this.enemy.tile.h >> 1)) | 0
            );
            this.bullets.next = (this.bullets.next + 1) % this.bullets.reserve.length;
            this.bullets.ts = tick.ts;
        }
        this.draw();
    };
    Unit.prototype.idle = function() {
        var dt = tick.ts - this.ts;
        var dx = (dt / 10) | 0;
        if (0 < dx) {
            this.x += dx * this.dx;
            this.y = (this.y0 + 8 * Math.sin(Math.PI * (this.x - this.x0) / 64)) | 0;
            this.ts = tick.ts;
        }
        this.draw();
    };
    Unit.prototype.warpIn = function() {
        var dt = tick.ts - this.ts;
        var h = dt / 10;
        if (h >= this.tile.h) {
            this.immune = false;
            this.ts = tick.ts;
            this.idle();
        } else {
            this.fb1.cx.save();
            this.fb1.cx.translate(this.x, this.y - this.tile.h);
            if (0 < this.dx) {
                this.fb1.cx.scale(-1, 1);
            }
            this.fb1.cx.drawImage(
                sprite.sheet.main.img,
                this.tile.x, this.tile.y, this.tile.w, h,
                -(this.tile.w >> 1), 0, this.tile.w, h
            );
            this.fb1.cx.restore();
        }
    };
    Unit.prototype.draw = function() {
        this.fb1.cx.save();
        this.fb1.cx.translate(this.x, this.y - this.tile.h);
        if (0 < this.dx) {
            this.fb1.cx.scale(-1, 1);
        }
        this.fb1.cx.drawImage(
            sprite.sheet.main.img,
            this.tile.x, this.tile.y, this.tile.w, this.tile.h,
            -(this.tile.w >> 1), 0, this.tile.w, this.tile.h
        );
        this.fb1.cx.restore();
    };
    Unit.prototype.rst = function(tile, x, y, hp) {
        this.tile = tile;
        this.x = x;
        this.x0 = x + prng(128);
        this.y0 = y;
        this.y = (this.y0 + 8 * Math.sin(Math.PI * (this.x - this.x0) / 64)) | 0;
        this.ts = tick.ts;
        this.hp = hp;
        this.enemy = undefined;
        this.immune = true;
    };
    Unit.defeated = function(unit) {
        unit.disarmBullets();
        var fb = unit.fb1;
        var tile = unit.tile;
        var x = unit.x;
        var y = unit.y - (tile.h >> 1);
        var flip = 0 < unit.dx;
        q.add(function(dt, pct) {
            fb.cx.save();
            fb.cx.globalAlpha = 1 - pct;
            fb.cx.translate(x, (y + tile.h * pct / 2) | 0);
            if (flip) {
                fb.cx.scale(-1, 1);
            }
            fb.cx.rotate(Math.PI * pct / 2);
            fb.cx.drawImage(
                sprite.sheet.main.img,
                tile.x, tile.y, tile.w, tile.h,
                -(tile.w >> 1), -(tile.h >> 1), tile.w, tile.h
            );
            fb.cx.restore();
        }, 0, 1000);
    };

    function hero(_hero) {
        if (0 >= _hero.hp) {
            _hero.hp = 0;
            winner = 1 - _hero.team;
            if (!hero.ended) {
                hero.ended = true;
                if (0 === _hero.team) {
                    msg.show(lang.lose, 0);
                } else {
                    msg.show(lang.win, 0);
                }
            }
        }
        if (_hero.chp > _hero.hp) {
            if (tick.ts >= _hero.ts2) {
                _hero.chp = Math.max(_hero.chp - 5, _hero.hp);
                _hero.ts2 = tick.ts + 20;
            }
        }
        if (0 >= _hero.hp) {
            hero.set(_hero, 2);
        } else if (_hero.chp > _hero.hp || tick.ts < _hero.ts2 + 200) {
            hero.set(_hero, 1);
        } else {
            hero.set(_hero, 0);
        }

        var dt = tick.ts - _hero.ts;
        if (0 === _hero.st) {
            hero.idle(_hero, dt);
        } else if (1 === _hero.st) {
            hero.distress(_hero, dt);
        } else if (2 === _hero.st) {
            hero.defeated(_hero, dt);
        }

        hero.updUnits(_hero);
    }
    hero.set = function(_hero, st) {
        if (st !== _hero.st) {
            _hero.st = st;
            _hero.ts = tick.ts;
        }
    };
    hero.idle = function(_hero, dt) {
        var x = _hero.x - (_hero.tile.w >> 1);
        x += (4 * Math.sin(Math.PI * dt / 1000)) | 0;
        var y = _hero.y - _hero.tile.h;
        y += (2 * Math.sin(Math.PI * dt / 500)) | 0;
        _hero.fb1.cx.drawImage(
            sprite.sheet.main.img,
            _hero.tile.x, _hero.tile.y, _hero.tile.w, _hero.tile.h,
            x, y, _hero.tile.w, _hero.tile.h
        );
    };
    hero.distress = function(_hero, dt) {
        var amt = Math.sin(Math.PI * dt / 500);
        var w = _hero.tile.w + ((8 * amt) | 0);
        var h = _hero.tile.h - ((16 * amt) | 0);
        _hero.fb1.cx.drawImage(
            sprite.sheet.main.img,
            _hero.tile.x, _hero.tile.y, _hero.tile.w, _hero.tile.h,
            _hero.x - (w >> 1), _hero.y - h, w, h
        );
    };
    hero.defeated = function(_hero, dt) {
        var s = 1 - dt / 2000;
        var w = (s * _hero.tile.w) | 0;
        var h = (s * _hero.tile.h) | 0;

        if (2 < w && 2 < h) {
            _hero.fb1.cx.save();
            _hero.fb1.cx.translate(_hero.x, _hero.y - (_hero.tile.h >> 1));
            _hero.fb1.cx.rotate(Math.PI * dt / 500);
            _hero.fb1.cx.drawImage(
                sprite.sheet.main.img,
                _hero.tile.x, _hero.tile.y, _hero.tile.w, _hero.tile.h,
                -(w >> 1), -(h >> 1), w, h
            );
            _hero.fb1.cx.restore();
        }
    };
    hero.updUnits = function(_hero) {
        var units = teams[_hero.team];
        var i = 1;
        while (i < units.length) {
            var unit = units[i];
            if (0 < unit.hp) {
                i++;
            } else {
                Unit.defeated(unit);
                units.splice(i, 1);
                _hero.units.reserve.push(unit);
            }
        }

        if (0 < _hero.units.queue.length && 0 < _hero.units.reserve.length && tick.ts - _hero.units.ts > 500) {
            var tile = _hero.units.queue.shift();
            _hero.units.ts = tick.ts;
            unit = _hero.units.reserve.pop();
            unit.rst(tile, _hero.x, _hero.y, _hero.uhp);
            units.push(unit);
        }

        for (i = 1; i < units.length; i++) {
            units[i].upd();
        }
    };
    hero.rst = function(_hero, team, fb1, fb2, tile, x, y, hp, uhp, units) {
        _hero.team = team;
        _hero.fb1 = fb1;
        _hero.fb2 = fb2;
        _hero.tile = tile;
        _hero.x = x;
        _hero.y = y;
        _hero.st = 0;
        _hero.ts = tick.ts;
        _hero.ts2 = 0;
        _hero.mhp = hp;
        _hero.chp = _hero.mhp;
        _hero.hp = _hero.mhp;
        _hero.uhp = uhp;
        _hero.units = {
            reserve: units,
            queue: [],
            ts: tick.ts
        };
    };

    function hero1() {
        hero(hero1);
        hero1.bar();
    }
    hero1.bar = function() {
        var sheet = sprite.sheet.main;
        var tile = sheet.tile.brY;
        var w1 = (tile.w * hero1.hp / hero1.mhp) | 0;
        hero1.fb2.cx.drawImage(
            sheet.img,
            tile.x, tile.y, w1, tile.h,
            6, 6, w1, tile.h
        );

        if (hero1.chp > hero1.hp) {
            tile = sheet.tile.brR;
            var w2 = (tile.w * (hero1.chp - hero1.hp) / hero1.mhp) | 0;
            hero1.fb2.cx.drawImage(
                sheet.img,
                tile.x, tile.y, w2, tile.h,
                6 + w1, 6, w2, tile.h
            );
        }
    };

    function hero2() {
        hero(hero2);
        hero2.bar();
        if (undefined === winner && tick.ts >= hero2.deploy) {
            hero2.sched();
            hero2.units.queue.push(hero2.unitTypes[prng(hero2.unitTypes.length)]);
        }
    }
    hero2.bar = function() {
        var sheet = sprite.sheet.main;
        var tile = sheet.tile.brY;
        var w1 = (tile.w * hero2.hp / hero2.mhp) | 0;
        hero2.fb2.cx.drawImage(
            sheet.img,
            tile.x, tile.y, w1, tile.h,
            392 + tile.w - w1, 6, w1, tile.h
        );

        if (hero2.chp > hero2.hp) {
            tile = sheet.tile.brR;
            var w2 = (tile.w * (hero2.chp - hero2.hp) / hero2.mhp) | 0;
            hero2.fb2.cx.drawImage(
                sheet.img,
                tile.x, tile.y, w2, tile.h,
                392 + tile.w - w1 - w2, 6, w2, tile.h
            );
        }
    };
    hero2.sched = function() {
        hero2.deploy = tick.ts + 2000 + prng(2000);
    };
    hero2.unitTypes = [
        sprite.sheet.main.tile.un0,
        sprite.sheet.main.tile.un1,
        sprite.sheet.main.tile.un2,
        sprite.sheet.main.tile.un3,
        sprite.sheet.main.tile.un4,
        sprite.sheet.main.tile.un5,
        sprite.sheet.main.tile.un6,
    ];

    function Tile(x, y, c, r, type) {
        this._x = x;
        this._y = y;
        this._c = c;
        this._r = r;
        this.dx = 0;
        this.dy = 0;
        this._id = c + ',' + r;
        this._type = type;
    }
    Tile.prototype.upd = function(fb, x0) {
        fb.cx.save();
        fb.cx.fillStyle = this._type.tile.bg;
        var x = this._x + this.dx;
        var y = this._y + this.dy;
        var dim = Tile.dim;
        if (undefined !== this.fts) {
            var dt = (tick.ts - this.fts) / Tile.ftd;
            if (1 < dt) {
                dt = 1;
            }
            fb.cx.globalAlpha = 1 - dt;
            var i = ((Tile.fDim - Tile.dim) * dt) | 0;
            var j = i >> 1;
            x -= j;
            y -= j;
            dim += i;
        }
        if (db.val) {
            fb.cx.fillRect(x, y, dim, dim);
        }
        if (undefined !== this.fts) {
            fb.cx.drawImage(
                sprite.sheet.main.img,
                this._type.tile.x, this._type.tile.y, this._type.tile.w, this._type.tile.h,
                x + 1, y + 1, dim - 2, dim - 2
            );
        } else {
            var dx = Math.max(0, x0 - x);
            if (this._type.tile.w > dx) {
                fb.cx.drawImage(
                    sprite.sheet.main.img,
                    this._type.tile.x + dx, this._type.tile.y, this._type.tile.w - dx, this._type.tile.h,
                    x + dx + 1, y + 1, this._type.tile.w - dx, this._type.tile.h
                );
            }
        }
        fb.cx.restore();
        this.spd = (Tile.spd * tick.dt) | 0;
        if (1 > this.spd) {
            this.spd = 1;
        }
        if (this.spd < this.dx) {
            this.dx -= this.spd;
        } else if (-this.spd > this.dx) {
            this.dx += this.spd;
        } else {
            this.dx = 0;
        }
        if (this.spd < this.dy) {
            this.dy -= this.spd;
        } else if (-this.spd > this.dy) {
            this.dy += this.spd;
        } else {
            this.dy = 0;
        }
    };
    Tile.prototype.set = function(type, dx, dy) {
        this._type = type;
        this.dx = dx;
        this.dy = dy;
        this.fts = undefined;
    };
    Tile.swp = function(t0, t1) {
        var t = t0._type;
        t0._type = t1._type;
        t1._type = t;
    }
    Tile.dim = 54;
    Tile.fDim = (Tile.dim * 1.25) | 0;
    Tile.ftd = 500;
    Tile.spd = Tile.dim / 100;
    Tile.types = [
        {tile: sprite.sheet.main.tile.bl0, unit: sprite.sheet.main.tile.un0},
        {tile: sprite.sheet.main.tile.bl1, unit: sprite.sheet.main.tile.un1},
        {tile: sprite.sheet.main.tile.bl2, unit: sprite.sheet.main.tile.un2},
        {tile: sprite.sheet.main.tile.bl3, unit: sprite.sheet.main.tile.un3},
        {tile: sprite.sheet.main.tile.bl4, unit: sprite.sheet.main.tile.un4},
        {tile: sprite.sheet.main.tile.bl5, unit: sprite.sheet.main.tile.un5},
        {tile: sprite.sheet.main.tile.bl6, unit: sprite.sheet.main.tile.un6}
    ];
    Tile.near = [
        {c: -1, r: 0},
        {c: 1, r: 0},
        {c: 0, r: -1},
        {c: 0, r: 1},
    ];

    function grid() {
        for (var c = 0; c < grid._c; c++) {
            for (var r = 0; r < grid._r; r++) {
                var tile = grid._tiles[c][r];
                if (tile === grid._zt) {
                    continue;
                }
                tile.upd(grid._fb, grid._x);
            }
        }
        if (undefined !== grid._zt) {
            grid._zt.upd(grid._fb, grid._x);
        }
    }
    grid.roll = function() {
        for (var c = 0; c < grid._c; c++) {
            var t = c % Tile.types.length;
            for (var r = 0; r < grid._r; r++) {
                grid._tiles[c][r].set(Tile.types[t], 0, 0);
                t = (t + 1) % Tile.types.length;
            }
        }
        grid._rnd();
        while (!grid.hasMove()) {
            db.log('[roll] no moves, randomize some more');
            grid._rnd();
        }
        for (var r = 0; r < grid._r; r++) {
            for (var c = 0; c < grid._c; c++) {
                grid._tiles[c][r].dx = -grid._w - (r + grid._c - c) * 16;
            }
        }
    };
    grid._rnd = function() {
        for (var i = 0; i < 36; i++) {
            var c0 = prng(grid._c);
            var r0 = prng(grid._r);
            var n0 = prng(Tile.near.length);
            for (var n = 0; n < Tile.near.length; n++) {
                var n1 = (n0 + n) % Tile.near.length;
                var c1 = c0 + Tile.near[n1].c;
                var r1 = r0 + Tile.near[n1].r;
                if (0 > c1 || grid._c <= c1 || 0 > r1 || grid._r <= r1) {
                    continue;
                }
                var t0 = grid._tiles[c0][r0];
                var t1 = grid._tiles[c1][r1];
                Tile.swp(t0, t1);
                if (3 <= grid.cnt(t0).length || 3 <= grid.cnt(t1).length) {
                    Tile.swp(t0, t1);
                    continue;
                }
                break;
            }
        }
    };
    grid.cnt = function(src) {
        var tiles = [];
        var unproc = [src];
        var proc = [];
        proc[src._id] = 1;
        while (0 < unproc.length) {
            var tile = unproc.shift();
            if (tile._type !== src._type) {
                continue;
            }
            tiles.push(tile);
            for (var i = 0; i < Tile.near.length; i++) {
                var c = tile._c + Tile.near[i].c;
                var r = tile._r + Tile.near[i].r;
                if (0 > c || grid._c <= c || 0 > r || grid._r <= r) {
                    continue;
                }
                if (undefined !== proc[grid._tiles[c][r]._id]) {
                    continue;
                }
                unproc.push(grid._tiles[c][r]);
                proc[grid._tiles[c][r]._id] = 1;
            }
        }
        return tiles;
    };
    grid.replace = function(tiles) {
        var idx = [];
        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            var c = tile._c;
            var r = tile._r;
            if (undefined === idx[r]) {
                idx[r] = c;
            } else {
                idx[r] = Math.max(idx[r], c);
            }
        }
        for (r = 0; r < grid._r; r++) {
            if (undefined === idx[r]) {
                continue;
            }
            var dc = -1;
            var dx = Tile.dim * dc;
            for (c = idx[r]; c >= 0; c--) {
                var c1 = c + dc;
                while (0 <= c1 && undefined !== grid._tiles[c1][r].fts) {
                    dc--;
                    dx -= Tile.dim;
                    c1--;
                }
                if (0 > c1) {
                    grid._tiles[c][r].set(Tile.types[prng(Tile.types.length)], dx, 0);
                } else {
                    grid._tiles[c][r].set(grid._tiles[c1][r]._type, dx, 0);
                }
            }
        }
        return idx;
    };
    grid.hasMove = function() {
        for (var c = 0; c < grid._c; c++) {
            for (var r = 0; r < grid._r; r++) {
                var c1 = c + 1;
                var r1 = r + 1;
                if (c1 < grid._c) {
                    Tile.swp(grid._tiles[c][r], grid._tiles[c1][r]);
                    var cnt1 = grid.cnt(grid._tiles[c][r]);
                    var cnt2 = grid.cnt(grid._tiles[c1][r]);
                    Tile.swp(grid._tiles[c][r], grid._tiles[c1][r]);
                    if (3 <= cnt1.length || 3 <= cnt2.length) {
                        return true;
                    }
                }
                if (r1 < grid._r) {
                    Tile.swp(grid._tiles[c][r], grid._tiles[c][r1]);
                    cnt1 = grid.cnt(grid._tiles[c][r]);
                    cnt2 = grid.cnt(grid._tiles[c][r1]);
                    Tile.swp(grid._tiles[c][r], grid._tiles[c][r1]);
                    if (3 <= cnt1.length || 3 <= cnt2.length) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    grid.ondn = function() {
        if (io.st.x0 < grid._x
            || io.st.x0 >= grid._x + grid._w
            || io.st.y0 < grid._y
            || io.st.y0 >= grid._y + grid._h) {
            return;
        }
        var c = ((io.st.x0 - grid._x) / Tile.dim) | 0;
        var r = ((io.st.y0 - grid._y) / Tile.dim) | 0;
        grid._at = grid._tiles[c][r];
        grid._zt = grid._at;
        db.log('grabbed ' + c + ', ' + r);
    };
    grid.onmv = function() {
        var dx = io.st.x1 - io.st.x0;
        var dy = io.st.y1 - io.st.y0;
        if (Math.abs(dx) >= Math.abs(dy)) {
            if (dx > Tile.dim) {
                dx = Tile.dim;
            } else if (dx < -Tile.dim) {
                dx = -Tile.dim;
            }
            if (0 < dx && grid._at._c + 1 < grid._c) {
                grid._tiles[grid._at._c + 1][grid._at._r].dx = -dx;
            } else if (0 > dx && grid._at._c > 0) {
                grid._tiles[grid._at._c - 1][grid._at._r].dx = -dx;
            } else {
                dx = 0;
            }
            grid._at.dx = dx;
            grid._at.dy = 0;
        } else {
            if (dy > Tile.dim) {
                dy = Tile.dim;
            } else if (dy < -Tile.dim) {
                dy = -Tile.dim;
            }
            if (0 < dy && grid._at._r + 1 < grid._r) {
                grid._tiles[grid._at._c][grid._at._r + 1].dy = -dy;
            } else if (0 > dy && grid._at._r > 0) {
                grid._tiles[grid._at._c][grid._at._r - 1].dy = -dy;
            } else {
                dy = 0;
            }
            grid._at.dx = 0;
            grid._at.dy = dy;
        }
    };
    grid.onup = function() {
        var result = [];
        if (undefined !== grid._at) {
            var test = (Tile.dim >> 1) - grid._at.spd;
            var tile = undefined;
            if (test <= grid._at.dx) {
                tile = grid._tiles[grid._at._c + 1][grid._at._r];
            } else if (-test >= grid._at.dx) {
                tile = grid._tiles[grid._at._c - 1][grid._at._r];
            } else if (test <= grid._at.dy) {
                tile = grid._tiles[grid._at._c][grid._at._r + 1];
            } else if (-test >= grid._at.dy) {
                tile = grid._tiles[grid._at._c][grid._at._r - 1];
            }
            if (undefined !== tile) {
                Tile.swp(grid._at, tile);
                var tiles = grid.cnt(grid._at);
                if (3 <= tiles.length) {
                    result = result.concat(tiles);
                    for (var i = 2; i < tiles.length; i++) {
                        hero1.units.queue.push(tiles[i]._type.unit);
                    }
                }
                tiles = grid.cnt(tile);
                if (3 <= tiles.length) {
                    result = result.concat(tiles);
                    for (var i = 2; i < tiles.length; i++) {
                        hero1.units.queue.push(tiles[i]._type.unit);
                    }
                }
                if (0 >= result.length) {
                    Tile.swp(grid._at, tile);
                } else {
                    grid._at.dx = 0;
                    grid._at.dy = 0;
                    tile.dx = 0;
                    tile.dy = 0;
                }
            }
            grid._at = undefined;
        }
        return result;
    };
    grid.rst = function(fb, x, y, c, r) {
        grid._fb = fb;
        grid._x = x;
        grid._y = y;
        grid._c = c;
        grid._r = r;
        grid._w = c * Tile.dim;
        grid._h = r * Tile.dim;
        grid._tiles = new Array(grid._c);
        for (c = 0; c < grid._c; c++) {
            grid._tiles[c] = new Array(grid._r);
            for (r = 0; r < grid._r; r++) {
                grid._tiles[c][r] = new Tile(grid._x + c * Tile.dim, grid._y + r * Tile.dim, c, r, Tile.types[0]);
            }
        }
        grid._at = undefined;
        grid.roll();
    };

    function gameScn() {
        scn.fb2.clr();
        scn.fb3.clr();
        if (undefined !== winner) {
            if (q.isDone(msg)) {
                scn.run = undefined;
            }
        } else if (0 === gameScn._st) {
            if (0 === grid._tiles[0][grid._r - 1].dx) {
                gameScn._st = 1;
            }
        } else if (1 === gameScn._st) {
            gameScn.io();
        } else if (2 === gameScn._st) {
            if (gameScn._fTiles[0].fts + Tile.ftd <= tick.ts) {
                gameScn._chk = grid.replace(gameScn._fTiles);
                gameScn._st = 3;
            }
        } else if (3 === gameScn._st) {
            gameScn.wait();
        } else if (4 === gameScn._st) {
            if (q.isDone(msg)) {
                grid.roll();
                gameScn._st = 0;
            }
        }
        hero1();
        hero2();
        grid();
    }
    gameScn.io = function() {
        if (io.st.dn) {
            grid.ondn();
        } else if (undefined === io.st.x0 || undefined === grid._at) {
            return;
        } else if (!io.st.up) {
            grid.onmv();
        } else {
            var tiles = grid.onup();
            if (0 >= tiles.length) {
                return;
            }
            for (var i = 0; i < tiles.length; i++) {
                tiles[i].fts = tick.ts;
            }
            gameScn._fTiles = tiles;
            gameScn._st = 2;
        }
    };
    gameScn.wait = function() {
        for (var r = 0; r < grid._r; r++) {
            if (undefined === gameScn._chk[r]) {
                continue;
            }
            if (0 !== grid._tiles[0][r].dx) {
                return;
            }
        }
        var chain = [];
        for (r = 0; r < grid._r; r++) {
            if (undefined === gameScn._chk[r]) {
                continue;
            }
            for (var c = gameScn._chk[r]; c >= 0; c--) {
                tiles = grid.cnt(grid._tiles[c][r]);
                if (3 <= tiles.length) {
                    chain = chain.concat(tiles);
                }
            }
        }
        if (0 < chain.length) {
            for (var i = 0; i < chain.length; i++) {
                chain[i].fts = tick.ts;
            }
            gameScn._fTiles = chain;
            gameScn._st = 2;
        } else if (grid.hasMove()) {
            gameScn._st = 1;
        } else {
            msg.show(lang.noMoves, 0);
            gameScn._st = 4;
        }
    };
    gameScn.rst = function() {
        q.rst();
        FB.rel(true);
        FB.bg(true);
        scn.fb1.cx.drawImage(
            sprite.sheet.main.img,
            sprite.sheet.main.tile.bg0.x, sprite.sheet.main.tile.bg0.y, sprite.sheet.main.tile.bg0.w, sprite.sheet.main.tile.bg0.h,
            0, 0, sprite.sheet.main.tile.bg0.w, sprite.sheet.main.tile.bg0.h
        );
        scn.fb1.cx.drawImage(
            sprite.sheet.main.img,
            sprite.sheet.main.tile.bg1.x, sprite.sheet.main.tile.bg1.y, sprite.sheet.main.tile.bg1.w, sprite.sheet.main.tile.bg1.h,
            0, sprite.sheet.main.tile.bg0.h, sprite.sheet.main.tile.bg1.w << 1, sprite.sheet.main.tile.bg1.h << 1
        );
        sprite.box(
            scn.fb1.cx,
            0,
            sprite.sheet.main.tile.bg0.h,
            sprite.sheet.main.tile.bg1.w << 1,
            sprite.sheet.main.tile.bg1.h << 1,
            sprite.sheet.main,
            sprite.sheet.main.tile.wn
        );
        msg.rst(scn.fb2, scn.fb2.cv.width >> 1, ((scn.fb2.cv.height) >> 1) - sprite.sheet.txt.txt.lh);
        hero.rst(
            hero1, 0,
            scn.fb2, scn.fb3, sprite.sheet.main.tile.pl0,
            32, sprite.sheet.main.tile.bg0.h, 5000, 50,
            [
                new Unit(0, scn.fb2, scn.fb3, 1),
                new Unit(0, scn.fb2, scn.fb3, 1),
                new Unit(0, scn.fb2, scn.fb3, 1),
                new Unit(0, scn.fb2, scn.fb3, 1)
            ]
        );
        hero.rst(
            hero2, 1,
            scn.fb2, scn.fb3, sprite.sheet.main.tile.pl1,
            scn.fb2.cv.width - 32, sprite.sheet.main.tile.bg0.h, 4000, 40,
            [
                new Unit(1, scn.fb2, scn.fb3, -1),
                new Unit(1, scn.fb2, scn.fb3, -1),
                new Unit(1, scn.fb2, scn.fb3, -1),
                new Unit(1, scn.fb2, scn.fb3, -1)
            ]
        );
        hero2.sched();
        grid.rst(scn.fb2, 13, sprite.sheet.main.tile.bg0.h + 9, 9, 5);
        winner = undefined;
        teams = [[hero1], [hero2]];
        gameScn._st = 0;
    };

    window.document.addEventListener('DOMContentLoaded', function() {
        if (init.dom) {
            return;
        }
        init.dom = true;
        init();
    });
})();
