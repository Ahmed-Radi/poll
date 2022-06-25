
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\Header.svelte generated by Svelte v3.46.4 */

    const file$8 = "src\\components\\Header.svelte";

    function create_fragment$8(ctx) {
    	let header;
    	let h1;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			header = element("header");
    			h1 = element("h1");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "/img/poll_ninja_logo.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			attr_dev(img, "class", "svelte-19mdr99");
    			add_location(img, file$8, 2, 8, 28);
    			attr_dev(h1, "class", "svelte-19mdr99");
    			add_location(h1, file$8, 1, 4, 14);
    			attr_dev(header, "class", "svelte-19mdr99");
    			add_location(header, file$8, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			append_dev(h1, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\components\Footer.svelte generated by Svelte v3.46.4 */

    const file$7 = "src\\components\\Footer.svelte";

    function create_fragment$7(ctx) {
    	let footer;
    	let div;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			div = element("div");
    			div.textContent = "Copyright © 2022";
    			attr_dev(div, "class", "copyright svelte-1ioxxtp");
    			add_location(div, file$7, 1, 4, 14);
    			attr_dev(footer, "class", "svelte-1ioxxtp");
    			add_location(footer, file$7, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Footer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const pollStore = writable([{
        id: 1,
        question: 'Ahmed Radi',
        answerA: 'N',
        answerB: 'Y',
        votesA: 10,
        votesB: 1,
    }]);

    /* src\shared\Button.svelte generated by Svelte v3.46.4 */

    const file$6 = "src\\shared\\Button.svelte";

    function create_fragment$6(ctx) {
    	let button;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*type*/ ctx[0]) + " svelte-10jd51j"));
    			toggle_class(button, "flat", /*flat*/ ctx[1]);
    			toggle_class(button, "inverse", /*inverse*/ ctx[2]);
    			add_location(button, file$6, 5, 0, 118);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*type*/ 1 && button_class_value !== (button_class_value = "" + (null_to_empty(/*type*/ ctx[0]) + " svelte-10jd51j"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*type, flat*/ 3) {
    				toggle_class(button, "flat", /*flat*/ ctx[1]);
    			}

    			if (dirty & /*type, inverse*/ 5) {
    				toggle_class(button, "inverse", /*inverse*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { type = "primary" } = $$props;
    	let { flat = false } = $$props;
    	let { inverse = false } = $$props;
    	const writable_props = ['type', 'flat', 'inverse'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('flat' in $$props) $$invalidate(1, flat = $$props.flat);
    		if ('inverse' in $$props) $$invalidate(2, inverse = $$props.inverse);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ type, flat, inverse });

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(0, type = $$props.type);
    		if ('flat' in $$props) $$invalidate(1, flat = $$props.flat);
    		if ('inverse' in $$props) $$invalidate(2, inverse = $$props.inverse);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [type, flat, inverse, $$scope, slots, click_handler];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { type: 0, flat: 1, inverse: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flat() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flat(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inverse() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inverse(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\CreatePollForm.svelte generated by Svelte v3.46.4 */
    const file$5 = "src\\components\\CreatePollForm.svelte";

    // (59:4) <Button type="secondry" flat={true}>
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Add poll");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(59:4) <Button type=\\\"secondry\\\" flat={true}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let form;
    	let div1;
    	let label0;
    	let t1;
    	let input0;
    	let t2;
    	let div0;
    	let t3_value = /*errors*/ ctx[1].question + "";
    	let t3;
    	let t4;
    	let div3;
    	let label1;
    	let t6;
    	let input1;
    	let t7;
    	let div2;
    	let t8_value = /*errors*/ ctx[1].answerA + "";
    	let t8;
    	let t9;
    	let div5;
    	let label2;
    	let t11;
    	let input2;
    	let t12;
    	let div4;
    	let t13_value = /*errors*/ ctx[1].answerB + "";
    	let t13;
    	let t14;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				type: "secondry",
    				flat: true,
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			form = element("form");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Question";
    			t1 = space();
    			input0 = element("input");
    			t2 = space();
    			div0 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			div3 = element("div");
    			label1 = element("label");
    			label1.textContent = "Answer A:";
    			t6 = space();
    			input1 = element("input");
    			t7 = space();
    			div2 = element("div");
    			t8 = text(t8_value);
    			t9 = space();
    			div5 = element("div");
    			label2 = element("label");
    			label2.textContent = "Anwser B:";
    			t11 = space();
    			input2 = element("input");
    			t12 = space();
    			div4 = element("div");
    			t13 = text(t13_value);
    			t14 = space();
    			create_component(button.$$.fragment);
    			attr_dev(label0, "for", "question");
    			attr_dev(label0, "class", "svelte-1vr0g57");
    			add_location(label0, file$5, 44, 8, 1393);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "question");
    			attr_dev(input0, "placeholder", "Question");
    			attr_dev(input0, "class", "svelte-1vr0g57");
    			add_location(input0, file$5, 45, 8, 1441);
    			attr_dev(div0, "class", "error svelte-1vr0g57");
    			add_location(div0, file$5, 46, 8, 1537);
    			attr_dev(div1, "class", "form-fild svelte-1vr0g57");
    			add_location(div1, file$5, 43, 4, 1360);
    			attr_dev(label1, "for", "answer-a");
    			attr_dev(label1, "class", "svelte-1vr0g57");
    			add_location(label1, file$5, 49, 8, 1630);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "answer-a");
    			attr_dev(input1, "placeholder", "Answer A");
    			attr_dev(input1, "class", "svelte-1vr0g57");
    			add_location(input1, file$5, 50, 8, 1679);
    			attr_dev(div2, "class", "error svelte-1vr0g57");
    			add_location(div2, file$5, 51, 8, 1774);
    			attr_dev(div3, "class", "form-fild svelte-1vr0g57");
    			add_location(div3, file$5, 48, 4, 1597);
    			attr_dev(label2, "for", "anwser-b");
    			attr_dev(label2, "class", "svelte-1vr0g57");
    			add_location(label2, file$5, 54, 8, 1866);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "id", "anwser-b");
    			attr_dev(input2, "placeholder", "Answer B");
    			attr_dev(input2, "class", "svelte-1vr0g57");
    			add_location(input2, file$5, 55, 8, 1915);
    			attr_dev(div4, "class", "error svelte-1vr0g57");
    			add_location(div4, file$5, 56, 8, 2010);
    			attr_dev(div5, "class", "form-fild svelte-1vr0g57");
    			add_location(div5, file$5, 53, 4, 1833);
    			attr_dev(form, "class", "svelte-1vr0g57");
    			add_location(form, file$5, 42, 0, 1307);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*filds*/ ctx[0].question);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, t3);
    			append_dev(form, t4);
    			append_dev(form, div3);
    			append_dev(div3, label1);
    			append_dev(div3, t6);
    			append_dev(div3, input1);
    			set_input_value(input1, /*filds*/ ctx[0].answerA);
    			append_dev(div3, t7);
    			append_dev(div3, div2);
    			append_dev(div2, t8);
    			append_dev(form, t9);
    			append_dev(form, div5);
    			append_dev(div5, label2);
    			append_dev(div5, t11);
    			append_dev(div5, input2);
    			set_input_value(input2, /*filds*/ ctx[0].answerB);
    			append_dev(div5, t12);
    			append_dev(div5, div4);
    			append_dev(div4, t13);
    			append_dev(form, t14);
    			mount_component(button, form, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[3]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[4]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[5]),
    					listen_dev(form, "submit", prevent_default(/*submitHandler*/ ctx[2]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*filds*/ 1 && input0.value !== /*filds*/ ctx[0].question) {
    				set_input_value(input0, /*filds*/ ctx[0].question);
    			}

    			if ((!current || dirty & /*errors*/ 2) && t3_value !== (t3_value = /*errors*/ ctx[1].question + "")) set_data_dev(t3, t3_value);

    			if (dirty & /*filds*/ 1 && input1.value !== /*filds*/ ctx[0].answerA) {
    				set_input_value(input1, /*filds*/ ctx[0].answerA);
    			}

    			if ((!current || dirty & /*errors*/ 2) && t8_value !== (t8_value = /*errors*/ ctx[1].answerA + "")) set_data_dev(t8, t8_value);

    			if (dirty & /*filds*/ 1 && input2.value !== /*filds*/ ctx[0].answerB) {
    				set_input_value(input2, /*filds*/ ctx[0].answerB);
    			}

    			if ((!current || dirty & /*errors*/ 2) && t13_value !== (t13_value = /*errors*/ ctx[1].answerB + "")) set_data_dev(t13, t13_value);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CreatePollForm', slots, []);
    	let dispatch = createEventDispatcher();
    	let filds = { question: '', answerA: '', answerB: '' };
    	let errors = { question: '', answerA: '', answerB: '' };
    	let valid = false;

    	const submitHandler = () => {
    		valid = true;

    		if (filds.question.trim().length < 5) {
    			valid = false;
    			$$invalidate(1, errors.question = 'Question must be at least 5 characters longs', errors);
    		} else {
    			$$invalidate(1, errors.question = '', errors);
    		}

    		if (filds.answerA.trim().length < 1) {
    			valid = false;
    			$$invalidate(1, errors.answerA = "Answer A can't be empty", errors);
    		} else {
    			$$invalidate(1, errors.answerA = '', errors);
    		}

    		if (filds.answerB.trim().length < 1) {
    			valid = false;
    			$$invalidate(1, errors.answerB = "Answer B can't be empty", errors);
    		} else {
    			$$invalidate(1, errors.answerB = '', errors);
    		}

    		// add poll
    		if (valid) {
    			let poll = {
    				...filds,
    				votesA: 0,
    				votesB: 0,
    				id: Math.random()
    			};

    			pollStore.update(currentPolls => {
    				return [poll, ...currentPolls];
    			});

    			dispatch('addPoll');
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CreatePollForm> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		filds.question = this.value;
    		$$invalidate(0, filds);
    	}

    	function input1_input_handler() {
    		filds.answerA = this.value;
    		$$invalidate(0, filds);
    	}

    	function input2_input_handler() {
    		filds.answerB = this.value;
    		$$invalidate(0, filds);
    	}

    	$$self.$capture_state = () => ({
    		PollStore: pollStore,
    		createEventDispatcher,
    		dispatch,
    		Button,
    		filds,
    		errors,
    		valid,
    		submitHandler
    	});

    	$$self.$inject_state = $$props => {
    		if ('dispatch' in $$props) dispatch = $$props.dispatch;
    		if ('filds' in $$props) $$invalidate(0, filds = $$props.filds);
    		if ('errors' in $$props) $$invalidate(1, errors = $$props.errors);
    		if ('valid' in $$props) valid = $$props.valid;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		filds,
    		errors,
    		submitHandler,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler
    	];
    }

    class CreatePollForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CreatePollForm",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    /* src\shared\Card.svelte generated by Svelte v3.46.4 */

    const file$4 = "src\\shared\\Card.svelte";

    function create_fragment$4(ctx) {
    	let section;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			section = element("section");
    			if (default_slot) default_slot.c();
    			attr_dev(section, "class", "card svelte-cdnta8");
    			add_location(section, file$4, 2, 0, 21);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);

    			if (default_slot) {
    				default_slot.m(section, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[0],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[0])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[0], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Card', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Card> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	return [$$scope, slots];
    }

    class Card extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Card",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* src\components\pollDetails.svelte generated by Svelte v3.46.4 */
    const file$3 = "src\\components\\pollDetails.svelte";

    // (49:12) <Button flat="true" on:click={() => handleDeletePoll(poll.id)}>
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Delete");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(49:12) <Button flat=\\\"true\\\" on:click={() => handleDeletePoll(poll.id)}>",
    		ctx
    	});

    	return block;
    }

    // (36:0) <Card>
    function create_default_slot(ctx) {
    	let section;
    	let h3;
    	let t0_value = /*poll*/ ctx[0].question + "";
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let t4;
    	let div1;
    	let div0;
    	let t5;
    	let span0;
    	let t6_value = /*poll*/ ctx[0].answerA + "";
    	let t6;
    	let t7;
    	let t8_value = /*poll*/ ctx[0].votesA + "";
    	let t8;
    	let t9;
    	let t10;
    	let div3;
    	let div2;
    	let t11;
    	let span1;
    	let t12_value = /*poll*/ ctx[0].answerB + "";
    	let t12;
    	let t13;
    	let t14_value = /*poll*/ ctx[0].votesB + "";
    	let t14;
    	let t15;
    	let t16;
    	let div4;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	button = new Button({
    			props: {
    				flat: "true",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_2*/ ctx[12]);

    	const block = {
    		c: function create() {
    			section = element("section");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			p = element("p");
    			t2 = text("Total votes: ");
    			t3 = text(/*totalVotes*/ ctx[1]);
    			t4 = space();
    			div1 = element("div");
    			div0 = element("div");
    			t5 = space();
    			span0 = element("span");
    			t6 = text(t6_value);
    			t7 = text(" (");
    			t8 = text(t8_value);
    			t9 = text(")");
    			t10 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t11 = space();
    			span1 = element("span");
    			t12 = text(t12_value);
    			t13 = text(" (");
    			t14 = text(t14_value);
    			t15 = text(")");
    			t16 = space();
    			div4 = element("div");
    			create_component(button.$$.fragment);
    			attr_dev(h3, "class", "header svelte-k1o3r3");
    			add_location(h3, file$3, 37, 8, 1104);
    			attr_dev(p, "class", "total-votes svelte-k1o3r3");
    			add_location(p, file$3, 38, 8, 1153);
    			attr_dev(div0, "class", "precent precent-a svelte-k1o3r3");
    			set_style(div0, "width", /*$tweenedA*/ ctx[2] + "%");
    			add_location(div0, file$3, 40, 12, 1291);
    			attr_dev(span0, "class", "vote-number svelte-k1o3r3");
    			add_location(span0, file$3, 41, 12, 1370);
    			attr_dev(div1, "class", "answer svelte-k1o3r3");
    			add_location(div1, file$3, 39, 8, 1215);
    			attr_dev(div2, "class", "precent precent-b svelte-k1o3r3");
    			set_style(div2, "width", /*$tweenedB*/ ctx[3] + "%");
    			add_location(div2, file$3, 44, 12, 1535);
    			attr_dev(span1, "class", "vote-number svelte-k1o3r3");
    			add_location(span1, file$3, 45, 12, 1614);
    			attr_dev(div3, "class", "answer svelte-k1o3r3");
    			add_location(div3, file$3, 43, 8, 1459);
    			attr_dev(div4, "class", "delete svelte-k1o3r3");
    			add_location(div4, file$3, 47, 8, 1703);
    			add_location(section, file$3, 36, 4, 1085);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h3);
    			append_dev(h3, t0);
    			append_dev(section, t1);
    			append_dev(section, p);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(section, t4);
    			append_dev(section, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t5);
    			append_dev(div1, span0);
    			append_dev(span0, t6);
    			append_dev(span0, t7);
    			append_dev(span0, t8);
    			append_dev(span0, t9);
    			append_dev(section, t10);
    			append_dev(section, div3);
    			append_dev(div3, div2);
    			append_dev(div3, t11);
    			append_dev(div3, span1);
    			append_dev(span1, t12);
    			append_dev(span1, t13);
    			append_dev(span1, t14);
    			append_dev(span1, t15);
    			append_dev(section, t16);
    			append_dev(section, div4);
    			mount_component(button, div4, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", /*click_handler*/ ctx[10], false, false, false),
    					listen_dev(div3, "click", /*click_handler_1*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*poll*/ 1) && t0_value !== (t0_value = /*poll*/ ctx[0].question + "")) set_data_dev(t0, t0_value);
    			if (!current || dirty & /*totalVotes*/ 2) set_data_dev(t3, /*totalVotes*/ ctx[1]);

    			if (!current || dirty & /*$tweenedA*/ 4) {
    				set_style(div0, "width", /*$tweenedA*/ ctx[2] + "%");
    			}

    			if ((!current || dirty & /*poll*/ 1) && t6_value !== (t6_value = /*poll*/ ctx[0].answerA + "")) set_data_dev(t6, t6_value);
    			if ((!current || dirty & /*poll*/ 1) && t8_value !== (t8_value = /*poll*/ ctx[0].votesA + "")) set_data_dev(t8, t8_value);

    			if (!current || dirty & /*$tweenedB*/ 8) {
    				set_style(div2, "width", /*$tweenedB*/ ctx[3] + "%");
    			}

    			if ((!current || dirty & /*poll*/ 1) && t12_value !== (t12_value = /*poll*/ ctx[0].answerB + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty & /*poll*/ 1) && t14_value !== (t14_value = /*poll*/ ctx[0].votesB + "")) set_data_dev(t14, t14_value);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(36:0) <Card>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let card;
    	let current;

    	card = new Card({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(card.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(card, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const card_changes = {};

    			if (dirty & /*$$scope, poll, $tweenedB, $tweenedA, totalVotes*/ 8207) {
    				card_changes.$$scope = { dirty, ctx };
    			}

    			card.$set(card_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(card.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(card.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(card, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let totalVotes;
    	let precentA;
    	let precentB;
    	let $tweenedA;
    	let $tweenedB;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PollDetails', slots, []);
    	let { poll } = $$props;

    	// tweened precentages
    	const tweenedA = tweened(0);

    	validate_store(tweenedA, 'tweenedA');
    	component_subscribe($$self, tweenedA, value => $$invalidate(2, $tweenedA = value));
    	const tweenedB = tweened(0);
    	validate_store(tweenedB, 'tweenedB');
    	component_subscribe($$self, tweenedB, value => $$invalidate(3, $tweenedB = value));

    	const handleVote = (option, id) => {
    		pollStore.update(currentPolls => {
    			let pollsCopy = [...currentPolls];
    			let upVoted = pollsCopy.find(poll => poll.id === id);
    			option === 'a' ? upVoted.votesA++ : upVoted.votesB++;
    			return pollsCopy;
    		});
    	};

    	const handleDeletePoll = id => {
    		pollStore.update(currentPolls => {
    			return currentPolls.filter(poll => poll.id !== id);
    		});
    	};

    	const writable_props = ['poll'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PollDetails> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => handleVote('a', poll.id);
    	const click_handler_1 = () => handleVote('b', poll.id);
    	const click_handler_2 = () => handleDeletePoll(poll.id);

    	$$self.$$set = $$props => {
    		if ('poll' in $$props) $$invalidate(0, poll = $$props.poll);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		Card,
    		pollStore,
    		tweened,
    		poll,
    		tweenedA,
    		tweenedB,
    		handleVote,
    		handleDeletePoll,
    		precentB,
    		precentA,
    		totalVotes,
    		$tweenedA,
    		$tweenedB
    	});

    	$$self.$inject_state = $$props => {
    		if ('poll' in $$props) $$invalidate(0, poll = $$props.poll);
    		if ('precentB' in $$props) $$invalidate(8, precentB = $$props.precentB);
    		if ('precentA' in $$props) $$invalidate(9, precentA = $$props.precentA);
    		if ('totalVotes' in $$props) $$invalidate(1, totalVotes = $$props.totalVotes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*poll*/ 1) {
    			$$invalidate(1, totalVotes = poll.votesA + poll.votesB);
    		}

    		if ($$self.$$.dirty & /*totalVotes, poll*/ 3) {
    			$$invalidate(9, precentA = Math.floor(100 / totalVotes * poll.votesA) || 0);
    		}

    		if ($$self.$$.dirty & /*totalVotes, poll*/ 3) {
    			$$invalidate(8, precentB = Math.floor(100 / totalVotes * poll.votesB) || 0);
    		}

    		if ($$self.$$.dirty & /*precentA*/ 512) {
    			tweenedA.set(precentA);
    		}

    		if ($$self.$$.dirty & /*precentB*/ 256) {
    			tweenedB.set(precentB);
    		}
    	};

    	return [
    		poll,
    		totalVotes,
    		$tweenedA,
    		$tweenedB,
    		tweenedA,
    		tweenedB,
    		handleVote,
    		handleDeletePoll,
    		precentB,
    		precentA,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class PollDetails extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { poll: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PollDetails",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*poll*/ ctx[0] === undefined && !('poll' in props)) {
    			console.warn("<PollDetails> was created without expected prop 'poll'");
    		}
    	}

    	get poll() {
    		throw new Error("<PollDetails>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set poll(value) {
    		throw new Error("<PollDetails>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\PollsList.svelte generated by Svelte v3.46.4 */
    const file$2 = "src\\components\\PollsList.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (21:4) {#each $PollStore as poll (poll.id)}
    function create_each_block$1(key_1, ctx) {
    	let div;
    	let polldetails;
    	let t;
    	let div_intro;
    	let div_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;

    	polldetails = new PollDetails({
    			props: { poll: /*poll*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			create_component(polldetails.$$.fragment);
    			t = space();
    			add_location(div, file$2, 21, 8, 649);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(polldetails, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const polldetails_changes = {};
    			if (dirty & /*$PollStore*/ 1) polldetails_changes.poll = /*poll*/ ctx[1];
    			polldetails.$set(polldetails_changes);
    		},
    		r: function measure() {
    			rect = div.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(div);
    			stop_animation();
    			add_transform(div, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(div, rect, flip, { duration: 500 });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(polldetails.$$.fragment, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, fade, {});
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(polldetails.$$.fragment, local);
    			if (div_intro) div_intro.invalidate();

    			if (local) {
    				div_outro = create_out_transition(div, scale, {});
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(polldetails);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(21:4) {#each $PollStore as poll (poll.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*$PollStore*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*poll*/ ctx[1].id;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(section, "class", "poll-list svelte-31vrvu");
    			add_location(section, file$2, 19, 0, 570);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$PollStore*/ 1) {
    				each_value = /*$PollStore*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, section, fix_and_outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $PollStore;
    	validate_store(pollStore, 'PollStore');
    	component_subscribe($$self, pollStore, $$value => $$invalidate(0, $PollStore = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PollsList', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PollsList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fade,
    		scale,
    		flip,
    		PollStore: pollStore,
    		PollDetails,
    		$PollStore
    	});

    	return [$PollStore];
    }

    class PollsList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PollsList",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\shared\tabs.svelte generated by Svelte v3.46.4 */
    const file$1 = "src\\shared\\tabs.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (8:8) {#each items as item (item)}
    function create_each_block(key_1, ctx) {
    	let li;
    	let div;
    	let t0_value = /*item*/ ctx[4] + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*item*/ ctx[4]);
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div, "class", "svelte-dchwx8");
    			toggle_class(div, "active", /*item*/ ctx[4] === /*activeItem*/ ctx[1]);
    			add_location(div, file$1, 9, 16, 302);
    			attr_dev(li, "class", "svelte-dchwx8");
    			add_location(li, file$1, 8, 12, 235);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*items*/ 1 && t0_value !== (t0_value = /*item*/ ctx[4] + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*items, activeItem*/ 3) {
    				toggle_class(div, "active", /*item*/ ctx[4] === /*activeItem*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(8:8) {#each items as item (item)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[4];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "svelte-dchwx8");
    			add_location(ul, file$1, 6, 4, 179);
    			attr_dev(div, "class", "tabs svelte-dchwx8");
    			add_location(div, file$1, 5, 0, 155);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*dispatch, items, activeItem*/ 7) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, destroy_block, create_each_block, null, get_each_context);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tabs', slots, []);
    	const dispatch = createEventDispatcher();
    	let { items, activeItem } = $$props;
    	const writable_props = ['items', 'activeItem'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabs> was created with unknown prop '${key}'`);
    	});

    	const click_handler = item => dispatch('tabChange', item);

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('activeItem' in $$props) $$invalidate(1, activeItem = $$props.activeItem);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		items,
    		activeItem
    	});

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    		if ('activeItem' in $$props) $$invalidate(1, activeItem = $$props.activeItem);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [items, activeItem, dispatch, click_handler];
    }

    class Tabs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { items: 0, activeItem: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*items*/ ctx[0] === undefined && !('items' in props)) {
    			console.warn("<Tabs> was created without expected prop 'items'");
    		}

    		if (/*activeItem*/ ctx[1] === undefined && !('activeItem' in props)) {
    			console.warn("<Tabs> was created without expected prop 'activeItem'");
    		}
    	}

    	get items() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeItem() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeItem(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */
    const file = "src\\App.svelte";

    // (26:44) 
    function create_if_block_1(ctx) {
    	let createpollform;
    	let current;
    	createpollform = new CreatePollForm({ $$inline: true });
    	createpollform.$on("addPoll", /*handleAddPoll*/ ctx[3]);

    	const block = {
    		c: function create() {
    			create_component(createpollform.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(createpollform, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(createpollform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(createpollform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(createpollform, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(26:44) ",
    		ctx
    	});

    	return block;
    }

    // (24:4) {#if activeItem === 'Create Polls'}
    function create_if_block(ctx) {
    	let pollslist;
    	let current;
    	pollslist = new PollsList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(pollslist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(pollslist, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(pollslist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(pollslist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(pollslist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(24:4) {#if activeItem === 'Create Polls'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let header;
    	let t0;
    	let main;
    	let tabs;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let footer;
    	let current;
    	header = new Header({ $$inline: true });

    	tabs = new Tabs({
    			props: {
    				activeItem: /*activeItem*/ ctx[0],
    				items: /*items*/ ctx[1]
    			},
    			$$inline: true
    		});

    	tabs.$on("tabChange", /*tabChange*/ ctx[2]);
    	const if_block_creators = [create_if_block, create_if_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*activeItem*/ ctx[0] === 'Create Polls') return 0;
    		if (/*activeItem*/ ctx[0] === 'Add New Poll') return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	footer = new Footer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(header.$$.fragment);
    			t0 = space();
    			main = element("main");
    			create_component(tabs.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			t2 = space();
    			create_component(footer.$$.fragment);
    			attr_dev(main, "class", "svelte-nblfrb");
    			add_location(main, file, 21, 0, 556);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(header, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(tabs, main, null);
    			append_dev(main, t1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(main, null);
    			}

    			insert_dev(target, t2, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tabs_changes = {};
    			if (dirty & /*activeItem*/ 1) tabs_changes.activeItem = /*activeItem*/ ctx[0];
    			tabs.$set(tabs_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(main, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(tabs.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(tabs.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(header, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(tabs);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (detaching) detach_dev(t2);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const items = ['Create Polls', 'Add New Poll'];
    	let activeItem = 'Create Polls';

    	const tabChange = e => {
    		$$invalidate(0, activeItem = e.detail);
    	};

    	const handleAddPoll = () => {
    		$$invalidate(0, activeItem = 'Create Polls');
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Header,
    		Footer,
    		CreatePollForm,
    		PollsList,
    		Tabs,
    		items,
    		activeItem,
    		tabChange,
    		handleAddPoll
    	});

    	$$self.$inject_state = $$props => {
    		if ('activeItem' in $$props) $$invalidate(0, activeItem = $$props.activeItem);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [activeItem, items, tabChange, handleAddPoll];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
