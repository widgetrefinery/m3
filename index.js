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
    };

    var sprite = {
        anim: 0.01, // animation frame rate
        txtL: function(cx, x, y, txt) {
            var x0 = x;
            for (var i = 0; i < txt.length; i++) {
                if ('\n' === txt[i]) {
                    x = x0;
                    y += 57;
                    continue;
                }
                var id = txt.charCodeAt(i);
                var tile = sprite.sheet.txt.tile[id];
                if (!tile) {
                    var err = 'unsupported char:' + txt[i] + ' txt:' + txt;
                    console.log(err);
                    throw new Exception(err);
                }
                if (0 < tile.w && 0 < tile.h) {
                    cx.drawImage(
                        sprite.sheet.txt.img,
                        tile.x, tile.y, tile.w, tile.h,
                        x + tile.dx, y, tile.w, tile.h
                    );
                }
                x += tile.dw;
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
                init.wait--;
                init();
            });
            sheet.img.src = src;
        },
        sheet: {
            main: {
                tile: {
                }
            },
            txt: {
                tile: {
                }
            }
        }
    };

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
            if (io.kb[1] === io.st.raw) {
                scn.fb1.cv.style.display = 'none' === scn.fb1.cv.style.display ? 'block' : 'none';
            } else if (io.kb[2] === io.st.raw) {
                scn.fb2.cv.style.display = 'none' === scn.fb2.cv.style.display ? 'block' : 'none';
            } else if (io.kb[0] === io.st.raw || io.kb[9] === io.st.raw) {
                db._con = 1 - db._con;
            }
            if (1 === db._con) {
                var fps = (1000 / tick.dt) | 0;
                sprite.txtL(fb.cx, 0, 0, "" + fps);
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
        _con: 0
    };

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
        this._dcv = db.cv(256, 256);
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
    FB.w = 640;
    FB.h = 480;
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
            9: 57
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
        db.con(scn.fb2);
        FB.flush();
        io.rst(false);
        requestAnimationFrame(scn);
    }
    scn.fb1 = new FB();
    scn.fb2 = new FB();

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
    Tile.prototype.draw = function(fb, dim) {
        fb.cx.fillStyle = this._type;
        fb.cx.fillRect(this._x + this.dx, this._y + this.dy, dim, dim);
        if (Tile.spd < this.dx) {
            this.dx -= Tile.spd;
        } else if (-Tile.spd > this.dx) {
            this.dx += Tile.spd;
        } else {
            this.dx = 0;
        }
        if (Tile.spd < this.dy) {
            this.dy -= Tile.spd;
        } else if (-Tile.spd > this.dy) {
            this.dy += Tile.spd;
        } else {
            this.dy = 0;
        }
    };
    Tile.swp = function(t0, t1) {
        var t = t0._type;
        t0._type = t1._type;
        t1._type = t;
        t0.dx = 0;
        t0.dy = 0;
        t1.dx = 0;
        t1.dy = 0;
    }
    Tile.spd = 10;
    Tile.types = ['#f00', '#ff0', '#0f0', '#0ff'];
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
                if (tile === grid._at) {
                    continue;
                }
                tile.draw(grid._fb, grid._dim);
            }
        }
        if (undefined !== grid._at) {
            grid._at.draw(grid._fb, grid._dim);
        }
    }
    grid._roll = function() {
        for (var c = 0; c < grid._c; c++) {
            var t = c % Tile.types.length;
            for (var r = 0; r < grid._r; r++) {
                grid._tiles[c][r]._type = Tile.types[t];
                t = (t + 1) % Tile.types.length;
            }
        }
        for (var i = 0; i < 400; i++) {
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
                Tile.swp(grid._tiles[c0][r0], grid._tiles[c1][r1]);
                var tiles = grid._cnt(c0, r0, c1, r1);
                if (3 <= tiles[0].length || 3 <= tiles[1].length) {
                    Tile.swp(grid._tiles[c0][r0], grid._tiles[c1][r1]);
                    continue;
                }
                break;
            }
        }
    };
    grid._cnt = function(c0, r0, c1, r1) {
        var tiles = [[], []];
        var unproc = [grid._tiles[c0][r0], grid._tiles[c1][r1]];
        var proc = [];
        proc[grid._tiles[c0][r0]._id] = 1;
        proc[grid._tiles[c1][r1]._id] = 1;
        while (0 < unproc.length) {
            var tile = unproc.shift();
            if (tile._type === grid._tiles[c0][r0]._type) {
                tiles[0].push(tile);
            } else if (tile._type === grid._tiles[c1][r1]._type) {
                tiles[1].push(tile);
            } else {
                continue;
            }
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
    grid.ondn = function() {
        if (io.st.x0 < grid._x
            || io.st.x0 >= grid._x + grid._w
            || io.st.y0 < grid.y
            || io.st.y0 >= grid._y + grid._h) {
            return;
        }
        var c = ((io.st.x0 - grid._x) / grid._dim) | 0;
        var r = ((io.st.y0 - grid._y) / grid._dim) | 0;
        grid._at = grid._tiles[c][r];
        db.log('grabbed ' + c + ', ' + r);
    };
    grid.onmv = function() {
        var dx = io.st.x1 - io.st.x0;
        var dy = io.st.y1 - io.st.y0;
        if (Math.abs(dx) >= Math.abs(dy)) {
            if (dx > grid._dim) {
                dx = grid._dim;
            } else if (dx < -grid._dim) {
                dx = -grid._dim;
            }
            if (0 < dx && grid._at._c + 1 >= grid._c) {
                dx = 0;
            } else if (0 > dx && grid._at._c <= 0) {
                dx = 0;
            }
            grid._at.dx = dx;
            grid._at.dy = 0;
            if (0 < dx) {
                grid._tiles[grid._at._c + 1][grid._at._r].dx = -dx;
            } else if (0 > dx) {
                grid._tiles[grid._at._c - 1][grid._at._r].dx = -dx;
            }
        } else {
            if (dy > grid._dim) {
                dy = grid._dim;
            } else if (dy < -grid._dim) {
                dy = -grid._dim;
            }
            if (0 < dy && grid._at._r + 1 >= grid._r) {
                dy = 0;
            } else if (0 > dy && grid._at._r <= 0) {
                dy = 0;
            }
            grid._at.dx = 0;
            grid._at.dy = dy;
            if (0 < dy) {
                grid._tiles[grid._at._c][grid._at._r + 1].dy = -dy;
            } else if (0 > dy) {
                grid._tiles[grid._at._c][grid._at._r - 1].dy = -dy;
            }
        }
    };
    grid.onup = function() {
        if (undefined !== grid._at) {
            var test = (grid._dim >> 1) - Tile.spd;
            if (test <= grid._at.dx) {
                Tile.swp(grid._at, grid._tiles[grid._at._c + 1][grid._at._r]);
            } else if (-test >= grid._at.dx) {
                Tile.swp(grid._at, grid._tiles[grid._at._c - 1][grid._at._r]);
            } else if (test <= grid._at.dy) {
                Tile.swp(grid._at, grid._tiles[grid._at._c][grid._at._r + 1]);
            } else if (-test >= grid._at.dy) {
                Tile.swp(grid._at, grid._tiles[grid._at._c][grid._at._r - 1]);
            }
        }
        grid._at = undefined;
    };
    grid.rst = function(fb, x, y, c, r) {
        grid._dim = 64;
        grid._fb = fb;
        grid._x = x;
        grid._y = y;
        grid._c = c;
        grid._r = r;
        grid._w = c * grid._dim;
        grid._h = r * grid._dim;
        grid._tiles = new Array(grid._c);
        for (c = 0; c < grid._c; c++) {
            grid._tiles[c] = new Array(grid._r);
            for (r = 0; r < grid._r; r++) {
                grid._tiles[c][r] = new Tile(grid._x + c * grid._dim, grid._y + r * grid._dim, c, r, Tile.types[0]);
            }
        }
        grid._at = undefined;
        grid._roll();
    };

    function gameScn() {
        scn.fb1.clr();
        scn.fb2.clr();
        scn.fb1.cx.fillStyle = '#333';
        scn.fb1.cx.fillRect(0, 0, scn.fb1.cv.width, scn.fb1.cv.height);
        if (io.st.dn) {
            grid.ondn();
        } else if (undefined !== io.st.x0 && undefined !== grid._at) {
            if (io.st.up) {
                grid.onup();
            } else {
                grid.onmv();
            }
        }
        grid();
    }
    gameScn.rst = function() {
        q.rst();
        FB.rel(true);
        FB.bg(true);
        grid.rst(scn.fb1, 10, 10, 8, 6);
    };

    window.document.addEventListener('DOMContentLoaded', function() {
        if (init.dom) {
            return;
        }
        init.dom = true;
        init();
    });
})();
