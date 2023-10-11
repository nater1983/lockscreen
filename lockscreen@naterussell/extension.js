/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import GObject from 'gi://GObject';
import GLib from 'gi://GLib';
import St from 'gi://St';
import Clutter from 'gi://Clutter';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

// Main panel menu for the extension
let lockScreenButton;

// LockScreenButton class
const LockScreenButton = GObject.registerClass(
  class LockScreenButton extends PanelMenu.Button {
    _init() {
      super._init(0);

      let label = new St.Label({
        text: "Lock Screen",
        y_align: Clutter.ActorAlign.CENTER,
      });

      this.add_child(label);

      let icon = new St.Icon({
        icon_name: 'changes-prevent-symbolic',
        style_class: 'system-status-icon',
      });

      this.set_child(icon);
      this.connect('button-press-event', this._lockScreenActivate);
    }

    _lockScreenActivate() {
      let [success, pid] = Gio.Subprocess.new(['xscreensaver-command', '-lock'], Gio.SubprocessFlags.NONE);
      if (success) {
        pid.wait(null);
      }
    }
  }
);

// Main extension class
export default class LockScreenPopupExtension extends Extension {
  enable() {
    this._lockScreenButton = new LockScreenButton();
    Main.panel.addToStatusArea(this.uuid, this._lockScreenButton);

    // Listen for lock and unlock signals
    global.screen.connect('lock-screen', () => {
      this._lockScreenButton.hide();
    });

    global.screen.connect('unlock-screen', () => {
      this._lockScreenButton.show();
    });
  }

  disable() {
    this._lockScreenButton.destroy();
    this._lockScreenButton = null;
  }
}
