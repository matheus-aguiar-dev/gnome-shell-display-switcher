const GLib = imports.gi.GLib;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const SwitcherPanel = Me.imports.panel.SwitcherPanel; 
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const { GObject, GnomeDesktop } = imports.gi;

let container;


function changeDisplay(id){
	Meta.MonitorManager.get().switch_config(id);
}

let mouseMoveTimeoutId;

function enable () {
	global.panel= new SwitcherPanel();
	global.panel.createWidget("Mirrored","view-mirror-symbolic",changeDisplay, 0)
	global.panel.createWidget("Extended","video-joined-displays-symbolic",changeDisplay, 1)
	global.panel.createWidget("Primary Only","video-single-display-symbolic",changeDisplay, 2)
	global.panel.createWidget("Secondary Only","computer-symbolic",changeDisplay, 3)

	let my_settings = ExtensionUtils.getSettings("org.gnome.shell.extensions.monitor-display-switcher");
	Main.wm.addKeybinding("keybinding", my_settings,
		Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
		Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
		() => {
			global.panel.displaySwitch();
               		global.panel.timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 7000, () => {
                    		global.panel.fadeAndOut();  // Chame a função que fecha a janela aqui
                    		return GLib.SOURCE_REMOVE;
                		});
    		});

}

function disable () {
	if (global.panel.timeoutId) {
      		GLib.source_remove(global.panel.timeoutId);
   	}
	global.panel.destroy();
	/*Main.layoutManager.removeChrome(container);
	*/
}
