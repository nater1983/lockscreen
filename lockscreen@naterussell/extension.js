/* exported init */
import Gio from 'gi://Gio';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Main from 'gi://Main';

let _lockScreenButton = null;
let _lockScreenActive = false;

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
    Main.screenShield.connect('locked', () => {
        _lockScreenActive = true;
        _lockScreenButton.hide();
    });

    Main.screenShield.connect('unlocked', () => {
        _lockScreenActive = false;
        if (!_lockScreenButton.visible)
            _lockScreenButton.show();
    });
}

function _lockScreenActivate() {
    Gio.Subprocess.new(['xscreensaver-command', '-lock'], Gio.SubprocessFlags.NONE);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(_lockScreenButton, 0);
    if (_lockScreenActive)
        _lockScreenButton.hide();
}

function disable() {
    Main.panel._rightBox.remove_actor(_lockScreenButton);
}
