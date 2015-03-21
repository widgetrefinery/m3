(function() {
    function init() {
        if (!init.dom ||  0 < init.wait || undefined === scn.run) {
            return;
        }
        tick.rst();
        q.rst();
        FB.show();
        io.rst(true);
        scn.run.rst();
        scn();
    }
    init.dom = false;
    init.wait = 0;

    var lang = {
        noMoves: 'You have no\nmore moves!',
        lose: 'You failed\nyour pokemon!',
        win: 'You are the\npokemaster!',
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
                    br0: {x: 434, y: 344, w:  68, h:   6},
                    br1: {x: 434, y: 350, w:  68, h:   6},
                    bul: {x: 496, y: 260, w:  12, h:  57},
                    dt0: {x: 434, y: 356, w:   7, h:   7},
                    dt1: {x: 441, y: 356, w:   7, h:   7},
                    dt2: {x: 448, y: 356, w:   7, h:   7},
                    dt3: {x: 455, y: 356, w:   7, h:   7},
                    dt4: {x: 462, y: 356, w:   7, h:   7},
                    dt5: {x: 469, y: 356, w:   7, h:   7},
                    dt6: {x: 476, y: 356, w:   7, h:   7},
                    glw: {x: 113, y: 128, w:  32, h:  32},
                    hud: {x:   0, y: 231, w: 114, h:  29},
                    lb0: {x: 434, y: 322, w:  32, h:  22},
                    lb1: {x: 466, y: 322, w:  32, h:  22},
                    pl0: {x:   0, y: 136, w:  48, h:  88},
                    pl1: {x:  62, y: 136, w:  48, h:  88},
                    tl0: {x:   0, y: 322, w:  52, h:  52, bg: '#f0f'},
                    tl1: {x:  62, y: 322, w:  52, h:  52, bg: '#f00'},
                    tl2: {x: 124, y: 322, w:  52, h:  52, bg: '#ff0'},
                    tl3: {x: 186, y: 322, w:  52, h:  52, bg: '#0f0'},
                    tl4: {x: 248, y: 322, w:  52, h:  52, bg: '#0ff'},
                    tl5: {x: 310, y: 322, w:  52, h:  52, bg: '#00f'},
                    tl6: {x: 372, y: 322, w:  52, h:  52, bg: '#fff'},
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
                sprite.box(fb.cx, 0, 0, 224, 160, sprite.sheet.main, sprite.sheet.main.tile.dl);
                var fps = (1000 / tick.dt) | 0;
                sprite.txtL(
                    fb.cx, 16, 16, sprite.sheet.txt, 'Pg1'
                    + '\nfps:' + fps
                    + '\nq1:' + hero1.units.queue.length
                    + '\nq2:' + hero2.units.queue.length
                );
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
            if (undefined !== io.st.x0) {
                io._coords.call(this, e);
                io.st.up = true;
            }
        },
        _msOut: function(e) {
            if (undefined !== io.st.x0) {
                io.st.up = true;
            }
        },
        _tcDn: function(e) {
            e.preventDefault();
            e.stopPropagation();
            for (var i = 0; i < e.changedTouches.length; i++) {
                if (undefined === io.st._tc || e.changedTouches[i].identifier === io.st._tc) {
                    io.st._tc = e.changedTouches[i].identifier;
                    io._coords.call(this, e.changedTouches[i]);
                    io.st.x0 = io.st.x1;
                    io.st.y0 = io.st.y1;
                    io.st.dn = true;
                    break;
                }
            }
        },
        _tcMv: function(e) {
            e.preventDefault();
            e.stopPropagation();
            for (var i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === io.st._tc) {
                    io._coords.call(this, e.changedTouches[i]);
                    break;
                }
            }
        },
        _tcUp: function(e) {
            e.preventDefault();
            e.stopPropagation();
            for (var i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].identifier === io.st._tc) {
                    io.st._tc = undefined;
                    io._coords.call(this, e.changedTouches[i]);
                    io.st.up = true;
                }
            }
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
    FB._cv.addEventListener('touchstart', io._tcDn);
    FB._cv.addEventListener('touchmove', io._tcMv);
    FB._cv.addEventListener('touchend', io._tcUp);
    FB._cv.addEventListener('touchcancel', io._tcUp);

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
        var fb = fadeAnim._fb;
        var tile = sprite.sheet.txt.tile.fd;
        var x = -tile.w;
        var w;
        fb.cx.save();
        if (fadeAnim._in) {
            w = ((fb.cv.width + tile.w) * (1 - pct)) | 0
            fb.cx.translate(fb.cv.width, 0);
            fb.cx.scale(-1, 1);
            fb.cx.drawImage(
                sprite.sheet.txt.img,
                tile.x, tile.y, tile.w, tile.h,
                x + w, 0, tile.w, fb.cv.height
            );
            if (w > tile.w) {
                fb.cx.fillStyle = '#000';
                fb.cx.fillRect(0, 0, w - tile.w, fb.cv.height);
            }
        } else {
            w = ((fb.cv.width + tile.w) * pct) | 0
            fb.cx.drawImage(
                sprite.sheet.txt.img,
                tile.x, tile.y, tile.w, tile.h,
                x + w, 0, tile.w, fb.cv.height
            );
            if (w > tile.w) {
                fb.cx.fillStyle = '#000';
                fb.cx.fillRect(0, 0, w - tile.w, fb.cv.height);
            }
        }
        fb.cx.restore();
    }
    fadeAnim.rst = function(fb, fadeIn) {
        fadeAnim._fb = fb;
        fadeAnim._in = fadeIn;
    };

    function initScn() {
        scn.fb3.clr();
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
        scn.fb1.clr();
        scn.fb2.clr();
        fadeAnim.rst(scn.fb3, false);
        q.add(fadeAnim, 0, 1000);
    };

    function msg(dt) {
        var bgw = 12 * sprite.sheet.txt.txt.sp;
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
            msg._x - (bgw >> 1), msg._y, bgw, bgt.nw.h + bgt.cw.h + sprite.sheet.txt.txt.sp * 2,
            sprite.sheet.main, bgt
        );
        sprite.txtL(
            msg._fb.cx,
            msg._x - (6 * sprite.sheet.txt.txt.sp), msg._y + 16,
            sprite.sheet.txt, txt
        );
    }
    msg.show = function(txt, ts) {
        msg._txt = txt;
        q.del(msg);
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
                var tile = sprite.sheet.main.tile.bul;
                fb.cx.save();
                fb.cx.translate(x, y);
                if (0 < dx) {
                    fb.cx.scale(-1, 1);
                }
                fb.cx.drawImage(
                    sprite.sheet.main.img,
                    tile.x, tile.y, tile.w, tile.h,
                    -(tile.w >> 1), -(tile.h >> 1), tile.w, tile.h
                );
                fb.cx.restore();
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
            if (0 >= this.enemy.hp || this.enemy.immune) {
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
            this.x += this.dx;
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
        } else if (0 < h) {
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
        if (db.val) {
            sprite.txtC(this.fb2.cx, this.x, this.y, sprite.sheet.txt, '' + this.hp);
        }
    };
    Unit.prototype.rst = function(tile, icon, x, y, hp, coords) {
        this.tile = tile;
        this.icon = icon;
        this.x = x;
        this.x0 = x + prng(128);
        this.y0 = y;
        this.y = (this.y0 + 8 * Math.sin(Math.PI * (this.x - this.x0) / 64)) | 0;
        this.ts = tick.ts;
        this.hp = hp;
        this.enemy = undefined;
        this.immune = true;
        this.coords = coords;
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
                _hero.ts2 = tick.ts + 10;
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

        if (hero.maxUnits > teams[_hero.team].length && 0 < _hero.units.queue.length && tick.ts - _hero.units.ts > 500 && _hero.units.queue[0].ts + hero.unitDelay < tick.ts) {
            var unit = _hero.units.queue.shift();
            _hero.units.ts = tick.ts;
            unit.ts = tick.ts;
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
        hero.ended = false;
    };
    hero.maxUnits = 5;
    hero.maxUnitQueue = 9;
    hero.unitDelay = 800;

    function hero1() {
        hero(hero1);
        hero1.hud();
    }
    hero1.hud = function() {
        var sheet = sprite.sheet.main;
        var tile = sheet.tile.hud;
        hero1.fb2.cx.drawImage(
            sheet.img,
            tile.x, tile.y, tile.w, tile.h,
            0, 0, tile.w, tile.h
        );

        tile = sheet.tile.lb0;
        hero1.fb2.cx.drawImage(
            sheet.img,
            tile.x, tile.y, tile.w, tile.h,
            4, 4, tile.w, tile.h
        );

        var w1 = hero1.hp / hero1.mhp;
        tile = (w1 > 0.25) ? sheet.tile.br0 : sheet.tile.br1;
        w1 = (tile.w * w1) | 0;
        if (0 < w1) {
            hero1.fb2.cx.drawImage(
                sheet.img,
                tile.x, tile.y, w1, tile.h,
                43, 6, w1, tile.h
            );
        }

        for (var i = 0; i < hero1.units.queue.length; i++) {
            var qu = hero1.units.queue[i];
            if (qu.ts + hero.unitDelay > tick.ts) {
                var hy = hero1.y - (hero1.tile.y >> 1);
                var pct = (qu.ts + hero.unitDelay - tick.ts) / hero.unitDelay;
                for (var j = 0; j < qu.coords.length; j++) {
                    var coord = qu.coords[j];
                    hero1.fb2.cx.drawImage(
                        sheet.img,
                        sheet.tile.glw.x, sheet.tile.glw.y, sheet.tile.glw.w, sheet.tile.glw.h,
                        ((hero1.x + (coord.x - hero1.x) * pct) | 0) - (sheet.tile.glw.w >> 1),
                        ((hy + (coord.y - hy) * pct) | 0) - (sheet.tile.glw.h >> 1),
                        sheet.tile.glw.w, sheet.tile.glw.h
                    );
                }
            } else {
                hero1.fb2.cx.drawImage(
                    sheet.img,
                    qu.icon.x, qu.icon.y, qu.icon.w, qu.icon.h,
                    41 + i * 8, 14, qu.icon.w, qu.icon.h
                );
            }
        }
    };

    function hero2() {
        hero(hero2);
        if (undefined === winner && undefined !== hero2.deploy && tick.ts >= hero2.deploy) {
            hero2.sched();
            var cnt = prng(3);
            for (var i = 0; i <= cnt; i++) {
                if (hero.maxUnitQueue > hero2.units.queue.length && 0 < hero2.units.reserve.length) {
                    var unit = hero2.units.reserve.pop();
                    var type = hero2.unitTypes[prng(hero2.unitTypes.length)];
                    unit.rst(type.unit, type.icon, hero2.x, hero2.y, hero2.uhp, []);
                    unit.ts = 0;
                    hero2.units.queue.push(unit);
                }
            }
        }
        hero2.hud();
    }
    hero2.hud = function() {
        var sheet = sprite.sheet.main;
        var tile = sheet.tile.hud;
        hero2.fb2.cx.save();
        hero2.fb2.cx.scale(-1, 1);
        hero2.fb2.cx.drawImage(
            sheet.img,
            tile.x, tile.y, tile.w, tile.h,
            -hero2.fb2.cv.width, 0, tile.w, tile.h
        );
        hero2.fb2.cx.restore();

        tile = sheet.tile.lb1;
        hero2.fb2.cx.drawImage(
            sheet.img,
            tile.x, tile.y, tile.w, tile.h,
            hero2.fb2.cv.width - 4 - tile.w, 4, tile.w, tile.h
        );

        var w1 = hero2.hp / hero2.mhp;
        tile = (w1 > 0.25) ? sheet.tile.br0 : sheet.tile.br1;
        w1 = (tile.w * w1) | 0;
        if (0 < w1) {
            hero2.fb2.cx.drawImage(
                sheet.img,
                tile.x, tile.y, w1, tile.h,
                hero2.fb2.cv.width - 43 - w1, 6, w1, tile.h
            );
        }

        for (var i = 0; i < hero2.units.queue.length; i++) {
            tile = hero2.units.queue[i].icon;
            hero2.fb2.cx.drawImage(
                sheet.img,
                tile.x, tile.y, tile.w, tile.h,
                hero2.fb2.cv.width - 41 - tile.w - i * 8, 14, tile.w, tile.h
            );
        }
    };
    hero2.sched = function() {
        hero2.deploy = tick.ts + 2000 + prng(4000);
    };
    hero2.unitTypes = [
        {unit: sprite.sheet.main.tile.un0, icon: sprite.sheet.main.tile.dt0},
        {unit: sprite.sheet.main.tile.un1, icon: sprite.sheet.main.tile.dt1},
        {unit: sprite.sheet.main.tile.un2, icon: sprite.sheet.main.tile.dt2},
        {unit: sprite.sheet.main.tile.un3, icon: sprite.sheet.main.tile.dt3},
        {unit: sprite.sheet.main.tile.un4, icon: sprite.sheet.main.tile.dt4},
        {unit: sprite.sheet.main.tile.un5, icon: sprite.sheet.main.tile.dt5},
        {unit: sprite.sheet.main.tile.un6, icon: sprite.sheet.main.tile.dt6}
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
        {tile: sprite.sheet.main.tile.tl0, unit: sprite.sheet.main.tile.un0, icon: sprite.sheet.main.tile.dt0},
        {tile: sprite.sheet.main.tile.tl1, unit: sprite.sheet.main.tile.un1, icon: sprite.sheet.main.tile.dt1},
        {tile: sprite.sheet.main.tile.tl2, unit: sprite.sheet.main.tile.un2, icon: sprite.sheet.main.tile.dt2},
        {tile: sprite.sheet.main.tile.tl3, unit: sprite.sheet.main.tile.un3, icon: sprite.sheet.main.tile.dt3},
        {tile: sprite.sheet.main.tile.tl4, unit: sprite.sheet.main.tile.un4, icon: sprite.sheet.main.tile.dt4},
        {tile: sprite.sheet.main.tile.tl5, unit: sprite.sheet.main.tile.un5, icon: sprite.sheet.main.tile.dt5},
        {tile: sprite.sheet.main.tile.tl6, unit: sprite.sheet.main.tile.un6, icon: sprite.sheet.main.tile.dt6}
    ];
    Tile.near = [
        {c: -1, r: 0},
        {c: 1, r: 0},
        {c: 0, r: -1},
        {c: 0, r: 1},
    ];

    function grid() {
        if (0 === grid._st) {
            if (0 === grid._tiles[0][grid._r - 1].dx) {
                grid._st = 1;
                hero2.sched();
            }
        } else if (1 === grid._st) {
            if (undefined === winner) {
                grid.io();
            }
        } else if (2 === grid._st) {
            if (grid._fTiles[0].fts + Tile.ftd <= tick.ts) {
                grid._chk = grid.replace(grid._fTiles);
                grid._st = 3;
            }
        } else if (3 === grid._st) {
            grid.wait();
        } else if (4 === grid._st) {
            if (q.isDone(msg)) {
                grid.roll();
                grid._st = 0;
            }
        }
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
    grid.io = function() {
        if (io.st.dn) {
            grid.ondn();
        }
        if (undefined === io.st.x0 || undefined === grid._at) {
            return;
        }
        if (!io.st.up) {
            grid.onmv();
        } else {
            var tiles = grid.onup();
            if (0 >= tiles.length) {
                return;
            }
            for (var i = 0; i < tiles.length; i++) {
                tiles[i].fts = tick.ts;
            }
            grid._fTiles = tiles;
            grid._st = 2;
        }
    };
    grid.wait = function() {
        for (var r = 0; r < grid._r; r++) {
            if (undefined === grid._chk[r]) {
                continue;
            }
            if (0 !== grid._tiles[0][r].dx) {
                return;
            }
        }
        var chain = [];
        for (r = 0; r < grid._r; r++) {
            if (undefined === grid._chk[r]) {
                continue;
            }
            for (var c = grid._chk[r]; c >= 0; c--) {
                tiles = grid.cnt(grid._tiles[c][r]);
                if (3 <= tiles.length) {
                    chain = chain.concat(tiles);
                    if (hero.maxUnitQueue > hero1.units.queue.length && 0 < hero1.units.reserve.length) {
                        var coords = [];
                        for (var i = 0; i < tiles.length; i++) {
                            coords.push({x: tiles[i]._x + (Tile.dim >> 1), y: tiles[i]._y + (Tile.dim >> 1)});
                        }
                        var unit = hero1.units.reserve.pop();
                        unit.rst(tiles[0]._type.unit, tiles[0]._type.icon, hero1.x, hero1.y, hero1.uhp * (tiles.length - 2), coords);
                        hero1.units.queue.push(unit);
                    }
                }
            }
        }
        if (0 < chain.length) {
            for (var i = 0; i < chain.length; i++) {
                chain[i].fts = tick.ts;
            }
            grid._fTiles = chain;
            grid._st = 2;
        } else if (grid.hasMove()) {
            grid._st = 1;
        } else {
            msg.show(lang.noMoves, 0);
            grid._st = 4;
        }
    };
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
                    if (hero.maxUnitQueue > hero1.units.queue.length && 0 < hero1.units.reserve.length) {
                        var coords = [];
                        for (var i = 0; i < tiles.length; i++) {
                            coords.push({x: tiles[i]._x + (Tile.dim >> 1), y: tiles[i]._y + (Tile.dim >> 1)});
                        }
                        var unit = hero1.units.reserve.pop();
                        unit.rst(tiles[0]._type.unit, tiles[0]._type.icon, hero1.x, hero1.y, hero1.uhp * (tiles.length - 2), coords);
                        hero1.units.queue.push(unit);
                    }
                }
                tiles = grid.cnt(tile);
                if (3 <= tiles.length) {
                    result = result.concat(tiles);
                    if (hero.maxUnitQueue > hero1.units.queue.length && 0 < hero1.units.reserve.length) {
                        var coords = [];
                        for (var i = 0; i < tiles.length; i++) {
                            coords.push({x: tiles[i]._x + (Tile.dim >> 1), y: tiles[i]._y + (Tile.dim >> 1)});
                        }
                        var unit = hero1.units.reserve.pop();
                        unit.rst(tiles[0]._type.unit, tiles[0]._type.icon, hero1.x, hero1.y, hero1.uhp * (tiles.length - 2), coords);
                        hero1.units.queue.push(unit);
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
        grid._zt = undefined;
        grid._st = 0;
        grid.roll();
    };

    function gameScn() {
        scn.fb2.clr();
        scn.fb3.clr();
        if (0 === gameScn._st) {
            if (q.isDone(fadeAnim)) {
                gameScn._st = 1;
            }
        } else if (1 === gameScn._st) {
            if (undefined !== winner) {
                gameScn._st = 2;
            }
        } else if (2 === gameScn._st) {
            if (q.isDone(msg)) {
                fadeAnim.rst(scn.fb3, false);
                q.add(fadeAnim, 0, 1000);
                gameScn._st = 3;
            }
        } else if (3 === gameScn._st) {
            if (q.isDone(fadeAnim)) {
                scn.run = exitScn;
                scn.run.rst();
                scn.run();
                return;
            }
        }
        hero1();
        hero2();
        if (0 !== gameScn._st) {
            grid();
        }
    }
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
        fadeAnim.rst(scn.fb3, true);
        q.add(fadeAnim, 0, 1000);
        msg.rst(scn.fb3, scn.fb2.cv.width >> 1, ((scn.fb2.cv.height) >> 1) - sprite.sheet.txt.txt.lh);
        hero.rst(
            hero1, 0,
            scn.fb2, scn.fb3, sprite.sheet.main.tile.pl0,
            32, sprite.sheet.main.tile.bg0.h, 5000, 30,
            [
                new Unit(0, scn.fb2, scn.fb3, 1),
                new Unit(0, scn.fb2, scn.fb3, 1),
                new Unit(0, scn.fb2, scn.fb3, 1),
                new Unit(0, scn.fb2, scn.fb3, 1),
                new Unit(0, scn.fb2, scn.fb3, 1),
                new Unit(0, scn.fb2, scn.fb3, 1),
                new Unit(0, scn.fb2, scn.fb3, 1),
                new Unit(0, scn.fb2, scn.fb3, 1),
                new Unit(0, scn.fb2, scn.fb3, 1),
                new Unit(0, scn.fb2, scn.fb3, 1),
                new Unit(0, scn.fb2, scn.fb3, 1),
                new Unit(0, scn.fb2, scn.fb3, 1),
                new Unit(0, scn.fb2, scn.fb3, 1)
            ]
        );
        hero.rst(
            hero2, 1,
            scn.fb2, scn.fb3, sprite.sheet.main.tile.pl1,
            scn.fb2.cv.width - 32, sprite.sheet.main.tile.bg0.h, 5000, 20,
            [
                new Unit(1, scn.fb2, scn.fb3, -1),
                new Unit(1, scn.fb2, scn.fb3, -1),
                new Unit(1, scn.fb2, scn.fb3, -1),
                new Unit(1, scn.fb2, scn.fb3, -1),
                new Unit(1, scn.fb2, scn.fb3, -1),
                new Unit(1, scn.fb2, scn.fb3, -1),
                new Unit(1, scn.fb2, scn.fb3, -1),
                new Unit(1, scn.fb2, scn.fb3, -1),
                new Unit(1, scn.fb2, scn.fb3, -1),
                new Unit(1, scn.fb2, scn.fb3, -1),
                new Unit(1, scn.fb2, scn.fb3, -1),
                new Unit(1, scn.fb2, scn.fb3, -1),
                new Unit(1, scn.fb2, scn.fb3, -1)
            ]
        );
        hero2.deploy = undefined;
        grid.rst(scn.fb2, 13, sprite.sheet.main.tile.bg0.h + 9, 9, 5);
        winner = undefined;
        teams = [[hero1], [hero2]];
        gameScn._st = 0;
    };

    function exitScn() {
        scn.fb3.clr();
        if (0 >= q.size) {
            scn.run = undefined;
        }
    }
    exitScn.rst = function() {
        q.rst();
        FB.rel(false);
        FB.bg(false);
        scn.fb1.clr();
        scn.fb2.clr();
        fadeAnim.rst(scn.fb3, true);
        q.add(fadeAnim, 0, 1000);
    };

    window.document.addEventListener('DOMContentLoaded', function() {
        if (init.dom) {
            return;
        }
        init.dom = true;
        init();
    });

    window.document.addEventListener('mousedown', function() {
        if (undefined === scn.run) {
            scn.run = initScn;
            init();
        }
    });
    window.document.addEventListener('touchstart', function() {
        if (undefined === scn.run) {
            scn.run = initScn;
            init();
        }
    });
})();
