import Gio from 'gi://Gio';
import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';

import { Extension, gettext as _ } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

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

    this.connect('button-press-event', this._lockScreenActivate);
  }

  _lockScreenActivate() {
    let [success, pid] = Gio.Subprocess.new(['xscreensaver-command', '-lock'], Gio.SubprocessFlags.NONE);
    if (success) {
      pid.wait(null);
    }
  }
});

// Main extension class
export default class LockScreenPopupExtension extends Extension {
  enable() {
    this._lockScreenButton = new LockScreenButton();
    Main.panel.addToStatusArea(this.metadata.uuid, this._lockScreenButton);

    // Listen for lock and unlock signals
    this._lockScreenSignalId = global.display.connect('lock-screen', () => {
      this._lockScreenButton.visible = false;
    });

    this._unlockScreenSignalId = global.display.connect('unlock-screen', () => {
      this._lockScreenButton.visible = true;
    });
  }

  disable() {
    global.display.disconnect(this._lockScreenSignalId);
    global.display.disconnect(this._unlockScreenSignalId);
    this._lockScreenButton.destroy();
    this._lockScreenButton = null;
  }
}
