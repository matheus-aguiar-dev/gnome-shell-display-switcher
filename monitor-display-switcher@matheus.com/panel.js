const GLib = imports.gi.GLib;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const { GObject, GnomeDesktop } = imports.gi;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const POPUP_DELAY_TIMEOUT = 2000

var SwitcherPanel = GObject.registerClass(class SwitcherPanel extends St.Widget {
	_init() {
		super._init({reactive: true})
		this.monitor = Main.layoutManager.primaryMonitor;
		this.selectedIndex = 0;
		this.panelSize = 300;
		this.items = [];
		this.panel = new St.Bin({
			style: 'background-color: grey',
			reactive: true,
			can_focus: true,
			track_hover: true,
			width: this.panelSize,
			height: this.monitor.height,
			opacity:0,
			});
		//	this.add_actor(this.panel)
		this.vbox = new St.BoxLayout({ vertical: true}); 
		this.panel.set_child(this.vbox);
		this.panel.set_position(this.monitor.x + this.monitor.width, this.monitor.y );
		Main.layoutManager.addChrome(this, {
			affectsInputRegion : true,
			trackFullscreen : true,
			});
		Main.uiGroup.add_actor(this);
	}

	displaySwitch()
	{
		this.monitor = Main.layoutManager.primaryMonitor;
		let [xPos, yPos] = this.panel.get_position();
		if(xPos === this.monitor.x +  this.monitor.width-this.panelSize){
			this.fadeAndOut();
		}
		else{
			this.add_actor(this.panel);
			this.panel.width = this.panelSize ;
			this.panel.ease({    
				x: this.monitor.x + this.monitor.width - this.panelSize,
				y: this.monitor.y + 0,
				opacity: 255,
				duration: 500,
				});
			}
	}
	vfunc_button_press_event(event) {
		this.fadeAndOut();
		return Clutter.EVENT_STOP;  // Indicate that the event is handled
		}

	/*
	    GLib.source_remove(_initialDelayTimeoutId);
    _initialDelayTimeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, POPUP_DELAY_TIMEOUT, () => {
	this.displaySwitch();
	return GLib.SOURCE_REMOVE;
    });
	 */
	createWidget(name, img, callback, index){
		let hbox = new St.BoxLayout({ vertical: false });
		hbox.reactive = true;
		hbox.connect('button-press-event', () => {
			callback(index);
			this.displaySwitch();
			});
		hbox.connect('enter-event', () =>{
				this.selected(index)
			} );
		let imageWidget = new St.Icon({
			icon_name:  img,
			style:"margin-left:20px; margin-top:40px",
			style_class: 'system-status-icon'
			});
		let labelWidget = new St.Label({ text: name,
			style: `margin-left: 15px;
				margin-top: 35px;
				font-size: 20px;
				font-weight: bold;
				`, 
			y_align: Clutter.ActorAlign.CENTER });
		hbox.add_child(imageWidget);
		hbox.add_child(labelWidget);
		this.items.push(hbox);
		this.vbox.add_child(hbox);
		}
	selected(index){
		log(this.items)
		}
	fadeAndOut(){
		this.panel.ease({    
			x: this.monitor.x + this.monitor.width,
			y: this.monitor.y + 0,
			opacity: 0,
			duration: 500,
			onComplete: () => {
				this.panel.width = 0 ;
			this.remove_actor(this.panel);
				}
			});
		}
	destroy()
	{
		Main.layoutManager.removeChrome(this.panel);
		}
})
