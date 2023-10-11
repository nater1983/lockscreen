/* exported init */
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Util from 'gi://Util';
import Main from 'gi://Main';

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
}

function _lockScreenActivate() {
    Util.spawn(['/bin/bash', '-c', 'xscreensaver-command -lock']);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(_lockScreenButton, 0);
}

function disable() {
    Main.panel._rightBox.remove_actor(_lockScreenButton);
}
