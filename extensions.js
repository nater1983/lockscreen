/*
 * Copyright © 2021 Daniel García
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public License
 * as published by the Free Software Foundation; either version 2 of
 * the license, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser
 * General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library. If not, see <http://www.gnu.org/licenses/>.
 *
 * Author: Daniel García <dagaba13@gmail.com>
 * Based on: https://github.com/sramkrishna/gnome3-extensions
 * Author: Sriram Ramkrishna <sri@ramkrishna.me>
 */

import { St, Clutter } from 'gnome-shell';
import Main from 'gnome-shell';
import Util from 'gnome-shell';

let _lockScreenButton = null;

class LockScreenButton {
    constructor() {
        _lockScreenButton = new St.Bin({
            style_class: 'panel-button',
            reactive: true,
            can_focus: true,
            y_align: Clutter.ActorAlign.CENTER,
            track_hover: true,
        });

        const icon = new St.Icon({
            icon_name: 'changes-prevent-symbolic',
            style_class: 'system-status-icon',
        });

        _lockScreenButton.set_child(icon);
        _lockScreenButton.connect('button-press-event', this._lockScreenActivate.bind(this));
    }

    _lockScreenActivate() {
        Util.spawn(['/bin/bash', '-c', 'xscreensaver-command -lock']);
    }

    enable() {
        Main.panel._rightBox.insert_child_at_index(_lockScreenButton, 0);
    }

    disable() {
        Main.panel._rightBox.remove_actor(_lockScreenButton);
    }
}

export function init() {
    return new LockScreenButton();
}
