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


import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';

import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';

let lockScreenButton;
let daemonProcess;

function startDaemonMode() {
  daemonProcess = Gio.Subprocess.new(['xscreensaver-command', '-watch'], Gio.SubprocessFlags.STDOUT_PIPE);
  daemonProcess.init(null);
}

function lockScreen() {
  let [success, pid] = Gio.Subprocess.new(['xscreensaver-command', '-lock'], Gio.SubprocessFlags.NONE);
  if (success) {
    pid.wait(null);
  }
}

export default class LockScreenPopupExtension extends Extension {
  enable() {
    lockScreenButton = new PanelMenu.Button(0.0, "Lock Screen");
    let button = new St.Button();
    button.set_child(lockScreenButton);
    lockScreenButton.add_child(button);

    startDaemonMode();

    button.connect('clicked', () => {
      lockScreen();
    });

    Main.panel.addToStatusArea(this.metadata.uuid, lockScreenButton);
  }

  disable() {
    if (daemonProcess) {
      daemonProcess.force_exit();
      daemonProcess = null;
    }
    lockScreenButton.destroy();
  }
}
