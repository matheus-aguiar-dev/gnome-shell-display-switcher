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
const Gettext = imports.gettext;
const _ = Gettext.domain('monitordisplay').gettext;
const Gio = imports.gi.Gio;

let container;

function init() {
    _realHasOverview = Main.sessionMode.hasOverview;
    ExtensionUtils.initTranslations(Me.metadata['gettext-domain']);
}

function notify(msg, details, icon) {
	Main.notify(msg, details, icon);
}

function runCommand() {
		    // Comando a ser executado
            let command = "sh -c 'cat /sys/class/drm/card0/*HDMI*/status | grep -w connected'";

   	    let [, stdout, stderr, exitCode] = GLib.spawn_command_line_sync(command);
	    let hdmiConect = stdout;
	    if (exitCode !== 0) {
        	return;
    		}
   	    let decoder = new TextDecoder();
    	    hdmiConect = decoder.decode(hdmiConect);
    	    return hdmiConect;  // Retorna o valor de hdmiConect

}
function changeDisplay(id){
	let resultadoHdmi = runCommand();
	if(!resultadoHdmi){
	   resultadoHdmi = "null";
	}
	let conectado = "connected";
	if (resultadoHdmi.trim() === conectado) {
		Meta.MonitorManager.get().switch_config(id);
	} else	{
		log("HDMI não conectado");
		notify(_("HDMI not connected."), _("You must have HDMI connected."), 'dialog-information');
	}
}

let mouseMoveTimeoutId;

function enable () {
	global.panel= new SwitcherPanel();
	global.panel.createWidget(_('Mirrored'),"view-mirror-symbolic",changeDisplay, 0)
	global.panel.createWidget(_('Extended'),"video-joined-displays-symbolic",changeDisplay, 1)
	global.panel.createWidget(_('Secondary Only'),"computer-symbolic",changeDisplay, 2)
	global.panel.createWidget(_('Primary Only'),"video-single-display-symbolic",changeDisplay, 3)

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
