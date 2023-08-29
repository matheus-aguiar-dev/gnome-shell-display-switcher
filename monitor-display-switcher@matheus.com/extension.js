// Example#7
//
const ExtensionUtils = imports.misc.extensionUtils;
const GLib = imports.gi.GLib;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell
const Main = imports.ui.main;
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const { GObject, GnomeDesktop } = imports.gi;

let container;

function onKeyPress(){
	let monitor = Main.layoutManager.primaryMonitor;
	let size = 300;
	let [xPos, yPos] = container.get_position();
	if(xPos === monitor.x +  monitor.width-size){
		container.ease({    
			x: monitor.x + monitor.width,
			y: monitor.y + 0,
			opacity: 0,
			duration: 500,
			onComplete: () => {
				container.width = 0 ;
			}
		});
	}
	else{
		container.width = size ;
		container.ease({    
			x: monitor.x + monitor.width-size,
			y: monitor.y + 0,
			opacity: 255,
			duration: 500,
		});
	}

}

function init () {

	let monitor = Main.layoutManager.primaryMonitor;
	let size = 300;
	container = new St.Bin({
		style: 'background-color: grey',
		reactive : true,
		can_focus : true,
		track_hover : true,
		width: size,
		height: monitor.height,
	});

	container.set_position(monitor.x + monitor.width-size, monitor.y+0);

	let vbox = new St.BoxLayout({ vertical: true});
	let hboxMode1 = new St.BoxLayout({ vertical: false });
	let hboxMode2 = new St.BoxLayout({ vertical: false });
	let hboxMode3 = new St.BoxLayout({ vertical: false });
	let hboxMode4 = new St.BoxLayout({ vertical: false });
	hboxMode1.reactive = true;
	hboxMode2.reactive = true;
	hboxMode3.reactive = true;
	hboxMode4.reactive = true;

	hboxMode1.connect('button-press-event', () => {
        Meta.MonitorManager.get().switch_config(0);
	});

	hboxMode2.connect('button-press-event', () => {
		// Perform the desired action here
        Meta.MonitorManager.get().switch_config(1);
	});

	hboxMode3.connect('button-press-event', () => {
        Meta.MonitorManager.get().switch_config(2);
	});
	hboxMode4.connect('button-press-event', () => {
        Meta.MonitorManager.get().switch_config(3);
	});
	let imageMode1 = new St.Icon({
		icon_name: 'image-name',
		style:"margin-left:20px; margin-top:40px",
		style_class: 'system-status-icon'
	});
	let labelMode1 = new St.Label({ text: 'My Label', style:'margin-left: 10px; margin-top:30px', y_align: Clutter.ActorAlign.CENTER });
	let imageMode2 = new St.Icon({
		icon_name: 'image-name',
		style:"margin-left:20px; margin-top:40px",
		style_class: 'system-status-icon'
	});
	let labelMode2 = new St.Label({ text: 'My Label', style:'margin-left: 10px; margin-top:30px', y_align: Clutter.ActorAlign.CENTER });
	let imageMode3 = new St.Icon({
		icon_name: 'image-name',
		style:"margin-left:20px; margin-top:40px",
		style_class: 'system-status-icon'
	});
	let labelMode3 = new St.Label({ text: 'My Label', style:'margin-left: 10px; margin-top:30px', y_align: Clutter.ActorAlign.CENTER });
	let imageMode4 = new St.Icon({
		icon_name: 'image-name',
		style:"margin-left:20px; margin-top:40px",
		style_class: 'system-status-icon'
	});
	let labelMode4 = new St.Label({ text: 'My Label', style:'margin-left: 10px; margin-top:30px', y_align: Clutter.ActorAlign.CENTER });

	hboxMode1.add_child(imageMode1);
	hboxMode1.add_child(labelMode1);
	hboxMode2.add_child(imageMode2);
	hboxMode2.add_child(labelMode2);
	hboxMode3.add_child(imageMode3);
	hboxMode3.add_child(labelMode3);
	hboxMode4.add_child(imageMode4);
	hboxMode4.add_child(labelMode4);
	vbox.add_child(hboxMode1);
	vbox.add_child(hboxMode2);
	vbox.add_child(hboxMode3);
	vbox.add_child(hboxMode4);

	container.set_child(vbox);
}

function enable () {
	Main.layoutManager.addChrome(container, {
		affectsInputRegion : true,
		trackFullscreen : true,
	});
	let my_settings = ExtensionUtils.getSettings("org.gnome.shell.extensions.monitor-display-switcher");
	Main.wm.addKeybinding("keybinding", my_settings,
		Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
		Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
		() => {
			onKeyPress();
		});
}

function disable () {
	Main.layoutManager.removeChrome(container);
}
