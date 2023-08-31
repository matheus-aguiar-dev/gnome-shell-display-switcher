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

function enable () {
	global.panel= new SwitcherPanel();
	global.panel.createWidget("Espelhado","view-mirror-symbolic",changeDisplay, 0)
	global.panel.createWidget("Extendido","video-joined-displays-symbolic",changeDisplay, 1)
	global.panel.createWidget("Apenas Externo","video-single-display-symbolic",changeDisplay, 2)
	global.panel.createWidget("Apenas Externo","computer-symbolic",changeDisplay, 3)
	let my_settings = ExtensionUtils.getSettings("org.gnome.shell.extensions.monitor-display-switcher");
	Main.wm.addKeybinding("keybinding", my_settings,
		Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
		Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
		() => {
			global.panel.displaySwitch();
		});
}

function disable () {
	global.panel.destroy();
	/*Main.layoutManager.removeChrome(container);
	*/
}
