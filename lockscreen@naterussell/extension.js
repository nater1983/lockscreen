/* exported init */
import Gio from 'gi://Gio';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

let _lockScreenButton = null;

function init() {
    _lockScreenButton = new St.Bin({
        style_class: 'panel-button',
        reactive: true,
        can_focus: true,
        y_align: Clutter.ActorAlign.CENTER,
        track_hover: true,
    });

    let icon = new St.Icon({
        icon_name: 'changes-prevent-symbolic',
        style_class: 'system-status-icon',
    });

    _lockScreenButton.set_child(icon);
    _lockScreenButton.connect('button-press-event', _lockScreenActivate);

    // Listen for lock and unlock signals
    global.screen.connect('lock-screen', () => {
        _lockScreenButton.hide();
    });

    global.screen.connect('unlock-screen', () => {
        _lockScreenButton.show();
    });
}

function _lockScreenActivate() {
    let [success, pid] = Gio.Subprocess.new(['xscreensaver-command', '-lock'], Gio.SubprocessFlags.NONE);
    if (success) {
        pid.wait(null);
    }
}

function enable() {
    Main.panel.addToStatusArea('lockScreenButton', _lockScreenButton, 0, 'right');
}

function disable() {
    Main.panel.statusArea['lockScreenButton'].destroy();
}

let _lockScreenButton = null;

function init() {
    _lockScreenButton = new St.Bin({
        style_class: 'panel-button',
        reactive: true,
        can_focus: true,
        y_align: Clutter.ActorAlign.CENTER,
        track_hover: true
    });

    let icon = new St.Icon({
        icon_name: 'changes-prevent-symbolic',
        style_class: 'system-status-icon'
    });

    _lockScreenButton.set_child(icon);
    _lockScreenButton.connect('button-press-event', _lockScreenActivate);

    // Listen for lock and unlock signals
    global.screen.connect('lock-screen', () => {
        _lockScreenButton.hide();
    });

    global.screen.connect('unlock-screen', () => {
        _lockScreenButton.show();
    });
}

function _lockScreenActivate() {
    let [success, pid] = Gio.Subprocess.new(['xscreensaver-command', '-lock'], Gio.SubprocessFlags.NONE);
    if (success) {
        pid.wait(null);
    }
}

function enable() {
    Main.panel.addToStatusArea('lockScreenButton', _lockScreenButton, 0, 'right');
}

function disable() {
    Main.panel.statusArea['lockScreenButton'].destroy();
}
